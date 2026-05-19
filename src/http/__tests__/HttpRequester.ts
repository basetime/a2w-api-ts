import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { DEFAULT_BASE_URL } from '../../constants';
import { Authed } from '../../types/Authed';
import { AuthProvider } from '../../provider/AuthProvider';
import { Logger } from '../../Logger';
import { ApiError } from '../ApiError';
import HttpRequester from '../HttpRequester';
import { version } from '../../version';

const baseUrl = DEFAULT_BASE_URL;

/**
 * Stub auth provider that records interaction and lets each test control its
 * cached `Authed` value and what `authenticate()` / `refresh()` resolve to.
 */
class StubAuthProvider implements AuthProvider {
  public authed: Authed | undefined;
  public token = 'fresh-token';
  public refreshedToken = 'refreshed-token';
  public authenticateCalls = 0;
  public refreshCalls = 0;
  public loggerSet = false;
  public baseUrlSetTo: string | undefined;

  setLogger = (_logger: Logger) => {
    this.loggerSet = true;
  };

  setBaseUrl = (url: string) => {
    this.baseUrlSetTo = url;
  };

  getAuthed = (): Authed | undefined => {
    return this.authed;
  };

  authenticate = async (): Promise<string> => {
    this.authenticateCalls += 1;
    return this.token;
  };

  refresh = async (): Promise<string> => {
    this.refreshCalls += 1;
    this.authed = {
      idToken: this.refreshedToken,
      refreshToken: this.authed?.refreshToken ?? 'r',
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };
    return this.refreshedToken;
  };
}

