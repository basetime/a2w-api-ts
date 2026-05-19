import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { DEFAULT_BASE_URL } from '../../../constants';
import { Client, KeysProvider } from '../../../index';

const baseUrl = DEFAULT_BASE_URL;
const endpoint = '/campaigns';

describe('CampaignWalletsEndpoint', () => {
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
  it('getAll() should GET /campaigns/:id/wallets', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${endpoint}/${campaignId}/wallets?api=true`;
    fetchMock.get(url, { bundled: {}, bundles: [], page: 1, totalItems: 0, totalPages: 0 });

    const result = await client.campaigns.wallets.getAll(campaignId);
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('object');
  });

  /**
   *
   */
  it('getAll() should attach page and perPage query params when supplied', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${endpoint}/${campaignId}/wallets?page=2&perPage=25&api=true`;
    fetchMock.get(url, { bundled: {}, bundles: [], page: 2, totalItems: 0, totalPages: 0 });

    await client.campaigns.wallets.getAll(campaignId, { page: 2, perPage: 25 });
    expect(fetchMock.called(url)).to.be.true;
  });

  /**
   *
   */
  it('getEnrollment() should GET /campaigns/:id/wallets/enrollments/:enrollmentId', async () => {
    const campaignId = 'C01';
    const enrollmentId = 'E01';
    const url = `${baseUrl}${endpoint}/${campaignId}/wallets/enrollments/${enrollmentId}?api=true`;
    fetchMock.get(url, { campaign: {}, enrollment: { id: enrollmentId } });

    const result = await client.campaigns.wallets.getEnrollment(campaignId, enrollmentId);
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('object');
  });

  /**
   *
   */
  it('getPushLogs() should GET /campaigns/:id/wallets/pushes/:passId/logs', async () => {
    const campaignId = 'C01';
    const passId = 'P01';
    const url = `${baseUrl}${endpoint}/${campaignId}/wallets/pushes/${passId}/logs?api=true`;
    fetchMock.get(url, [{ id: 'WU01' }]);

    const result = await client.campaigns.wallets.getPushLogs(campaignId, passId);
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('array');
  });

  /**
   *
   */
  it('pushTemplates() should POST /campaigns/:id/wallets/pushes with the templates body', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${endpoint}/${campaignId}/wallets/pushes?api=true`;
    fetchMock.post(url, JSON.stringify(42));

    const templates = ['T01', 'T02'];
    const result = await client.campaigns.wallets.pushTemplates(campaignId, templates);
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.equal(42);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify({ templates }));
  });

  /**
   *
   */
  it('dismissPushes() should DELETE /campaigns/:id/wallets/pushes', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${endpoint}/${campaignId}/wallets/pushes?api=true`;
    fetchMock.delete(url, JSON.stringify('ok'));

    await client.campaigns.wallets.dismissPushes(campaignId);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('DELETE');
  });
});
