import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { DEFAULT_BASE_URL } from '../constants';
import { CampaignsEndpoint, ClaimsEndpoint, Client, KeysProvider } from '../index';

const baseUrl = DEFAULT_BASE_URL;

describe('Client', () => {
  const key = 'api_key';
  const secret = 'api_secret';
  let client: Client;

  /**
   *
   */
  beforeEach(() => {
    const idToken = 'xxxxxxxx';
    const refreshToken = 'yyyyyyyy';
    fetchMock.post(`${baseUrl}/auth/apiGrant`, {
      idToken,
      refreshToken,
      expiresAt: Date.now() + 1000,
    });

    const auth = new KeysProvider(key, secret, console);
    client = new Client(auth);
  });

  /**
   *
   */
  afterEach(() => {
    fetchMock.reset();
  });

  /**
   *
   */
  it('fetch() should succeed', async () => {
    fetchMock.get(`${baseUrl}/campaigns?api=true`, { campaigns: [] });
    await client.http.fetch('/campaigns', {});

    const lastCalled = fetchMock.lastCall();
    expect(lastCalled).to.not.be.undefined;
    expect(lastCalled?.[0]).to.be.equal(`${baseUrl}/campaigns?api=true`);
  });

  /**
   *
   */
  it('should return endpoints', () => {
    expect(client.campaigns).to.be.instanceOf(CampaignsEndpoint);
    expect(client.claims).to.be.instanceOf(ClaimsEndpoint);
  });
});