describe('HttpRequester', () => {
  /**
   *
   */
  afterEach(() => {
    fetchMock.reset();
  });

  /**
   * Returns the headers from the most recent fetch call.
   */
  const lastHeaders = (): Headers => {
    const last = fetchMock.lastCall();
    expect(last).to.not.be.undefined;
    const init = (last?.[1] ?? {}) as RequestInit;
    return new Headers(init.headers as HeadersInit);
  };

  describe('constructor', () => {
    /**
     *
     */
    it('should default to DEFAULT_BASE_URL', () => {
      const http = new HttpRequester();
      expect(http.getBaseUrl()).to.equal(DEFAULT_BASE_URL);
    });

    /**
     *
     */
    it('should accept a baseUrl option', () => {
      const custom = 'https://example.test/api/v1';
      const http = new HttpRequester(undefined, undefined, { baseUrl: custom });
      expect(http.getBaseUrl()).to.equal(custom);
    });

    /**
     *
     */
    it('should derive the site base URL by stripping /api/v1', () => {
      const http = new HttpRequester(undefined, undefined, {
        baseUrl: 'https://example.test/api/v1',
      });
      expect(http.getSiteBaseUrl()).to.equal('https://example.test');
    });
  });

  describe('setBaseUrl()', () => {
    /**
     *
     */
    it('should change the base url used by fetch()', async () => {
      const custom = 'https://example.test/api/v1';
      const url = `${custom}/ping?api=true`;
      fetchMock.get(url, { ok: true });

      const http = new HttpRequester();
      http.setBaseUrl(custom);

      await http.fetch('/ping', {}, false);
      expect(fetchMock.called(url)).to.be.true;
    });

    /**
     *
     */
    it('should recompute the site base URL', () => {
      const http = new HttpRequester();
      http.setBaseUrl('https://example.test/api/v1');
      expect(http.getSiteBaseUrl()).to.equal('https://example.test');
    });

    /**
     *
     */
    it('should push the new base url into the auth provider', () => {
      const auth = new StubAuthProvider();
      const http = new HttpRequester(auth);
      http.setBaseUrl('https://example.test/api/v1');
      expect(auth.baseUrlSetTo).to.equal('https://example.test/api/v1');
    });
  });

  describe('setAuth()', () => {
    /**
     *
     */
    it('should store the provider and wire up the logger', () => {
      const auth = new StubAuthProvider();
      const http = new HttpRequester();
      http.setAuth(auth);

      expect(http.auth).to.equal(auth);
      expect(auth.loggerSet).to.be.true;
    });

    /**
     *
     */
    it('should push the current base url into the auth provider', () => {
      const auth = new StubAuthProvider();
      const http = new HttpRequester(undefined, undefined, {
        baseUrl: 'https://example.test/api/v1',
      });
      http.setAuth(auth);
      expect(auth.baseUrlSetTo).to.equal('https://example.test/api/v1');
    });

    /**
     *
     */
    it('should be invoked from the constructor when an auth provider is supplied', () => {
      const auth = new StubAuthProvider();
      const http = new HttpRequester(auth);

      expect(http.auth).to.equal(auth);
      expect(auth.loggerSet).to.be.true;
    });
  });

  describe('fetch() URL handling', () => {
    /**
     *
     */
    it('should append api=true to a url without a query string', async () => {
      const url = `${baseUrl}/things`;
      fetchMock.get(`${url}?api=true`, { ok: true });

      const http = new HttpRequester();
      await http.fetch('/things', {}, false);

      const last = fetchMock.lastCall();
      expect(last?.[0]).to.equal(`${url}?api=true`);
    });

    /**
     *
     */
    it('should append api=true with & to a url that already has a query string', async () => {
      const url = `${baseUrl}/things`;
      fetchMock.get(`${url}?foo=bar&api=true`, { ok: true });

      const http = new HttpRequester();
      await http.fetch('/things?foo=bar', {}, false);

      const last = fetchMock.lastCall();
      expect(last?.[0]).to.equal(`${url}?foo=bar&api=true`);
    });

    /**
     *
     */
    it('should not duplicate api=true when the caller has already added it', async () => {
      const url = `${baseUrl}/things?foo=bar&api=true`;
      fetchMock.get(url, { ok: true });

      const http = new HttpRequester();
      await http.fetch('/things?foo=bar&api=true', {}, false);

      expect(fetchMock.called(url)).to.be.true;
      const last = fetchMock.lastCall();
      // Should appear exactly once.
      const calls = (last?.[0] as string).match(/api=true/g);
      expect(calls).to.have.length(1);
    });

    /**
     *
     */
    it('should leave absolute URLs (other than api=true injection) unchanged', async () => {
      const absolute = 'https://other.test/elsewhere';
      fetchMock.get(`${absolute}?api=true`, { ok: true });

      const http = new HttpRequester();
      await http.fetch(absolute, {}, false);

      const last = fetchMock.lastCall();
      expect(last?.[0]).to.equal(`${absolute}?api=true`);
    });

    /**
     *
     */
    it('should not duplicate api=true on an absolute URL that already has it', async () => {
      const absolute = 'https://other.test/elsewhere?api=true';
      fetchMock.get(absolute, { ok: true });

      const http = new HttpRequester();
      await http.fetch(absolute, {}, false);

      const last = fetchMock.lastCall();
      const occurrences = (last?.[0] as string).match(/api=true/g);
      expect(occurrences).to.have.length(1);
    });
  });

  describe('fetch() headers', () => {
    /**
     *
     */
    it('should set a default User-Agent header that includes the package version', async () => {
      const url = `${baseUrl}/ua`;
      fetchMock.get(`${url}?api=true`, { ok: true });

      const http = new HttpRequester();
      await http.fetch('/ua', {}, false);

      const ua = lastHeaders().get('User-Agent');
      expect(ua).to.equal(`a2w-api-ts/${version} (Node.js ${process.version})`);
    });

    /**
     *
     */
    it('should honour a custom User-Agent set via setUserAgent()', async () => {
      const url = `${baseUrl}/ua-custom`;
      fetchMock.get(`${url}?api=true`, { ok: true });

      const http = new HttpRequester();
      http.setUserAgent('my-app/1.2.3');
      await http.fetch('/ua-custom', {}, false);

      expect(lastHeaders().get('User-Agent')).to.equal('my-app/1.2.3');
    });

    /**
     *
     */
    it('should default Accept and Content-Type to application/json', async () => {
      const url = `${baseUrl}/json`;
      fetchMock.get(`${url}?api=true`, { ok: true });

      const http = new HttpRequester();
      await http.fetch('/json', {}, false);

      const headers = lastHeaders();
      expect(headers.get('Accept')).to.equal('application/json');
      expect(headers.get('Content-Type')).to.equal('application/json');
    });

    /**
     *
     */
    it('should not overwrite Accept and Content-Type headers when the caller supplies them', async () => {
      const url = `${baseUrl}/multipart`;
      fetchMock.post(`${url}?api=true`, 'ok');

      const http = new HttpRequester();
      await http.fetch(
        '/multipart',
        {
          method: 'POST',
          headers: {
            Accept: 'text/plain',
            'Content-Type': 'multipart/form-data; boundary=---x',
          },
        },
        false,
      );

      const headers = lastHeaders();
      expect(headers.get('Accept')).to.equal('text/plain');
      expect(headers.get('Content-Type')).to.equal('multipart/form-data; boundary=---x');
    });
  });

  describe('fetch() authentication', () => {
    /**
     *
     */
    it('should not add an Authorization header when authenticate is false', async () => {
      const url = `${baseUrl}/no-auth`;
      fetchMock.get(`${url}?api=true`, { ok: true });

      const auth = new StubAuthProvider();
      auth.authed = {
        idToken: 'cached',
        refreshToken: 'r',
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
      };

      const http = new HttpRequester(auth);
      await http.fetch('/no-auth', {}, false);

      expect(lastHeaders().get('Authorization')).to.be.null;
      expect(auth.authenticateCalls).to.equal(0);
    });

    /**
     *
     */
    it('should reuse a cached Authed token without calling authenticate()', async () => {
      const url = `${baseUrl}/me`;
      fetchMock.get(`${url}?api=true`, { ok: true });

      const auth = new StubAuthProvider();
      auth.authed = {
        idToken: 'cached-id',
        refreshToken: 'r',
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
      };

      const http = new HttpRequester(auth);
      await http.fetch('/me');

      expect(lastHeaders().get('Authorization')).to.equal('Bearer cached-id');
      expect(auth.authenticateCalls).to.equal(0);
    });

    /**
     *
     */
    it('should call authenticate() when there is no cached Authed', async () => {
      const url = `${baseUrl}/me`;
      fetchMock.get(`${url}?api=true`, { ok: true });

      const auth = new StubAuthProvider();
      auth.token = 'fetched-id';

      const http = new HttpRequester(auth);
      await http.fetch('/me');

      expect(lastHeaders().get('Authorization')).to.equal('Bearer fetched-id');
      expect(auth.authenticateCalls).to.equal(1);
    });

    /**
     *
     */
    it('should skip the Authorization header when no auth provider is configured', async () => {
      const url = `${baseUrl}/anon`;
      fetchMock.get(`${url}?api=true`, { ok: true });

      const http = new HttpRequester();
      await http.fetch('/anon');

      expect(lastHeaders().get('Authorization')).to.be.null;
    });

    /**
     *
     */
    it('should retry once after auth.refresh() on a 401 response', async () => {
      const url = `${baseUrl}/protected?api=true`;
      const auth = new StubAuthProvider();
      auth.authed = {
        idToken: 'expired-id',
        refreshToken: 'r',
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
      };

      let callCount = 0;
      fetchMock.get(url, () => {
        callCount += 1;
        if (callCount === 1) {
          return { status: 401, body: { error: 'expired' } };
        }
        return { status: 200, body: { ok: true } };
      });

      const http = new HttpRequester(auth);
      const result = await http.fetch<{ ok: boolean }>('/protected');

      expect(callCount).to.equal(2);
      expect(auth.refreshCalls).to.equal(1);
      expect(result).to.deep.equal({ ok: true });
    });

    /**
     *
     */
    it('should not retry indefinitely on persistent 401s', async () => {
      const url = `${baseUrl}/protected?api=true`;
      const auth = new StubAuthProvider();
      auth.authed = {
        idToken: 'bad',
        refreshToken: 'r',
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
      };

      fetchMock.get(url, { status: 401, body: { error: 'still bad' } });

      const http = new HttpRequester(auth);
      let caught: Error | undefined;
      try {
        await http.fetch('/protected');
      } catch (err) {
        caught = err as Error;
      }

      expect(caught).to.be.instanceof(ApiError);
      expect((caught as ApiError).status).to.equal(401);
      // One initial call + one retry; no infinite loop.
      expect(fetchMock.calls(url)).to.have.length(2);
    });
  });

  describe('verb helpers', () => {
    /**
     *
     */
    it('doGet() should send a GET', async () => {
      const url = `${baseUrl}/get`;
      fetchMock.get(`${url}?api=true`, [1, 2, 3]);

      const http = new HttpRequester();
      const result = await http.doGet<number[]>('/get', false);

      expect(result).to.deep.equal([1, 2, 3]);
      const last = fetchMock.lastCall();
      expect((last?.[1] as RequestInit).method).to.equal('GET');
    });

    /**
     *
     */
    it('doPost() should send a POST with a JSON-encoded body', async () => {
      const url = `${baseUrl}/post`;
      fetchMock.post(`${url}?api=true`, { ok: true });

      const http = new HttpRequester();
      const body = { hello: 'world' };
      await http.doPost('/post', body, false);

      const last = fetchMock.lastCall();
      const init = last?.[1] as RequestInit;
      expect(init.method).to.equal('POST');
      expect(init.body).to.equal(JSON.stringify(body));
    });

    /**
     *
     */
    it('doPut() should send a PUT with a JSON-encoded body', async () => {
      const url = `${baseUrl}/put`;
      fetchMock.put(`${url}?api=true`, { ok: true });

      const http = new HttpRequester();
      const body = { hello: 'world' };
      await http.doPut('/put', body, false);

      const last = fetchMock.lastCall();
      const init = last?.[1] as RequestInit;
      expect(init.method).to.equal('PUT');
      expect(init.body).to.equal(JSON.stringify(body));
    });

    /**
     *
     */
    it('doDelete() without a body should send a DELETE and no body', async () => {
      const url = `${baseUrl}/delete`;
      fetchMock.delete(`${url}?api=true`, { ok: true });

      const http = new HttpRequester();
      await http.doDelete('/delete', false);

      const last = fetchMock.lastCall();
      const init = last?.[1] as RequestInit;
      expect(init.method).to.equal('DELETE');
      expect(init.body).to.be.undefined;
    });

    /**
     *
     */
    it('doDelete() with a body should JSON-encode it', async () => {
      const url = `${baseUrl}/delete-with-body`;
      fetchMock.delete(`${url}?api=true`, { ok: true });

      const http = new HttpRequester();
      const body = { ids: ['a', 'b'] };
      await http.doDelete('/delete-with-body', false, body);

      const last = fetchMock.lastCall();
      const init = last?.[1] as RequestInit;
      expect(init.method).to.equal('DELETE');
      expect(init.body).to.equal(JSON.stringify(body));
    });
  });

  describe('response handling', () => {
    /**
     *
     */
    it('should parse a JSON response when Accept is application/json', async () => {
      const url = `${baseUrl}/json-body`;
      fetchMock.get(`${url}?api=true`, { value: 42 });

      const http = new HttpRequester();
      const result = await http.fetch<{ value: number }>('/json-body', {}, false);

      expect(result).to.deep.equal({ value: 42 });
    });

    /**
     *
     */
    it('should return the raw text when Accept is not application/json', async () => {
      const url = `${baseUrl}/text-body`;
      fetchMock.get(`${url}?api=true`, 'PKPASS-BYTES');

      const http = new HttpRequester();
      const result = await http.fetch<string>(
        '/text-body',
        { headers: { Accept: 'application/octet-stream' } },
        false,
      );

      expect(result).to.equal('PKPASS-BYTES');
    });

    /**
     *
     */
    it('should throw ApiError with status, body, and url on a non-ok JSON response', async () => {
      const url = `${baseUrl}/fail-json`;
      fetchMock.get(`${url}?api=true`, { status: 400, body: { error: 'Bad input' } });

      const http = new HttpRequester();
      let caught: Error | undefined;
      try {
        await http.fetch('/fail-json', {}, false);
      } catch (err) {
        caught = err as Error;
      }

      expect(caught).to.be.instanceof(ApiError);
      const api = caught as ApiError;
      expect(api.status).to.equal(400);
      expect(api.body).to.deep.equal({ error: 'Bad input' });
      expect(api.url).to.equal(`${url}?api=true`);
      expect(api.message).to.include('400');
      expect(api.message).to.include('Bad input');
    });

    /**
     *
     */
    it('should throw ApiError carrying the raw text on a non-ok non-JSON response', async () => {
      const url = `${baseUrl}/fail-text`;
      fetchMock.get(`${url}?api=true`, { status: 500, body: 'kaboom' });

      const http = new HttpRequester();
      let caught: Error | undefined;
      try {
        await http.fetch('/fail-text', {}, false);
      } catch (err) {
        caught = err as Error;
      }

      expect(caught).to.be.instanceof(ApiError);
      const api = caught as ApiError;
      expect(api.status).to.equal(500);
      expect(api.body).to.equal('kaboom');
      expect(api.message).to.include('500');
      expect(api.message).to.include('kaboom');
    });
  });
});
