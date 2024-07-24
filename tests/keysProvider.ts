import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { baseUrl } from '../src/constants';
import { KeysProvider } from '../src/index';

describe('KeysProvider', () => {
  /**
   *
   */
  it('authenticate() should return an idToken', async () => {
    const idToken = 'xxxxxxxx';
    const refreshToken = 'yyyyyyyy';
    fetchMock.post(`${baseUrl}/auth/apiGrant`, {
      idToken,
      refreshToken,
      expiresAt: Date.now() + 1000,
    });

    const key = 'api_key';
    const secret = 'api_secret';
    const auth = new KeysProvider(key, secret, console);
    const token = await auth.authenticate();

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
