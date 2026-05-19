import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { DEFAULT_BASE_URL } from '../../../constants';
import { Client, DataStoreInput, KeysProvider } from '../../../index';

const baseUrl = DEFAULT_BASE_URL;
const endpoint = '/organization';

describe('OrganizationDataStoresEndpoint', () => {
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
  it('getAll() should GET /organization/dataStores', async () => {
    const url = `${baseUrl}${endpoint}/dataStores?api=true`;
    fetchMock.get(url, [{ id: 'DS01' }]);

    const result = await client.organizations.dataStores.getAll();
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('array');
  });

  /**
   *
   */
  it('getById() should GET /organization/dataStores/:id', async () => {
    const id = 'DS01';
    const url = `${baseUrl}${endpoint}/dataStores/${id}?api=true`;
    fetchMock.get(url, { id });

    const result = await client.organizations.dataStores.getById(id);
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('object');
  });

  /**
   *
   */
  it('create() should PUT /organization/dataStores with the supplied body', async () => {
    const url = `${baseUrl}${endpoint}/dataStores?api=true`;
    fetchMock.put(url, { id: 'DS01' });

    const body: DataStoreInput = {
      name: 'Members',
      source: 'key-value',
      keyValue: [{ key: 'k', value: 'v' }],
    };
    await client.organizations.dataStores.create(body);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('PUT');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('update() should POST /organization/dataStores/:id with the supplied body', async () => {
    const id = 'DS01';
    const url = `${baseUrl}${endpoint}/dataStores/${id}?api=true`;
    fetchMock.post(url, { id });

    const body: DataStoreInput = { name: 'Members', source: 'key-value' };
    await client.organizations.dataStores.update(id, body);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify(body));
  });

  /**
   *
   */
  it('delete() should DELETE /organization/dataStores/:id', async () => {
    const id = 'DS01';
    const url = `${baseUrl}${endpoint}/dataStores/${id}?api=true`;
    fetchMock.delete(url, []);

    await client.organizations.dataStores.delete(id);

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('DELETE');
  });
});
