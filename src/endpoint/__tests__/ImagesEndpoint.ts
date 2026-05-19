import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { DEFAULT_BASE_URL } from '../../constants';
import { Client, KeysProvider } from '../../index';

const baseUrl = DEFAULT_BASE_URL;
const endpoint = '/images';

describe('ImagesEndpoint', () => {
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
  it('getById() should GET /images/:id', async () => {
    const id = 'IMG01';
    const url = `${baseUrl}${endpoint}/${id}?api=true`;
    fetchMock.get(url, { id });

    const result = await client.images.getById(id);
    expectCommon(url, result, 'object');
  });

  /**
   *
   */
  it('getByIds() should GET /images/ids with comma-joined ids query', async () => {
    const ids = ['IMG01', 'IMG02', 'IMG03'];
    const url = `${baseUrl}${endpoint}/ids?ids=${encodeURIComponent(ids.join(','))}&api=true`;
    fetchMock.get(url, [{ id: 'IMG01' }]);

    const result = await client.images.getByIds(ids);
    expectCommon(url, result, 'array');
  });
});
