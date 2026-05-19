"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fetch_mock_1 = __importDefault(require("fetch-mock"));
const constants_1 = require("../../constants");
const ApiError_1 = require("../ApiError");
const HttpRequester_1 = __importDefault(require("../HttpRequester"));
const version_1 = require("../../version");
const baseUrl = constants_1.DEFAULT_BASE_URL;
/**
 * Stub auth provider that records interaction and lets each test control its
 * cached `Authed` value and what `authenticate()` / `refresh()` resolve to.
 */
class StubAuthProvider {
    constructor() {
        this.token = 'fresh-token';
        this.refreshedToken = 'refreshed-token';
        this.authenticateCalls = 0;
        this.refreshCalls = 0;
        this.loggerSet = false;
        this.setLogger = (_logger) => {
            this.loggerSet = true;
        };
        this.setBaseUrl = (url) => {
            this.baseUrlSetTo = url;
        };
        this.getAuthed = () => {
            return this.authed;
        };
        this.authenticate = async () => {
            this.authenticateCalls += 1;
            return this.token;
        };
        this.refresh = async () => {
            this.refreshCalls += 1;
            this.authed = {
                idToken: this.refreshedToken,
                refreshToken: this.authed?.refreshToken ?? 'r',
                expiresAt: Math.floor(Date.now() / 1000) + 3600,
            };
            return this.refreshedToken;
        };
    }
}
describe('HttpRequester', () => {
    /**
     *
     */
    afterEach(() => {
        fetch_mock_1.default.reset();
    });
    /**
     * Returns the headers from the most recent fetch call.
     */
    const lastHeaders = () => {
        const last = fetch_mock_1.default.lastCall();
        (0, chai_1.expect)(last).to.not.be.undefined;
        const init = (last?.[1] ?? {});
        return new Headers(init.headers);
    };
    describe('constructor', () => {
        /**
         *
         */
        it('should default to DEFAULT_BASE_URL', () => {
            const http = new HttpRequester_1.default();
            (0, chai_1.expect)(http.getBaseUrl()).to.equal(constants_1.DEFAULT_BASE_URL);
        });
        /**
         *
         */
        it('should accept a baseUrl option', () => {
            const custom = 'https://example.test/api/v1';
            const http = new HttpRequester_1.default(undefined, undefined, { baseUrl: custom });
            (0, chai_1.expect)(http.getBaseUrl()).to.equal(custom);
        });
        /**
         *
         */
        it('should derive the site base URL by stripping /api/v1', () => {
            const http = new HttpRequester_1.default(undefined, undefined, {
                baseUrl: 'https://example.test/api/v1',
            });
            (0, chai_1.expect)(http.getSiteBaseUrl()).to.equal('https://example.test');
        });
    });
    describe('setBaseUrl()', () => {
        /**
         *
         */
        it('should change the base url used by fetch()', async () => {
            const custom = 'https://example.test/api/v1';
            const url = `${custom}/ping?api=true`;
            fetch_mock_1.default.get(url, { ok: true });
            const http = new HttpRequester_1.default();
            http.setBaseUrl(custom);
            await http.fetch('/ping', {}, false);
            (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        });
        /**
         *
         */
        it('should recompute the site base URL', () => {
            const http = new HttpRequester_1.default();
            http.setBaseUrl('https://example.test/api/v1');
            (0, chai_1.expect)(http.getSiteBaseUrl()).to.equal('https://example.test');
        });
        /**
         *
         */
        it('should push the new base url into the auth provider', () => {
            const auth = new StubAuthProvider();
            const http = new HttpRequester_1.default(auth);
            http.setBaseUrl('https://example.test/api/v1');
            (0, chai_1.expect)(auth.baseUrlSetTo).to.equal('https://example.test/api/v1');
        });
    });
    describe('setAuth()', () => {
        /**
         *
         */
        it('should store the provider and wire up the logger', () => {
            const auth = new StubAuthProvider();
            const http = new HttpRequester_1.default();
            http.setAuth(auth);
            (0, chai_1.expect)(http.auth).to.equal(auth);
            (0, chai_1.expect)(auth.loggerSet).to.be.true;
        });
        /**
         *
         */
        it('should push the current base url into the auth provider', () => {
            const auth = new StubAuthProvider();
            const http = new HttpRequester_1.default(undefined, undefined, {
                baseUrl: 'https://example.test/api/v1',
            });
            http.setAuth(auth);
            (0, chai_1.expect)(auth.baseUrlSetTo).to.equal('https://example.test/api/v1');
        });
        /**
         *
         */
        it('should be invoked from the constructor when an auth provider is supplied', () => {
            const auth = new StubAuthProvider();
            const http = new HttpRequester_1.default(auth);
            (0, chai_1.expect)(http.auth).to.equal(auth);
            (0, chai_1.expect)(auth.loggerSet).to.be.true;
        });
    });
    describe('fetch() URL handling', () => {
        /**
         *
         */
        it('should append api=true to a url without a query string', async () => {
            const url = `${baseUrl}/things`;
            fetch_mock_1.default.get(`${url}?api=true`, { ok: true });
            const http = new HttpRequester_1.default();
            await http.fetch('/things', {}, false);
            const last = fetch_mock_1.default.lastCall();
            (0, chai_1.expect)(last?.[0]).to.equal(`${url}?api=true`);
        });
        /**
         *
         */
        it('should append api=true with & to a url that already has a query string', async () => {
            const url = `${baseUrl}/things`;
            fetch_mock_1.default.get(`${url}?foo=bar&api=true`, { ok: true });
            const http = new HttpRequester_1.default();
            await http.fetch('/things?foo=bar', {}, false);
            const last = fetch_mock_1.default.lastCall();
            (0, chai_1.expect)(last?.[0]).to.equal(`${url}?foo=bar&api=true`);
        });
        /**
         *
         */
        it('should not duplicate api=true when the caller has already added it', async () => {
            const url = `${baseUrl}/things?foo=bar&api=true`;
            fetch_mock_1.default.get(url, { ok: true });
            const http = new HttpRequester_1.default();
            await http.fetch('/things?foo=bar&api=true', {}, false);
            (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
            const last = fetch_mock_1.default.lastCall();
            // Should appear exactly once.
            const calls = (last?.[0]).match(/api=true/g);
            (0, chai_1.expect)(calls).to.have.length(1);
        });
        /**
         *
         */
        it('should leave absolute URLs (other than api=true injection) unchanged', async () => {
            const absolute = 'https://other.test/elsewhere';
            fetch_mock_1.default.get(`${absolute}?api=true`, { ok: true });
            const http = new HttpRequester_1.default();
            await http.fetch(absolute, {}, false);
            const last = fetch_mock_1.default.lastCall();
            (0, chai_1.expect)(last?.[0]).to.equal(`${absolute}?api=true`);
        });
        /**
         *
         */
        it('should not duplicate api=true on an absolute URL that already has it', async () => {
            const absolute = 'https://other.test/elsewhere?api=true';
            fetch_mock_1.default.get(absolute, { ok: true });
            const http = new HttpRequester_1.default();
            await http.fetch(absolute, {}, false);
            const last = fetch_mock_1.default.lastCall();
            const occurrences = (last?.[0]).match(/api=true/g);
            (0, chai_1.expect)(occurrences).to.have.length(1);
        });
    });
    describe('fetch() headers', () => {
        /**
         *
         */
        it('should set a default User-Agent header that includes the package version', async () => {
            const url = `${baseUrl}/ua`;
            fetch_mock_1.default.get(`${url}?api=true`, { ok: true });
            const http = new HttpRequester_1.default();
            await http.fetch('/ua', {}, false);
            const ua = lastHeaders().get('User-Agent');
            (0, chai_1.expect)(ua).to.equal(`a2w-api-ts/${version_1.version} (Node.js ${process.version})`);
        });
        /**
         *
         */
        it('should honour a custom User-Agent set via setUserAgent()', async () => {
            const url = `${baseUrl}/ua-custom`;
            fetch_mock_1.default.get(`${url}?api=true`, { ok: true });
            const http = new HttpRequester_1.default();
            http.setUserAgent('my-app/1.2.3');
            await http.fetch('/ua-custom', {}, false);
            (0, chai_1.expect)(lastHeaders().get('User-Agent')).to.equal('my-app/1.2.3');
        });
        /**
         *
         */
        it('should default Accept and Content-Type to application/json', async () => {
            const url = `${baseUrl}/json`;
            fetch_mock_1.default.get(`${url}?api=true`, { ok: true });
            const http = new HttpRequester_1.default();
            await http.fetch('/json', {}, false);
            const headers = lastHeaders();
            (0, chai_1.expect)(headers.get('Accept')).to.equal('application/json');
            (0, chai_1.expect)(headers.get('Content-Type')).to.equal('application/json');
        });
        /**
         *
         */
        it('should not overwrite Accept and Content-Type headers when the caller supplies them', async () => {
            const url = `${baseUrl}/multipart`;
            fetch_mock_1.default.post(`${url}?api=true`, 'ok');
            const http = new HttpRequester_1.default();
            await http.fetch('/multipart', {
                method: 'POST',
                headers: {
                    Accept: 'text/plain',
                    'Content-Type': 'multipart/form-data; boundary=---x',
                },
            }, false);
            const headers = lastHeaders();
            (0, chai_1.expect)(headers.get('Accept')).to.equal('text/plain');
            (0, chai_1.expect)(headers.get('Content-Type')).to.equal('multipart/form-data; boundary=---x');
        });
    });
    describe('fetch() authentication', () => {
        /**
         *
         */
        it('should not add an Authorization header when authenticate is false', async () => {
            const url = `${baseUrl}/no-auth`;
            fetch_mock_1.default.get(`${url}?api=true`, { ok: true });
            const auth = new StubAuthProvider();
            auth.authed = {
                idToken: 'cached',
                refreshToken: 'r',
                expiresAt: Math.floor(Date.now() / 1000) + 3600,
            };
            const http = new HttpRequester_1.default(auth);
            await http.fetch('/no-auth', {}, false);
            (0, chai_1.expect)(lastHeaders().get('Authorization')).to.be.null;
            (0, chai_1.expect)(auth.authenticateCalls).to.equal(0);
        });
        /**
         *
         */
        it('should reuse a cached Authed token without calling authenticate()', async () => {
            const url = `${baseUrl}/me`;
            fetch_mock_1.default.get(`${url}?api=true`, { ok: true });
            const auth = new StubAuthProvider();
            auth.authed = {
                idToken: 'cached-id',
                refreshToken: 'r',
                expiresAt: Math.floor(Date.now() / 1000) + 3600,
            };
            const http = new HttpRequester_1.default(auth);
            await http.fetch('/me');
            (0, chai_1.expect)(lastHeaders().get('Authorization')).to.equal('Bearer cached-id');
            (0, chai_1.expect)(auth.authenticateCalls).to.equal(0);
        });
        /**
         *
         */
        it('should call authenticate() when there is no cached Authed', async () => {
            const url = `${baseUrl}/me`;
            fetch_mock_1.default.get(`${url}?api=true`, { ok: true });
            const auth = new StubAuthProvider();
            auth.token = 'fetched-id';
            const http = new HttpRequester_1.default(auth);
            await http.fetch('/me');
            (0, chai_1.expect)(lastHeaders().get('Authorization')).to.equal('Bearer fetched-id');
            (0, chai_1.expect)(auth.authenticateCalls).to.equal(1);
        });
        /**
         *
         */
        it('should skip the Authorization header when no auth provider is configured', async () => {
            const url = `${baseUrl}/anon`;
            fetch_mock_1.default.get(`${url}?api=true`, { ok: true });
            const http = new HttpRequester_1.default();
            await http.fetch('/anon');
            (0, chai_1.expect)(lastHeaders().get('Authorization')).to.be.null;
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
            fetch_mock_1.default.get(url, () => {
                callCount += 1;
                if (callCount === 1) {
                    return { status: 401, body: { error: 'expired' } };
                }
                return { status: 200, body: { ok: true } };
            });
            const http = new HttpRequester_1.default(auth);
            const result = await http.fetch('/protected');
            (0, chai_1.expect)(callCount).to.equal(2);
            (0, chai_1.expect)(auth.refreshCalls).to.equal(1);
            (0, chai_1.expect)(result).to.deep.equal({ ok: true });
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
            fetch_mock_1.default.get(url, { status: 401, body: { error: 'still bad' } });
            const http = new HttpRequester_1.default(auth);
            let caught;
            try {
                await http.fetch('/protected');
            }
            catch (err) {
                caught = err;
            }
            (0, chai_1.expect)(caught).to.be.instanceof(ApiError_1.ApiError);
            (0, chai_1.expect)(caught.status).to.equal(401);
            // One initial call + one retry; no infinite loop.
            (0, chai_1.expect)(fetch_mock_1.default.calls(url)).to.have.length(2);
        });
    });
    describe('verb helpers', () => {
        /**
         *
         */
        it('doGet() should send a GET', async () => {
            const url = `${baseUrl}/get`;
            fetch_mock_1.default.get(`${url}?api=true`, [1, 2, 3]);
            const http = new HttpRequester_1.default();
            const result = await http.doGet('/get', false);
            (0, chai_1.expect)(result).to.deep.equal([1, 2, 3]);
            const last = fetch_mock_1.default.lastCall();
            (0, chai_1.expect)((last?.[1]).method).to.equal('GET');
        });
        /**
         *
         */
        it('doPost() should send a POST with a JSON-encoded body', async () => {
            const url = `${baseUrl}/post`;
            fetch_mock_1.default.post(`${url}?api=true`, { ok: true });
            const http = new HttpRequester_1.default();
            const body = { hello: 'world' };
            await http.doPost('/post', body, false);
            const last = fetch_mock_1.default.lastCall();
            const init = last?.[1];
            (0, chai_1.expect)(init.method).to.equal('POST');
            (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
        });
        /**
         *
         */
        it('doPut() should send a PUT with a JSON-encoded body', async () => {
            const url = `${baseUrl}/put`;
            fetch_mock_1.default.put(`${url}?api=true`, { ok: true });
            const http = new HttpRequester_1.default();
            const body = { hello: 'world' };
            await http.doPut('/put', body, false);
            const last = fetch_mock_1.default.lastCall();
            const init = last?.[1];
            (0, chai_1.expect)(init.method).to.equal('PUT');
            (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
        });
        /**
         *
         */
        it('doDelete() without a body should send a DELETE and no body', async () => {
            const url = `${baseUrl}/delete`;
            fetch_mock_1.default.delete(`${url}?api=true`, { ok: true });
            const http = new HttpRequester_1.default();
            await http.doDelete('/delete', false);
            const last = fetch_mock_1.default.lastCall();
            const init = last?.[1];
            (0, chai_1.expect)(init.method).to.equal('DELETE');
            (0, chai_1.expect)(init.body).to.be.undefined;
        });
        /**
         *
         */
        it('doDelete() with a body should JSON-encode it', async () => {
            const url = `${baseUrl}/delete-with-body`;
            fetch_mock_1.default.delete(`${url}?api=true`, { ok: true });
            const http = new HttpRequester_1.default();
            const body = { ids: ['a', 'b'] };
            await http.doDelete('/delete-with-body', false, body);
            const last = fetch_mock_1.default.lastCall();
            const init = last?.[1];
            (0, chai_1.expect)(init.method).to.equal('DELETE');
            (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
        });
    });
    describe('response handling', () => {
        /**
         *
         */
        it('should parse a JSON response when Accept is application/json', async () => {
            const url = `${baseUrl}/json-body`;
            fetch_mock_1.default.get(`${url}?api=true`, { value: 42 });
            const http = new HttpRequester_1.default();
            const result = await http.fetch('/json-body', {}, false);
            (0, chai_1.expect)(result).to.deep.equal({ value: 42 });
        });
        /**
         *
         */
        it('should return the raw text when Accept is not application/json', async () => {
            const url = `${baseUrl}/text-body`;
            fetch_mock_1.default.get(`${url}?api=true`, 'PKPASS-BYTES');
            const http = new HttpRequester_1.default();
            const result = await http.fetch('/text-body', { headers: { Accept: 'application/octet-stream' } }, false);
            (0, chai_1.expect)(result).to.equal('PKPASS-BYTES');
        });
        /**
         *
         */
        it('should throw ApiError with status, body, and url on a non-ok JSON response', async () => {
            const url = `${baseUrl}/fail-json`;
            fetch_mock_1.default.get(`${url}?api=true`, { status: 400, body: { error: 'Bad input' } });
            const http = new HttpRequester_1.default();
            let caught;
            try {
                await http.fetch('/fail-json', {}, false);
            }
            catch (err) {
                caught = err;
            }
            (0, chai_1.expect)(caught).to.be.instanceof(ApiError_1.ApiError);
            const api = caught;
            (0, chai_1.expect)(api.status).to.equal(400);
            (0, chai_1.expect)(api.body).to.deep.equal({ error: 'Bad input' });
            (0, chai_1.expect)(api.url).to.equal(`${url}?api=true`);
            (0, chai_1.expect)(api.message).to.include('400');
            (0, chai_1.expect)(api.message).to.include('Bad input');
        });
        /**
         *
         */
        it('should throw ApiError carrying the raw text on a non-ok non-JSON response', async () => {
            const url = `${baseUrl}/fail-text`;
            fetch_mock_1.default.get(`${url}?api=true`, { status: 500, body: 'kaboom' });
            const http = new HttpRequester_1.default();
            let caught;
            try {
                await http.fetch('/fail-text', {}, false);
            }
            catch (err) {
                caught = err;
            }
            (0, chai_1.expect)(caught).to.be.instanceof(ApiError_1.ApiError);
            const api = caught;
            (0, chai_1.expect)(api.status).to.equal(500);
            (0, chai_1.expect)(api.body).to.equal('kaboom');
            (0, chai_1.expect)(api.message).to.include('500');
            (0, chai_1.expect)(api.message).to.include('kaboom');
        });
    });
});
