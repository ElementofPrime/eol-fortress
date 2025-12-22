import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { createEbayClient, fetchAccessToken } from '../ebay-api-fortress/src/lib/ebay-auth.js';

vi.mock('axios', () => {
  const post = vi.fn();
  const create = vi.fn();
  return {
    default: {
      post,
      create,
    },
    post,
    create,
  };
});

const sandboxEnv = {
  EBAY_API_ENDPOINT: 'https://api.sandbox.ebay.com',
  EBAY_CLIENT_ID: 'test-client-id',
  EBAY_CLIENT_SECRET: 'test-client-secret',
  EBAY_REFRESH_TOKEN: 'test-refresh-token',
};

function setSandboxEnv() {
  Object.entries(sandboxEnv).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

function clearSandboxEnv() {
  Object.keys(sandboxEnv).forEach((key) => {
    delete process.env[key];
  });
}

describe('ebay-auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setSandboxEnv();
  });

  afterEach(() => {
    clearSandboxEnv();
  });

  it('creates an axios client with a refreshed token and supports sandbox ping', async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: { username: 'sandbox-user' } }),
    };

    axios.create.mockReturnValue(mockClient);
    axios.post.mockResolvedValue({
      data: {
        access_token: 'fresh-token',
        expires_in: 7200,
        token_type: 'Application Access Token',
      },
    });

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { client, token } = await createEbayClient();

    expect(token.accessToken).toBe('fresh-token');
    expect(axios.post).toHaveBeenCalledWith(
      '/identity/v1/oauth2/token',
      expect.stringContaining('grant_type=refresh_token'),
      expect.objectContaining({
        baseURL: sandboxEnv.EBAY_API_ENDPOINT,
      }),
    );

    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: sandboxEnv.EBAY_API_ENDPOINT,
        headers: expect.objectContaining({
          Authorization: 'Bearer fresh-token',
        }),
      }),
    );

    await client.get('/identity/v1/get_user');
    expect(mockClient.get).toHaveBeenCalledWith('/identity/v1/get_user');

    expect(consoleSpy).toHaveBeenCalledWith('Auth: Sandbox locked—ready for 13.25% margin sims.');
    consoleSpy.mockRestore();
  });

  it('throws when token response fails validation', async () => {
    axios.post.mockResolvedValue({ data: { access_token: 123 } });

    await expect(fetchAccessToken()).rejects.toThrow('Invalid token response');
  });

  it('throws if required credentials are missing', async () => {
    delete process.env.EBAY_CLIENT_SECRET;
    axios.post.mockResolvedValue({
      data: {
        access_token: 'token',
        expires_in: 1,
        token_type: 'type',
      },
    });

    await expect(fetchAccessToken()).rejects.toThrow(
      'Missing required eBay credential: EBAY_CLIENT_SECRET',
    );
  });
});
