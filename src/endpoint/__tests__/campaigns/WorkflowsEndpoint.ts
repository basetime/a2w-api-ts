import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { DEFAULT_BASE_URL } from '../../../constants';
import { Client, KeysProvider } from '../../../index';

const baseUrl = DEFAULT_BASE_URL;
const endpoint = '/campaigns';

describe('CampaignWorkflowsEndpoint', () => {
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
  it('getAll() should GET /campaigns/:id/workflows', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${endpoint}/${campaignId}/workflows?api=true`;
    fetchMock.get(url, [{ id: 'CWF01' }]);

    const result = await client.campaigns.workflows.getAll(campaignId);
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('array');
  });

  /**
   *
   */
  it('attach() should POST /campaigns/:id/workflows with the supplied body', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${endpoint}/${campaignId}/workflows?api=true`;
    fetchMock.post(url, { id: 'CWF01' });

    const body = {
      workflowId: 'WF01',
      runsWhen: 'enrolled' as const,
      schedule: null,
    };
    const result = await client.campaigns.workflows.attach(campaignId, body);
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('update() should POST /campaigns/:id/workflows/:workflowId with the supplied body', async () => {
    const campaignId = 'C01';
    const workflowId = 'CWF01';
    const url = `${baseUrl}${endpoint}/${campaignId}/workflows/${workflowId}?api=true`;
    fetchMock.post(url, JSON.stringify('ok'));

    const body = { runsWhen: 'scheduled' as const, schedule: null };
    await client.campaigns.workflows.update(campaignId, workflowId, body);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('detach() should DELETE /campaigns/:id/workflows/:workflowId', async () => {
    const campaignId = 'C01';
    const workflowId = 'CWF01';
    const url = `${baseUrl}${endpoint}/${campaignId}/workflows/${workflowId}?api=true`;
    fetchMock.delete(url, []);

    await client.campaigns.workflows.detach(campaignId, workflowId);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('DELETE');
  });
});
