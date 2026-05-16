import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { getBaseUrl } from '../../../constants';
import { Client, KeysProvider } from '../../../index';

const baseUrl = getBaseUrl();
const endpoint = '/campaigns';

describe('CampaignStatsEndpoint', () => {
  const authUrl = `${baseUrl}/auth/apiGrant`;
  const key = 'api_key';
  const secret = 'api_secret';
  let client: Client;

  /**
   *
   */
  beforeEach(() => {
    fetchMock.post(authUrl, {
      idToken: 'xxxxxxxx',
      refreshToken: 'yyyyyyyy',
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
  it('get() should GET /campaigns/:id/stats', async () => {
    const campaignId = 'UUUUUU';
    const url = `${baseUrl}${endpoint}/${campaignId}/stats?api=true`;
    fetchMock.get(url, { countMacType: 1 });

    const stats = await client.campaigns.stats.get(campaignId);
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(stats).to.be.an('object');
  });
});
