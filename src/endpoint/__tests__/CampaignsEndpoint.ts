import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { getBaseUrl } from '../../constants';
import { Client, KeysProvider } from '../../index';

const baseUrl = getBaseUrl();
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
});
