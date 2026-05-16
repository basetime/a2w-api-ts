import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { getBaseUrl } from '../../../constants';
import { Client, KeysProvider, WebhookInput } from '../../../index';

const baseUrl = getBaseUrl();
const endpoint = '/organization';

describe('OrganizationWebhooksEndpoint', () => {
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
  it('getAll() should GET /organization/webhooks', async () => {
    const url = `${baseUrl}${endpoint}/webhooks?api=true`;
    fetchMock.get(url, [{ id: 'WH01' }]);

    const result = await client.organizations.webhooks.getAll();
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('array');
  });

  /**
   *
   */
  it('create() should POST /organization/webhooks with the webhook body', async () => {
    const url = `${baseUrl}${endpoint}/webhooks?api=true`;
    fetchMock.post(url, { id: 'WH01' });

    const body: WebhookInput = {
      displayName: 'My Webhook',
      url: 'https://example.com/hook',
      event: 'redeemed',
      password: 'secret',
    };
    const result = await client.organizations.webhooks.create(body);
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('update() should POST /organization/webhooks/:id with the webhook body', async () => {
    const id = 'WH01';
    const url = `${baseUrl}${endpoint}/webhooks/${id}?api=true`;
    fetchMock.post(url, { id });

    const body: WebhookInput = {
      displayName: 'Renamed',
      url: 'https://example.com/hook',
      event: 'redeemed',
    };
    await client.organizations.webhooks.update(id, body);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('delete() should DELETE /organization/webhooks/:id', async () => {
    const id = 'WH01';
    const url = `${baseUrl}${endpoint}/webhooks/${id}?api=true`;
    fetchMock.delete(url, JSON.stringify('ok'));

    await client.organizations.webhooks.delete(id);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('DELETE');
  });

  /**
   *
   */
  it('getLogs() should GET /organization/webhookLogs', async () => {
    const url = `${baseUrl}${endpoint}/webhookLogs?api=true`;
    fetchMock.get(url, [{ id: 'LOG01' }]);

    const result = await client.organizations.webhooks.getLogs();
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('array');
  });
});
