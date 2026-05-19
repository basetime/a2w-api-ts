import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { DEFAULT_BASE_URL } from '../../constants';
import { Client, KeysProvider } from '../../index';

const baseUrl = DEFAULT_BASE_URL;
const endpoint = '/campaigns';

describe('CampaignsEndpoint', () => {
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
  it('update() should POST /campaigns/:id with the supplied body', async () => {
    const id = 'C01';
    const url = `${baseUrl}${endpoint}/${id}?api=true`;
    fetchMock.post(url, { id });

    const body = { name: 'Renamed', templates: ['T01'] };
    await client.campaigns.update(id, body);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('createSimple() should POST /campaigns/:id/simple with the supplied body', async () => {
    const id = '__new';
    const url = `${baseUrl}${endpoint}/${id}/simple?api=true`;
    fetchMock.post(url, { id: 'C99' });

    const body = {
      campaign: { name: 'New Simple' },
      templateId: 'T01',
      placeholders: { logo: 'data:image/png;base64,xxx' },
    };
    const result = await client.campaigns.createSimple(id, body);
    expectCommon(url, result, 'object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('clone() should POST /campaigns/:id/clone with an empty body', async () => {
    const id = 'C01';
    const url = `${baseUrl}${endpoint}/${id}/clone?api=true`;
    fetchMock.post(url, JSON.stringify('C99'));

    const result = await client.campaigns.clone(id);
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.equal('C99');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify({}));
  });

  /**
   *
   */
  it('delete() should DELETE /campaigns/:id', async () => {
    const id = 'C01';
    const url = `${baseUrl}${endpoint}/${id}?api=true`;
    fetchMock.delete(url, JSON.stringify('ok'));

    await client.campaigns.delete(id);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('DELETE');
  });
});
