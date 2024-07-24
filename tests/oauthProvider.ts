import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { baseUrl } from '../src/constants';
import { OAuthProvider } from '../src/index';

describe('OAuthProvider', () => {
  /**
   *
   */
  it('getCodeUrl() should return a URL', async () => {
    const app = 'app';
    const oauth = new OAuthProvider(app, '@', console);
    const url = oauth.getCodeUrl('redirect', ['scope1', 'scope2'], 'state');
    expect(url).to.be.equal(
      `${baseUrl}/oauth/code?app=${app}&redirect_uri=redirect&scope=scope1 scope2&state=state`,
    );
  });

  /**
   *
   */
  it('authenticate() should return an idToken', async () => {
    const idToken = 'xxxxxxxx';
    const refreshToken = 'yyyyyyyy';
    fetchMock.post(`${baseUrl}/oauth/token`, {
      idToken,
      refreshToken,
      expiresAt: Date.now() + 1000,
    });

    const appId = 'app';
    const code = 'code';
    const oauth = new OAuthProvider(appId, code, console);
    const token = await oauth.authenticate();

    expect(fetchMock.called()).to.be.true;
    expect(token).to.be.equal(idToken);

    const lastCall = fetchMock.lastCall();
    expect(lastCall).to.not.be.undefined;
    const body = JSON.parse((lastCall?.[1] as any).body);
    expect(body.app).to.be.equal(appId);
    expect(body.code).to.be.equal(code);

    fetchMock.reset();
  });
});
