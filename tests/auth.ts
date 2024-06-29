import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { Auth, Client } from '../src/index';

describe('Auth', () => {
  /**
   *
   */
  it('getBearerToken() should return an idToken', async () => {
    const idToken = 'xxxxxxxx';
    const refreshToken = 'yyyyyyyy';
    fetchMock.post(`${Client.baseDev}/auth/apiGrant`, {
      idToken,
      refreshToken,
      expiresAt: Date.now() + 1000,
    });

    const key = 'api_key';
    const secret = 'api_secret';
    const auth = new Auth(key, secret, Client.baseDev, console);
    const token = await auth.getBearerToken();

    expect(fetchMock.called()).to.be.true;
    expect(token).to.be.equal(idToken);

    const lastCall = fetchMock.lastCall();
    expect(lastCall).to.not.be.undefined;
    const body = JSON.parse((lastCall?.[1] as any).body);
    expect(body.key).to.be.equal(key);
    expect(body.secret).to.be.equal(secret);

    fetchMock.reset();
  });
});
