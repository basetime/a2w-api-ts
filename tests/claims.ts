import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { baseUrl } from '../src/constants';
import { ClaimsEndpoint, Client, KeysProvider } from '../src/index';

describe('ClaimsEndpoint', () => {
  const authUrl = `${baseUrl}/auth/apiGrant`;
  const key = 'api_key';
  const secret = 'api_secret';
  let client: Client;

  /**
   *
   */
  beforeEach(() => {
    const idToken = 'xxxxxxxx';
    const refreshToken = 'yyyyyyyy';
    fetchMock.post(authUrl, {
      idToken,
      refreshToken,
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
  it('getPkpass() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const passId = 'PPPPPP';
    const url = `${baseUrl}${ClaimsEndpoint.endpoint}/${campaignId}/${passId}.pkpass`;
    fetchMock.get(url, 'PKPASS');

    const passes = await client.claims.getPkpass(campaignId, passId);
    expectCommon(url, passes, 'string');
  });

  /**
   *
   */
  it('debugJson() should succeed', async () => {
    const campaignId = 'UUUUUU';
    const passId = 'PPPPPP';
    const url = `${baseUrl}${ClaimsEndpoint.endpoint}/${campaignId}/${passId}/debugDownloadJson`;
    fetchMock.get(url, { id: 'PPPPPP' });

    const passes = await client.claims.debugJson(campaignId, passId);
    expectCommon(url, passes, 'object');
  });
});
