import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { getBaseUrl } from '../../../constants';
import { Client, ExporterInput, KeysProvider } from '../../../index';

const baseUrl = getBaseUrl();
const endpoint = '/organization';

describe('OrganizationExportersEndpoint', () => {
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
   * Sample input shared across the create/update tests.
   */
  const sampleInput = (): ExporterInput => ({
    name: 'Daily SFTP',
    what: 'enrollments',
    when: 'daily',
    time: '03:00',
    source: 'sftp',
    config: { hostname: 'sftp.example.com' },
  });

  /**
   *
   */
  it('getAll() should GET /organization/exporters', async () => {
    const url = `${baseUrl}${endpoint}/exporters?api=true`;
    fetchMock.get(url, [{ id: 'EX01' }]);

    const result = await client.organizations.exporters.getAll();
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('array');
  });

  /**
   *
   */
  it('getById() should GET /organization/exporters/:id', async () => {
    const id = 'EX01';
    const url = `${baseUrl}${endpoint}/exporters/${id}?api=true`;
    fetchMock.get(url, { id });

    const result = await client.organizations.exporters.getById(id);
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('object');
  });

  /**
   *
   */
  it('create() should PUT /organization/exporters with the supplied body', async () => {
    const url = `${baseUrl}${endpoint}/exporters?api=true`;
    fetchMock.put(url, [{ id: 'EX01' }]);

    const body = sampleInput();
    await client.organizations.exporters.create(body);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('PUT');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('update() should POST /organization/exporters/:id with the supplied body', async () => {
    const id = 'EX01';
    const url = `${baseUrl}${endpoint}/exporters/${id}?api=true`;
    fetchMock.post(url, { id });

    const body = sampleInput();
    await client.organizations.exporters.update(id, body);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('delete() should DELETE /organization/exporters/:id', async () => {
    const id = 'EX01';
    const url = `${baseUrl}${endpoint}/exporters/${id}?api=true`;
    fetchMock.delete(url, JSON.stringify('ok'));

    await client.organizations.exporters.delete(id);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('DELETE');
  });

  /**
   *
   */
  it('run() should POST /organization/exporters/:id/run with an empty body', async () => {
    const id = 'EX01';
    const url = `${baseUrl}${endpoint}/exporters/${id}/run?api=true`;
    fetchMock.post(url, JSON.stringify('ok'));

    await client.organizations.exporters.run(id);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify({}));
  });

  /**
   *
   */
  it('getLogs() should GET /organization/exporters/:id/logs', async () => {
    const id = 'EX01';
    const url = `${baseUrl}${endpoint}/exporters/${id}/logs?api=true`;
    fetchMock.get(url, [{ id: 'LOG01' }]);

    const result = await client.organizations.exporters.getLogs(id);
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('array');
  });

  /**
   *
   */
  it('getLog() should GET /organization/exporters/:id/logs/:logId', async () => {
    const id = 'EX01';
    const logId = 'LOG01';
    const url = `${baseUrl}${endpoint}/exporters/${id}/logs/${logId}?api=true`;
    fetchMock.get(url, { id: logId });

    const result = await client.organizations.exporters.getLog(id, logId);
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('object');
  });
});
