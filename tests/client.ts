import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { CampaignsEndpoint, ClaimsEndpoint, Client } from '../src/index';

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
    fetchMock.post(`${Client.baseDev}/auth/apiGrant`, {
      idToken,
      refreshToken,
      expiresAt: Date.now() + 1000,
    });

    client = new Client(key, secret);
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
  it('makeRequest should succeed', async () => {
    fetchMock.get('/campaigns', { campaigns: [] });
    await client.makeRequest('/campaigns', {});

    const lastCalled = fetchMock.lastCall();
    expect(lastCalled).to.not.be.undefined;
    expect(lastCalled?.[0]).to.be.equal('/campaigns');
  });

  /**
   *
   */
  it('should return endpoints', () => {
    expect(client.campaigns).to.be.instanceOf(CampaignsEndpoint);
    expect(client.claims).to.be.instanceOf(ClaimsEndpoint);
  });
});
