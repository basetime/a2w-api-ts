"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fetch_mock_1 = __importDefault(require("fetch-mock"));
const constants_1 = require("../../constants");
const HttpRequester_1 = __importDefault(require("../HttpRequester"));
const version_1 = require("../../version");
const baseUrl = (0, constants_1.getBaseUrl)();
/**
 * Stub auth provider that records interaction and lets each test control its
 * cached `Authed` value and what `authenticate()` resolves to.
 */
class StubAuthProvider {
    constructor() {
        this.token = 'fresh-token';
        this.authenticateCalls = 0;
        this.loggerSet = false;
        /**
         *
         */
        this.setLogger = (_logger) => {
            this.loggerSet = true;
        };
        /**
         *
         */
        this.getAuthed = () => {
            return this.authed;
        };
        /**
         *
         */
        this.authenticate = async () => {
            this.authenticateCalls += 1;
            return this.token;
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
    describe('setBaseUrl()', () => {
        /**
         *
         */
        it('should change the base url used by fetch()', async () => {
            const original = (0, constants_1.getBaseUrl)();
            const custom = 'https://example.test/api/v1';
            const url = `${custom}/ping?api=true`;
            fetch_mock_1.default.get(url, { ok: true });
            const http = new HttpRequester_1.default();
            http.setBaseUrl(custom);
            try {
                await http.fetch('/ping', {}, false);
                (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
            }
            finally {
                (0, constants_1.setBaseUrl)(original);
            }
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
        it('should be invoked from the constructor when an auth provider is supplied', () => {
            const auth = new StubAuthProvider();
            const http = new HttpRequester_1.default(auth);
            (0, chai_1.expect)(http.auth).to.equal(auth);
            (0, chai_1.expect)(auth.loggerSet).to.be.true;
        });
    });
    describe('fetch() headers', () => {
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
            auth.authed = { idToken: 'cached', refreshToken: 'r', expiresAt: Date.now() + 1000 };
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
            auth.authed = { idToken: 'cached-id', refreshToken: 'r', expiresAt: Date.now() + 1000 };
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
        it('should throw using the response body error field on a non-ok JSON response', async () => {
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
            (0, chai_1.expect)(caught).to.be.an.instanceof(Error);
            (0, chai_1.expect)(caught?.message).to.include('400');
            (0, chai_1.expect)(caught?.message).to.include('Bad input');
        });
        /**
         *
         */
        it('should throw using the response body on a non-ok text response', async () => {
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
            (0, chai_1.expect)(caught).to.be.an.instanceof(Error);
            (0, chai_1.expect)(caught?.message).to.include('500');
            (0, chai_1.expect)(caught?.message).to.include('kaboom');
        });
    });
});
