import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { CampaignsEndpoint, Client } from '../src/index';

describe('CampaignsEndpoint', () => {
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
  it('getPasses() to succeed', async () => {
    const campaignId = 'UUUUUU';
    fetchMock.get(`${CampaignsEndpoint.endpoint}/${campaignId}/passes`, []);

    const passes = await client.campaigns.getPasses(campaignId);

    expect(fetchMock.called()).to.be.true;
    expect(passes).to.be.an('array');
  });
});
