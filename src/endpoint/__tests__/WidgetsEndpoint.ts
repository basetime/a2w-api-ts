import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { getBaseUrl } from '../../constants';
import { Client } from '../../index';

const apiBaseUrl = getBaseUrl();
const siteBaseUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, '');

describe('WidgetsEndpoint', () => {
  let client: Client;

  /**
   *
   */
  beforeEach(() => {
    client = new Client();
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
  it('signJwt() should POST /widgets/jwt with the payload + secret body', async () => {
    const url = `${siteBaseUrl}/widgets/jwt?api=true`;
    fetchMock.post(url, JSON.stringify('JWT-TOKEN'));

    const payload = { sub: 'user' };
    const secret = 'shhh';
    const result = await client.widgets.signJwt(payload, secret);
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.equal('JWT-TOKEN');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify({ payload, secret }));
  });

  /**
   *
   */
  it('signCampaignJwt() should POST /widgets/jwt/:campaignId with the payload body', async () => {
    const campaignId = 'C01';
    const url = `${siteBaseUrl}/widgets/jwt/${campaignId}?api=true`;
    fetchMock.post(url, JSON.stringify('JWT-TOKEN'));

    const payload = { metaValues: {}, formValues: { primaryKey: '1' } };
    const result = await client.widgets.signCampaignJwt(campaignId, payload);
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.equal('JWT-TOKEN');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    expect(init.method).to.equal('POST');
    expect(init.body).to.equal(JSON.stringify({ payload }));
  });

  /**
   *
   */
  it('signCampaignJwt() should URL-encode the campaign ID segment', async () => {
    const campaignId = 'C 01/x';
    const encoded = encodeURIComponent(campaignId);
    const url = `${siteBaseUrl}/widgets/jwt/${encoded}?api=true`;
    fetchMock.post(url, JSON.stringify('JWT-TOKEN'));

    await client.widgets.signCampaignJwt(campaignId, {});
    expect(fetchMock.called(url)).to.be.true;
  });

  /**
   *
   */
  it('signJwt() should not require an auth provider', async () => {
    const url = `${siteBaseUrl}/widgets/jwt?api=true`;
    fetchMock.post(url, JSON.stringify('JWT-TOKEN'));

    await client.widgets.signJwt({}, 'x');
    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    const headers = new Headers(init.headers);
    expect(headers.has('Authorization')).to.be.false;
  });
});
