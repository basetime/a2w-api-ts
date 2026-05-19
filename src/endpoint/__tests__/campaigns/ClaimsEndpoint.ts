import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { DEFAULT_BASE_URL } from '../../../constants';
import { Client, KeysProvider } from '../../../index';

const baseUrl = DEFAULT_BASE_URL;
const endpoint = '/campaigns';

describe('CampaignClaimsEndpoint', () => {
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
  it('getAll() should GET /campaigns/:id/claims', async () => {
    const campaignId = 'UUUUUU';
    const url = `${baseUrl}${endpoint}/${campaignId}/claims?api=true`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const claims = await client.campaigns.claims.getAll(campaignId);
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(claims).to.be.an('array');
  });
});
