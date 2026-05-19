import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { DEFAULT_BASE_URL } from '../../constants';
import { Client, KeysProvider } from '../../index';

const baseUrl = DEFAULT_BASE_URL;
const endpoint = '/templates';

describe('TemplatesEndpoint', () => {
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
   * Run for all authenticated tests.
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
  it('getById() should GET /templates/simple/:id', async () => {
    const id = 'TPL01';
    const url = `${baseUrl}${endpoint}/simple/${id}?api=true`;
    fetchMock.get(url, { id });

    const result = await client.templates.getById(id);
    expectCommon(url, result, 'object');
  });

  /**
   *
   */
  it('getAll() should GET /templates/organization', async () => {
    const url = `${baseUrl}${endpoint}/organization?api=true`;
    fetchMock.get(url, [{ id: 'TPL01' }]);

    const result = await client.templates.getAll();
    expectCommon(url, result, 'array');
  });

  /**
   *
   */
  it('getByTag() should GET /templates/tagged/:tag', async () => {
    const tag = 'promo';
    const url = `${baseUrl}${endpoint}/tagged/${tag}?api=true`;
    fetchMock.get(url, [{ id: 'TPL01' }]);

    const result = await client.templates.getByTag(tag);
    expectCommon(url, result, 'array');
  });

  /**
   *
   */
  it('delete() should DELETE /templates/:id', async () => {
    const id = 'TPL01';
    const url = `${baseUrl}${endpoint}/${id}?api=true`;
    fetchMock.delete(url, JSON.stringify('ok'));

    await client.templates.delete(id);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('DELETE');
  });

  /**
   *
   */
  it('clone() should POST /templates/:id/clone with an empty body', async () => {
    const id = 'TPL01';
    const url = `${baseUrl}${endpoint}/${id}/clone?api=true`;
    fetchMock.post(url, { id: 'TPL02' });

    const result = await client.templates.clone(id);
    expectCommon(url, result, 'object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify({}));
  });

  /**
   *
   */
  it('export() should GET /templates/:id/export', async () => {
    const id = 'TPL01';
    const url = `${baseUrl}${endpoint}/${id}/export?api=true`;
    fetchMock.get(url, { name: 'T', apple: {}, google: {}, files: {} });

    const result = await client.templates.export(id);
    expectCommon(url, result, 'object');
  });

  /**
   *
   */
  it('import() should POST /templates/import with a FormData body and not force JSON', async () => {
    const url = `${baseUrl}${endpoint}/import?api=true`;
    fetchMock.post(url, { id: 'TPL02' });

    await client.templates.import({ content: '{"name":"T"}', name: 'tpl.json' });
    expect(fetchMock.called(url)).to.be.true;

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.be.instanceof(FormData);

    // The runtime attaches `multipart/form-data; boundary=...` itself; we just need to
    // make sure our requester did NOT force `application/json` here.
    const headers = new Headers(init.headers);
    expect(headers.get('Content-Type')).to.not.equal('application/json');
  });
});
