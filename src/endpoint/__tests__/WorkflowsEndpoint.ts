import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { getBaseUrl } from '../../constants';
import { Client, KeysProvider, Workflow, WorkflowJob, WorkflowMessage } from '../../index';

const baseUrl = getBaseUrl();
const endpoint = '/workflows';

describe('WorkflowsEndpoint', () => {
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
   * Run for authenticated tests.
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
  it('getAll() should GET /workflows', async () => {
    const url = `${baseUrl}${endpoint}?api=true`;
    fetchMock.get(url, [{ id: 'WF01' }]);

    const result = await client.workflows.getAll();
    expectCommon(url, result, 'array');
  });

  /**
   *
   */
  it('getById() should GET /workflows/:id', async () => {
    const id = 'WF01';
    const url = `${baseUrl}${endpoint}/${id}?api=true`;
    fetchMock.get(url, { id });

    const result = await client.workflows.getById(id);
    expectCommon(url, result, 'object');
  });

  /**
   *
   */
  it('create() should POST /workflows with the workflow body', async () => {
    const url = `${baseUrl}${endpoint}?api=true`;
    fetchMock.post(url, { id: 'WF01' });

    const input: Omit<Workflow, 'id' | 'createdDate'> = {
      organizationId: 'ORG01',
      scannerAppId: null,
      name: 'W',
      description: '',
      code: '',
      packages: [],
    };

    const result = await client.workflows.create(input);
    expectCommon(url, result, 'object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(input));
  });

  /**
   *
   */
  it('update() should POST /workflows/:id with the partial workflow body', async () => {
    const id = 'WF01';
    const url = `${baseUrl}${endpoint}/${id}?api=true`;
    fetchMock.post(url, { id });

    const body: Partial<Workflow> = { name: 'renamed' };
    const result = await client.workflows.update(id, body);
    expectCommon(url, result, 'object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('delete() should DELETE /workflows/:id', async () => {
    const id = 'WF01';
    const url = `${baseUrl}${endpoint}/${id}?api=true`;
    fetchMock.delete(url, {});

    await client.workflows.delete(id);
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('DELETE');
  });

  /**
   *
   */
  it('getJobs() should GET /workflows/:id/jobs', async () => {
    const id = 'WF01';
    const url = `${baseUrl}${endpoint}/${id}/jobs?api=true`;
    fetchMock.get(url, [{ id: 'JOB01' }]);

    const result = await client.workflows.getJobs(id);
    expectCommon(url, result, 'array');
  });

  /**
   *
   */
  it('getJob() should GET /workflows/jobs/:jobId', async () => {
    const id = 'JOB01';
    const url = `${baseUrl}${endpoint}/jobs/${id}?api=true`;
    fetchMock.get(url, { id });

    const result = await client.workflows.getJob(id);
    expectCommon(url, result, 'object');
  });

  /**
   *
   */
  it('updateJob() should POST /workflows/jobs/:jobId with the partial job body', async () => {
    const id = 'JOB01';
    const url = `${baseUrl}${endpoint}/jobs/${id}?api=true`;
    fetchMock.post(url, { id });

    const body: Partial<WorkflowJob> = { status: 'success' };
    const result = await client.workflows.updateJob(id, body);
    expectCommon(url, result, 'object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('addJobLog() should POST /workflows/jobs/:jobId/logs with the message body', async () => {
    const id = 'JOB01';
    const url = `${baseUrl}${endpoint}/jobs/${id}/logs?api=true`;
    fetchMock.post(url, { id });

    const message: WorkflowMessage = { type: 'info', message: 'hi' };
    const result = await client.workflows.addJobLog(id, message);
    expectCommon(url, result, 'object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(message));
  });

  /**
   *
   */
  it('getSnippets() should GET /workflows/libraries', async () => {
    const url = `${baseUrl}${endpoint}/libraries?api=true`;
    fetchMock.get(url, [{ id: 'LIB01' }]);

    const result = await client.workflows.getSnippets();
    expectCommon(url, result, 'array');
  });

  /**
   *
   */
  it('run() should POST /workflows/run with the supplied body', async () => {
    const url = `${baseUrl}${endpoint}/run?api=true`;
    fetchMock.post(url, { id: 'JOB01', status: 'pending' });

    const body = { workflowId: 'WF01', code: 'console.log("hi")', campaign: 'C01', pass: 'P01' };
    const result = await client.workflows.run(body);
    expectCommon(url, result, 'object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('run() should accept the minimal body of just workflowId', async () => {
    const url = `${baseUrl}${endpoint}/run?api=true`;
    fetchMock.post(url, { id: 'JOB01', status: 'pending' });

    const body = { workflowId: 'WF01' };
    await client.workflows.run(body);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('getJobStatus() should GET /workflows/jobs/:jobId/status', async () => {
    const id = 'JOB01';
    const url = `${baseUrl}${endpoint}/jobs/${id}/status?api=true`;
    fetchMock.get(url, JSON.stringify('pending'));

    const result = await client.workflows.getJobStatus(id);
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.equal('pending');
  });
});
