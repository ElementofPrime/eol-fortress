// src/config/env.js
// Profit: Centralizes env validation so bad config fails fast instead of corrupting eBay ops.
import 'dotenv/config';

export function getRuntimeEnv() {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const debug = Boolean(process.env.DEBUG);

  return { nodeEnv, debug };
}

export function getEbayEnv() {
  const environment = process.env.EBAY_ENVIRONMENT || 'sandbox';

  const apiEndpoint =
    process.env.EBAY_API_ENDPOINT ||
    (environment === 'production' ? 'https://api.ebay.com' : 'https://api.sandbox.ebay.com');

  return {
    environment,
    apiEndpoint,
    appId: process.env.EBAY_APP_ID,
    clientId: process.env.EBAY_CLIENT_ID,
    clientSecret: process.env.EBAY_CLIENT_SECRET,
    refreshToken: process.env.EBAY_REFRESH_TOKEN,
  };
}
