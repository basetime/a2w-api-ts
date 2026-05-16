import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { getBaseUrl } from '../../constants';
import { Client, KeysProvider } from '../../index';

const baseUrl = getBaseUrl();
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
});
