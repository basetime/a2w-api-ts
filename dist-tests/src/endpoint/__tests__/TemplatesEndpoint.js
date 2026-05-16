"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fetch_mock_1 = __importDefault(require("fetch-mock"));
const constants_1 = require("../../constants");
const index_1 = require("../../index");
const baseUrl = (0, constants_1.getBaseUrl)();
const endpoint = '/templates';
describe('TemplatesEndpoint', () => {
    const authUrl = `${baseUrl}/auth/apiGrant`;
    const key = 'api_key';
    const secret = 'api_secret';
    let client;
    /**
     *
     */
    beforeEach(() => {
        fetch_mock_1.default.post(authUrl, {
            idToken: 'xxxxxxxx',
            refreshToken: 'yyyyyyyy',
            expiresAt: Date.now() + 1000,
        });
        const auth = new index_1.KeysProvider(key, secret, console);
        client = new index_1.Client(auth);
    });
    /**
     *
     */
    afterEach(() => {
        fetch_mock_1.default.reset();
    });
    /**
     * Run for all authenticated tests.
     *
     * @param url The url that should have been called.
     * @param result The result of the fetch call.
     * @param type The type of the result.
     */
    const expectCommon = (url, result, type) => {
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an(type);
    };
    /**
     *
     */
    it('getById() should GET /templates/simple/:id', async () => {
        const id = 'TPL01';
        const url = `${baseUrl}${endpoint}/simple/${id}?api=true`;
        fetch_mock_1.default.get(url, { id });
        const result = await client.templates.getById(id);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('getAll() should GET /templates/organization', async () => {
        const url = `${baseUrl}${endpoint}/organization?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'TPL01' }]);
        const result = await client.templates.getAll();
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('getByTag() should GET /templates/tagged/:tag', async () => {
        const tag = 'promo';
        const url = `${baseUrl}${endpoint}/tagged/${tag}?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'TPL01' }]);
        const result = await client.templates.getByTag(tag);
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('delete() should DELETE /templates/:id', async () => {
        const id = 'TPL01';
        const url = `${baseUrl}${endpoint}/${id}?api=true`;
        fetch_mock_1.default.delete(url, JSON.stringify('ok'));
        await client.templates.delete(id);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('DELETE');
    });
    /**
     *
     */
    it('clone() should POST /templates/:id/clone with an empty body', async () => {
        const id = 'TPL01';
        const url = `${baseUrl}${endpoint}/${id}/clone?api=true`;
        fetch_mock_1.default.post(url, { id: 'TPL02' });
        const result = await client.templates.clone(id);
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({}));
    });
    /**
     *
     */
    it('export() should GET /templates/:id/export', async () => {
        const id = 'TPL01';
        const url = `${baseUrl}${endpoint}/${id}/export?api=true`;
        fetch_mock_1.default.get(url, { name: 'T', apple: {}, google: {}, files: {} });
        const result = await client.templates.export(id);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('import() should POST /templates/import with a FormData body and not force JSON', async () => {
        const url = `${baseUrl}${endpoint}/import?api=true`;
        fetch_mock_1.default.post(url, { id: 'TPL02' });
        await client.templates.import({ content: '{"name":"T"}', name: 'tpl.json' });
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.be.instanceof(FormData);
        // The runtime attaches `multipart/form-data; boundary=...` itself; we just need to
        // make sure our requester did NOT force `application/json` here.
        const headers = new Headers(init.headers);
        (0, chai_1.expect)(headers.get('Content-Type')).to.not.equal('application/json');
    });
});
