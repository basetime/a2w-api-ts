import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { baseUrl } from '../src/constants';
import { CampaignsEndpoint, ClaimsEndpoint, Client, KeysProvider } from '../src/index';

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
    fetchMock.get(`${baseUrl}/campaigns`, { campaigns: [] });
    await client.fetch('/campaigns', {});

    const lastCalled = fetchMock.lastCall();
    expect(lastCalled).to.not.be.undefined;
    expect(lastCalled?.[0]).to.be.equal(`${baseUrl}/campaigns`);
  });

  /**
   *
   */
  it('should return endpoints', () => {
    expect(client.campaigns).to.be.instanceOf(CampaignsEndpoint);
    expect(client.claims).to.be.instanceOf(ClaimsEndpoint);
  });
});
