import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { getBaseUrl } from '../../../constants';
import { Client, KeysProvider } from '../../../index';

const baseUrl = getBaseUrl();
const endpoint = '/campaigns';

describe('CampaignJobsEndpoint', () => {
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
  it('getAll() should GET /campaigns/:id/jobs', async () => {
    const campaignId = 'UUUUUU';
    const url = `${baseUrl}${endpoint}/${campaignId}/jobs?api=true`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const jobs = await client.campaigns.jobs.getAll(campaignId);
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(jobs).to.be.an('array');
  });
});
