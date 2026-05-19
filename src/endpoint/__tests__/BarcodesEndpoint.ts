import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { DEFAULT_BASE_URL } from '../../constants';
import { Client } from '../../index';

const apiBaseUrl = DEFAULT_BASE_URL;
const siteBaseUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, '');

describe('BarcodesEndpoint', () => {
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
  it('render() should GET /barcodes at the site root (outside /api/v1)', async () => {
    const url = `${siteBaseUrl}/barcodes?type=qrcode&data=hello&api=true`;
    fetchMock.get(url, 'PNG-BODY');

    const result = await client.barcodes.render({ type: 'qrcode', data: 'hello' });
    expect(fetchMock.called(url)).to.be.true;
    expect(result).to.equal('PNG-BODY');

    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    const headers = new Headers(init.headers);
    expect(headers.get('Accept')).to.equal('image/png');
  });

  /**
   *
   */
  it('render() should pass width/height/color/background as query params when set', async () => {
    const url =
      `${siteBaseUrl}/barcodes?type=code128&data=ABC123&width=200&height=120` +
      `&color=%23000000&background=%23FFFFFF&api=true`;
    fetchMock.get(url, 'PNG-BODY');

    await client.barcodes.render({
      type: 'code128',
      data: 'ABC123',
      width: 200,
      height: 120,
      color: '#000000',
      background: '#FFFFFF',
    });
    expect(fetchMock.called(url)).to.be.true;
  });

  /**
   *
   */
  it('render() should not require an auth provider', async () => {
    const url = `${siteBaseUrl}/barcodes?type=qrcode&data=hello&api=true`;
    fetchMock.get(url, 'PNG-BODY');

    await client.barcodes.render({ type: 'qrcode', data: 'hello' });
    const init = fetchMock.lastCall(url)?.[1] as RequestInit;
    const headers = new Headers(init.headers);
    expect(headers.has('Authorization')).to.be.false;
  });
});
