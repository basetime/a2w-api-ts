import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { DEFAULT_BASE_URL } from '../../constants';
import { Client, KeysProvider, ScannerDeviceInfo } from '../../index';

const baseUrl = DEFAULT_BASE_URL;
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
  it('getPassTypes() should GET /organization/passTypes', async () => {
    const url = `${baseUrl}${endpoint}/passTypes?api=true`;
    fetchMock.get(url, [{ id: 'pass.io.example.demo' }]);

    const result = await client.organizations.getPassTypes();
    expectCommon(url, result, 'array');
  });

  /**
   *
   */
  it('exportPassType() should GET /organization/passTypes/:id/export', async () => {
    const id = 'pass.io.example.demo';
    const url = `${baseUrl}${endpoint}/passTypes/${id}/export?api=true`;
    fetchMock.get(url, {
      id,
      signerCert: 'CERT',
      signerKey: 'KEY',
      signerKeyPassphrase: '',
      teamIdentifier: 'TEAM01',
    });

    const result = await client.organizations.exportPassType(id);
    expectCommon(url, result, 'object');
  });

  /**
   *
   */
  it('getGoogleIssuers() should GET /organization/googleIssuers', async () => {
    const url = `${baseUrl}${endpoint}/googleIssuers?api=true`;
    fetchMock.get(url, [{ id: 'issuer01', name: 'Example Issuer' }]);

    const result = await client.organizations.getGoogleIssuers();
    expectCommon(url, result, 'array');
  });

  /**
   *
   */
  it('exportGoogleIssuer() should GET /organization/googleIssuers/:id/export', async () => {
    const id = 'issuer01';
    const url = `${baseUrl}${endpoint}/googleIssuers/${id}/export?api=true`;
    fetchMock.get(url, {
      id,
      name: 'Example Issuer',
      credentials: '{"type":"service_account"}',
    });

    const result = await client.organizations.exportGoogleIssuer(id);
    expectCommon(url, result, 'object');
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
