import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { CampaignsEndpoint, Client } from '../src/index';

describe('CampaignsEndpoint', () => {
  const authUrl = `${Client.baseDev}/auth/apiGrant`;
  const key = 'api_key';
  const secret = 'api_secret';
  let client: Client;

  /**
   *
   */
  beforeEach(() => {
    const idToken = 'xxxxxxxx';
    const refreshToken = 'yyyyyyyy';
    fetchMock.post(authUrl, {
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
   * Run for all tests.
   *
   * @param url The url that should have been called.
   * @param result The result of the fetch call.
   * @param type The type of the result.
   */
  const expectCommon = (url: string, result: any, type: string) => {
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an(type);
  };

  /**
   *
   */
  it('getPasses() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/passes`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const passes = await client.campaigns.getPasses(campaignId);
    expectCommon(url, passes, 'array');
  });

  /**
   *
   */
  it('getPassesByJob() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const jobId = 'JJJJJJ';
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/passes/${jobId}`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const passes = await client.campaigns.getPassesByJob(campaignId, jobId);
    expectCommon(url, passes, 'array');
  });

  /**
   *
   */
  it('getClaims() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/claims`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const claims = await client.campaigns.getClaims(campaignId);
    expectCommon(url, claims, 'array');
  });

  /**
   *
   */
  it('getJobs() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/jobs`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const jobs = await client.campaigns.getJobs(campaignId);
    expectCommon(url, jobs, 'array');
  });

  /**
   *
   */
  it('getStats() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/stats`;
    fetchMock.get(url, { countMacType: 1 });

    const stats = await client.campaigns.getStats(campaignId);
    expectCommon(url, stats, 'object');
  });

  /**
   *
   */
  it('getEnrollments() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/enrollments`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const enrollments = await client.campaigns.getEnrollments(campaignId);
    expectCommon(url, enrollments, 'array');
  });
});
