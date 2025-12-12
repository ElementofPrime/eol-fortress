// ebay-api-fortress/src/lib/ebay-auth.js
// Profit: Hardened OAuth + Axios client so every command can safely talk to eBay.

import axios from 'axios';
import { Buffer } from 'node:buffer';
import { URLSearchParams } from 'node:url';
import { z } from 'zod';
import { getEbayEnv } from '../config/env.js';

const tokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
});

function ensureCredential(value, name) {
  if (!value) {
    throw new Error(`Missing required eBay credential: ${name}`);
  }
  return value;
}

function buildBasicAuthHeader(clientId, clientSecret) {
  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  return `Basic ${encoded}`;
}

function getBaseHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchAccessToken({ scope } = {}) {
  const { apiEndpoint, clientId, clientSecret, refreshToken, environment } = getEbayEnv();

  ensureCredential(clientId, 'EBAY_CLIENT_ID');
  ensureCredential(clientSecret, 'EBAY_CLIENT_SECRET');
  ensureCredential(refreshToken, 'EBAY_REFRESH_TOKEN');

  const payload = new URLSearchParams();
  payload.append('grant_type', 'refresh_token');
  payload.append('refresh_token', refreshToken);
  if (scope) {
    payload.append('scope', scope);
  }

  const response = await axios.post('/identity/v1/oauth2/token', payload.toString(), {
    baseURL: apiEndpoint,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: buildBasicAuthHeader(clientId, clientSecret),
    },
  });

  const parsed = tokenResponseSchema.safeParse(response.data);
  if (!parsed.success) {
    throw new Error(`Invalid token response from eBay: ${parsed.error.message}`);
  }

  if (environment === 'sandbox') {
    console.log('Auth: Sandbox locked—ready for 13.25% margin sims.');
  }

  return {
    accessToken: parsed.data.access_token,
    expiresIn: parsed.data.expires_in,
    tokenType: parsed.data.token_type,
  };
}

export async function createEbayClient(options = {}) {
  const token = await fetchAccessToken(options);
  const { apiEndpoint } = getEbayEnv();

  const client = axios.create({
    baseURL: apiEndpoint,
    headers: getBaseHeaders(token.accessToken),
  });

  return { client, token };
}

export const tokenSchema = tokenResponseSchema;
