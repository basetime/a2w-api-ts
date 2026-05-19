import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { DEFAULT_BASE_URL } from '../../../constants';
import { Client, KeysProvider } from '../../../index';

const baseUrl = DEFAULT_BASE_URL;
const endpoint = '/campaigns';
const enrollmentEndpoint = '/e';

describe('CampaignEnrollmentsEndpoint', () => {
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
  it('getAll() should GET /campaigns/:id/enrollments', async () => {
    const campaignId = 'UUUUUU';
    const url = `${baseUrl}${endpoint}/${campaignId}/enrollments?api=true`;
    fetchMock.get(url, [{ id: 'PPPPPP' }]);

    const enrollments = await client.campaigns.enrollments.getAll(campaignId);
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(enrollments).to.be.an('array');
  });

  /**
   *
   */
  it('create() should throw when jwtEncode is not configured', async () => {
    let caught: Error | undefined;
    try {
      await client.campaigns.enrollments.create('C01');
    } catch (err) {
      caught = err as Error;
    }
    expect(caught).to.be.an.instanceof(Error);
    expect(caught?.message).to.include('jwtEncode');
  });

  /**
   *
   */
  it('create() should POST /e/campaign/:id with a jwt-encoded body', async () => {
    const campaignId = 'C01';
    const url = `${baseUrl}${enrollmentEndpoint}/campaign/${campaignId}?api=true`;
    fetchMock.post(url, { pass: 'BUNDLE01', errors: [] });

    client.campaigns.enrollments.jwtEncode = async () => 'encoded-jwt';

    const result = await client.campaigns.enrollments.create(campaignId, { logo: 'logo.png' }, { form: 'f' });
    expect(fetchMock.called(authUrl)).to.be.true;
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.be.an('object');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify({ d: 'encoded-jwt' }));
  });
});
