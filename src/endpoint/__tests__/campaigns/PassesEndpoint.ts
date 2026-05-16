import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { getBaseUrl } from '../../../constants';
import { Client, KeysProvider } from '../../../index';

const baseUrl = getBaseUrl();
const endpoint = '/campaigns';

describe('CampaignPassesEndpoint', () => {
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
  it('getAll() should GET /campaigns/:id/passes', async () => {
    const campaignId = 'UUUUUU';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes?api=true`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const passes = await client.campaigns.passes.getAll(campaignId);
    expectCommon(url, passes, 'array');
  });

  /**
   *
   */
  it('getById() should GET /campaigns/:id/passes/details/:passId with the default scanner query', async () => {
    const campaignId = 'C01';
    const passId = 'P01';
    const scannerStr = encodeURIComponent(JSON.stringify(''));
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?scanner=${scannerStr}&api=true`;
    fetchMock.get(url, { id: passId });

    const result = await client.campaigns.passes.getById(campaignId, passId);
    expectCommon(url, result, 'object');
  });

  /**
   *
   */
  it('getById() should JSON-encode a non-empty scanner object into the scanner query', async () => {
    const campaignId = 'C01';
    const passId = 'P01';
    const scanner = { id: 'S01', kind: 'apple' };
    const scannerStr = encodeURIComponent(JSON.stringify(scanner));
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/${passId}?scanner=${scannerStr}&api=true`;
    fetchMock.get(url, { id: passId });

    const result = await client.campaigns.passes.getById(campaignId, passId, scanner);
    expectCommon(url, result, 'object');
  });

  /**
   *
   */
  it('query() with no queries should GET /campaigns/:id/passes/query', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/query?api=true`;
    fetchMock.get(url, [{ id: 'P01' }]);

    const result = await client.campaigns.passes.query(campaignId);
    expectCommon(url, result, 'array');
  });

  /**
   *
   */
  it('query() should emit one query[] parameter per entry, URL-encoded', async () => {
    const campaignId = 'C01';
    const queries = { primaryKey: '123455', 'objectStore.amount': '30' };
    const k1 = encodeURIComponent('query[]');
    const v1 = encodeURIComponent('primaryKey:123455');
    const v2 = encodeURIComponent('objectStore.amount:30');
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/query?${k1}=${v1}&${k1}=${v2}&api=true`;
    fetchMock.get(url, [{ id: 'P01' }]);

    const result = await client.campaigns.passes.query(campaignId, queries);
    expectCommon(url, result, 'array');
  });

  /**
   *
   */
  it('update() should POST /campaigns/:id/passes/details/:passId with the cleaned body', async () => {
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
    const result = await client.campaigns.passes.update(campaignId, passId, body);
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

    const result = await client.campaigns.passes.mergeObjectStore(campaignId, passId, { objectStore: { a: '1' } });
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
    const result = await client.campaigns.passes.deleteObjectStoreKeys(campaignId, passId, keys);
    expectCommon(url, result, 'object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('DELETE');
    expect(init.body).to.equal(JSON.stringify({ objectStoreKeys: keys }));
  });

  /**
   *
   */
  it('updateMany() should POST /campaigns/:id/passes/details/passes with a cleaned passes array', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/details/passes?api=true`;
    fetchMock.post(url, [{ id: 'P01' }]);

    const passes = [
      { id: 'P01', objectStore: { a: '1' }, templateId: 'T01', templateVersion: '1', passTypeIdentifier: 'pti', extraIgnored: 'x' },
    ];
    const result = await client.campaigns.passes.updateMany(campaignId, passes as any);
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

    const result = await client.campaigns.passes.appendLog(campaignId, passId, 'hello');
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

    const result = await client.campaigns.passes.createBundle(campaignId, metaValues, objectStore, utm);
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

    await client.campaigns.passes.createBundle(campaignId);
    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.body).to.equal(JSON.stringify({ metaValues: {}, objectStore: {}, utm: {} }));
  });

  /**
   *
   */
  it('getByJob() should GET /campaigns/:id/passes/:jobId', async () => {
    const campaignId = 'UUUUUU';
    const jobId = 'JJJJJJ';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/${jobId}?api=true`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const passes = await client.campaigns.passes.getByJob(campaignId, jobId);
    expectCommon(url, passes, 'array');
  });

  /**
   *
   */
  it('redeem() should POST /campaigns/:id/passes/:passId/redeemed with an empty body', async () => {
    const campaignId = 'C01';
    const passId = 'P01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/${passId}/redeemed?api=true`;
    fetchMock.post(url, true);

    const result = await client.campaigns.passes.redeem(campaignId, passId);
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

    const result = await client.campaigns.passes.getRedeemedStatus(campaignId, passId);
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.equal(true);
  });

  /**
   *
   */
  it('getScannerLogs() should GET /campaigns/:id/passes/:passId/scannerLogs', async () => {
    const campaignId = 'C01';
    const passId = 'P01';
    const url = `${baseUrl}${endpoint}/${campaignId}/passes/${passId}/scannerLogs?api=true`;
    fetchMock.get(url, [{ id: 'LOG01' }]);

    const result = await client.campaigns.passes.getScannerLogs(campaignId, passId);
    expectCommon(url, result, 'array');
  });
});
