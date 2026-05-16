import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { getBaseUrl } from '../../constants';
import { Client, KeysProvider, ScannerDeviceInfo } from '../../index';

const baseUrl = getBaseUrl();
const endpoint = '/organization';

describe('OrganizationsEndpoint', () => {
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
   * Run for unauthenticated tests.
   *
   * @param url The url that should have been called.
   */
  const expectUnauth = (url: string) => {
    expect(fetchMock.called(authUrl)).to.be.false;
    expect(fetchMock.called(url)).to.be.true;
  };

  /**
   *
   */
  it('getMine() should GET /organization', async () => {
    const url = `${baseUrl}${endpoint}?api=true`;
    fetchMock.get(url, { id: 'ORG01' });

    const result = await client.organizations.getMine();
    expectCommon(url, result, 'object');
  });

  /**
   *
   */
  it('getScannerInvite() should GET /organization/scanners/invites/:code unauthenticated', async () => {
    const code = 'INV01';
    const url = `${baseUrl}${endpoint}/scanners/invites/${code}?api=true`;
    fetchMock.get(url, { code });

    const result = await client.organizations.getScannerInvite(code);
    expectUnauth(url);
    expect(result).to.be.an('object');
  });

  /**
   *
   */
  it('startScannerExchange() should GET /organization/scanners/invites/:code/start unauthenticated', async () => {
    const code = 'INV01';
    const url = `${baseUrl}${endpoint}/scanners/invites/${code}/start?api=true`;
    fetchMock.get(url, { code });

    const result = await client.organizations.startScannerExchange(code);
    expectUnauth(url);
    expect(result).to.be.an('object');
  });

  /**
   *
   */
  it('finishScannerExchange() should POST /organization/scanners/invites unauthenticated with the supplied body', async () => {
    const url = `${baseUrl}${endpoint}/scanners/invites?api=true`;
    fetchMock.post(url, { id: 'KEY01' });

    const code = 'INV01';
    const pushToken = 'PUSH';
    const scannerDeviceInfo: ScannerDeviceInfo = {
      manufacturer: 'Apple',
      model: 'iPhone',
      osVersion: '17.0',
      device: 'Mobile',
      deviceName: 'My iPhone',
    };

    const result = await client.organizations.finishScannerExchange(code, pushToken, scannerDeviceInfo);
    expectUnauth(url);
    expect(result).to.be.an('object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify({ code, pushToken, scannerDeviceInfo }));
  });

  /**
   *
   */
  it('getApiKeys() should GET /organization/apiKeys', async () => {
    const url = `${baseUrl}${endpoint}/apiKeys?api=true`;
    fetchMock.get(url, [{ id: 'KEY01' }]);

    const result = await client.organizations.getApiKeys();
    expectCommon(url, result, 'array');
  });

  /**
   *
   */
  it('getApiKey() should GET /organization/apiKeys/:id with scanner query', async () => {
    const id = 'KEY01';
    const scannerStr = encodeURIComponent(JSON.stringify(''));
    const url = `${baseUrl}${endpoint}/apiKeys/${id}?scanner=${scannerStr}&api=true`;
    fetchMock.get(url, { id });

    const result = await client.organizations.getApiKey(id);
    expectCommon(url, result, 'object');
  });

  /**
   *
   */
  it('deleteApiKey() should DELETE /organization/apiKeys/:id', async () => {
    const id = 'KEY01';
    const url = `${baseUrl}${endpoint}/apiKeys/${id}?api=true`;
    fetchMock.delete(url, {});

    await client.organizations.deleteApiKey(id);
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('DELETE');
  });
});
