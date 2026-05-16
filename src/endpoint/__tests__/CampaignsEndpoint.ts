import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { getBaseUrl } from '../../constants';
import { Client, KeysProvider } from '../../index';

const baseUrl = getBaseUrl();
const endpoint = '/campaigns';
const enrollmentEndpoint = '/e';

describe('CampaignsEndpoint', () => {
  const authUrl = `${baseUrl}/auth/apiGrant`;
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
  it('getAll() should GET /campaigns', async () => {
    const url = `${baseUrl}${endpoint}?api=true`;
    fetchMock.get(url, [{ id: 'C01' }]);

    const result = await client.campaigns.getAll();
    expectCommon(url, result, 'array');
  });

  /**
   *
   */
  it('getById() should GET /campaigns/:id', async () => {
    const id = 'C01';
    const url = `${baseUrl}${endpoint}/${id}?api=true`;
    fetchMock.get(url, { id });

    const result = await client.campaigns.getById(id);
    expectCommon(url, result, 'object');
  });

  /**
   *
   */
  it('getPasses() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes?api=true`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const passes = await client.campaigns.getPasses(campaignId);
    expectCommon(url, passes, 'array');
  });

  /**
   *
   */
  it('getPass() should GET /campaigns/:id/passes/details/:passId with the default scanner query', async () => {
    const campaignId = 'C01';
    const passId = 'P01';
    const scannerStr = encodeURIComponent(JSON.stringify(''));
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?scanner=${scannerStr}&api=true`;
    fetchMock.get(url, { id: passId });

    const result = await client.campaigns.getPass(campaignId, passId);
    expectCommon(url, result, 'object');
  });

  /**
   *
   */
  it('getPass() should JSON-encode a non-empty scanner object into the scanner query', async () => {
    const campaignId = 'C01';
    const passId = 'P01';
    const scanner = { id: 'S01', kind: 'apple' };
    const scannerStr = encodeURIComponent(JSON.stringify(scanner));
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?scanner=${scannerStr}&api=true`;
    fetchMock.get(url, { id: passId });

    const result = await client.campaigns.getPass(campaignId, passId, scanner);
    expectCommon(url, result, 'object');
  });

  /**
   *
   */
  it('queryPasses() with no queries should GET /campaigns/:id/passes/query', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/query?api=true`;
    fetchMock.get(url, [{ id: 'P01' }]);

    const result = await client.campaigns.queryPasses(campaignId);
    expectCommon(url, result, 'array');
  });

  /**
   *
   */
  it('queryPasses() should emit one query[] parameter per entry, URL-encoded', async () => {
    const campaignId = 'C01';
    const queries = { primaryKey: '123455', 'objectStore.amount': '30' };
    const k1 = encodeURIComponent('query[]');
    const v1 = encodeURIComponent('primaryKey:123455');
    const v2 = encodeURIComponent('objectStore.amount:30');
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/query?${k1}=${v1}&${k1}=${v2}&api=true`;
    fetchMock.get(url, [{ id: 'P01' }]);

    const result = await client.campaigns.queryPasses(campaignId, queries);
    expectCommon(url, result, 'array');
  });

  /**
   *
   */
  it('updatePass() should POST /campaigns/:id/passes/details/:passId with the cleaned body', async () => {
    const campaignId = 'C01';
    const passId = 'P01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?api=true`;
    fetchMock.post(url, { id: passId });

    const body = {
      objectStore: { foo: 'bar' },
      templateId: 'T01',
      templateVersion: 1,
      passTypeIdentifier: 'pass.com.example',
    };
    const result = await client.campaigns.updatePass(campaignId, passId, body);
    expectCommon(url, result, 'object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('mergeObjectStore() should PUT /campaigns/:id/passes/details/:passId with only objectStore', async () => {
    const campaignId = 'C01';
    const passId = 'P01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?api=true`;
    fetchMock.put(url, { id: passId });

    const result = await client.campaigns.mergeObjectStore(campaignId, passId, { objectStore: { a: '1' } });
    expectCommon(url, result, 'object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('PUT');
    expect(init.body).to.equal(JSON.stringify({ objectStore: { a: '1' } }));
  });

  /**
   *
   */
  it('deleteObjectStoreKeys() should DELETE /campaigns/:id/passes/details/:passId with the keys body', async () => {
    const campaignId = 'C01';
    const passId = 'P01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?api=true`;
    fetchMock.delete(url, { id: passId });

    const keys = ['a', 'b'];
    const result = await client.campaigns.deleteObjectStoreKeys(campaignId, passId, keys);
    expectCommon(url, result, 'object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('DELETE');
    expect(init.body).to.equal(JSON.stringify({ objectStoreKeys: keys }));
  });

  /**
   *
   */
  it('updatePasses() should POST /campaigns/:id/passes/details/passes with a cleaned passes array', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/passes?api=true`;
    fetchMock.post(url, [{ id: 'P01' }]);

    const passes = [
      { id: 'P01', objectStore: { a: '1' }, templateId: 'T01', templateVersion: '1', passTypeIdentifier: 'pti', extraIgnored: 'x' },
    ];
    const result = await client.campaigns.updatePasses(campaignId, passes as any);
    expectCommon(url, result, 'array');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(
      JSON.stringify({
        passes: [
          {
            id: 'P01',
            objectStore: { a: '1' },
            templateId: 'T01',
            templateVersion: '1',
            passTypeIdentifier: 'pti',
          },
        ],
      }),
    );
  });

  /**
   *
   */
  it('appendLog() should POST /campaigns/:id/passes/:passId/logs with the log body', async () => {
    const campaignId = 'C01';
    const passId = 'P01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/${passId}/logs?api=true`;
    fetchMock.post(url, { id: passId });

    const result = await client.campaigns.appendLog(campaignId, passId, 'hello');
    expectCommon(url, result, 'object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify({ log: 'hello' }));
  });

  /**
   *
   */
  it('createBundle() should POST /campaigns/:id/passes/bundle with the supplied values', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/bundle?api=true`;
    fetchMock.post(url, JSON.stringify('https://example/claim'));

    const metaValues = { logo: 'logo.png' };
    const objectStore = { amount: 30 };
    const utm = { utm_source: 'test' };

    const result = await client.campaigns.createBundle(campaignId, metaValues, objectStore, utm);
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.equal('https://example/claim');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify({ metaValues, objectStore, utm }));
  });

  /**
   *
   */
  it('createBundle() should default metaValues/objectStore/utm to empty objects', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/bundle?api=true`;
    fetchMock.post(url, JSON.stringify('https://example/claim'));

    await client.campaigns.createBundle(campaignId);
    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.body).to.equal(JSON.stringify({ metaValues: {}, objectStore: {}, utm: {} }));
  });

  /**
   *
   */
  it('createEnrollment() should throw when jwtEncode is not configured', async () => {
    let caught: Error | undefined;
    try {
      await client.campaigns.createEnrollment('C01');
    } catch (err) {
      caught = err as Error;
    }
    expect(caught).to.be.an.instanceof(Error);
    expect(caught?.message).to.include('jwtEncode');
  });

  /**
   *
   */
  it('createEnrollment() should POST /e/campaign/:id with a jwt-encoded body', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${enrollmentEndpoint}/campaign/${campaignId}?api=true`;
    fetchMock.post(url, { pass: 'BUNDLE01', errors: [] });

    client.campaigns.jwtEncode = async () => 'encoded-jwt';

    const result = await client.campaigns.createEnrollment(campaignId, { logo: 'logo.png' }, { form: 'f' });
    expectCommon(url, result, 'object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify({ d: 'encoded-jwt' }));
  });

  /**
   *
   */
  it('getPassesByJob() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const jobId = 'JJJJJJ';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/${jobId}?api=true`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const passes = await client.campaigns.getPassesByJob(campaignId, jobId);
    expectCommon(url, passes, 'array');
  });

  /**
   *
   */
  it('getClaims() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const url = `${baseUrl}${endpoint}/${campaignId}/claims?api=true`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const claims = await client.campaigns.getClaims(campaignId);
    expectCommon(url, claims, 'array');
  });

  /**
   *
   */
  it('getJobs() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const url = `${baseUrl}${endpoint}/${campaignId}/jobs?api=true`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const jobs = await client.campaigns.getJobs(campaignId);
    expectCommon(url, jobs, 'array');
  });

  /**
   *
   */
  it('getStats() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const url = `${baseUrl}${endpoint}/${campaignId}/stats?api=true`;
    fetchMock.get(url, { countMacType: 1 });

    const stats = await client.campaigns.getStats(campaignId);
    expectCommon(url, stats, 'object');
  });

  /**
   *
   */
  it('getEnrollments() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const url = `${baseUrl}${endpoint}/${campaignId}/enrollments?api=true`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const enrollments = await client.campaigns.getEnrollments(campaignId);
    expectCommon(url, enrollments, 'array');
  });

  /**
   *
   */
  it('redeemPass() should POST /campaigns/:id/passes/:passId/redeemed with an empty body', async () => {
    const campaignId = 'C01';
    const passId = 'P01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/${passId}/redeemed?api=true`;
    fetchMock.post(url, true);

    const result = await client.campaigns.redeemPass(campaignId, passId);
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.equal(true);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify({}));
  });

  /**
   *
   */
  it('getRedeemedStatus() should GET /campaigns/:id/passes/:passId/redeemed', async () => {
    const campaignId = 'C01';
    const passId = 'P01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/${passId}/redeemed?api=true`;
    fetchMock.get(url, true);

    const result = await client.campaigns.getRedeemedStatus(campaignId, passId);
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.equal(true);
  });
});
