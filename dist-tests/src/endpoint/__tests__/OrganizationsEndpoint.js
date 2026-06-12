"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fetch_mock_1 = __importDefault(require("fetch-mock"));
const constants_1 = require("../../constants");
const index_1 = require("../../index");
const baseUrl = constants_1.DEFAULT_BASE_URL;
const endpoint = '/organization';
describe('OrganizationsEndpoint', () => {
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
     * Run for authenticated tests.
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
     * Run for unauthenticated tests.
     *
     * @param url The url that should have been called.
     */
    const expectUnauth = (url) => {
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.false;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
    };
    /**
     *
     */
    it('getMine() should GET /organization', async () => {
        const url = `${baseUrl}${endpoint}?api=true`;
        fetch_mock_1.default.get(url, { id: 'ORG01' });
        const result = await client.organizations.getMine();
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('getScannerInvite() should GET /organization/scanners/invites/:code unauthenticated', async () => {
        const code = 'INV01';
        const url = `${baseUrl}${endpoint}/scanners/invites/${code}?api=true`;
        fetch_mock_1.default.get(url, { code });
        const result = await client.organizations.getScannerInvite(code);
        expectUnauth(url);
        (0, chai_1.expect)(result).to.be.an('object');
    });
    /**
     *
     */
    it('startScannerExchange() should GET /organization/scanners/invites/:code/start unauthenticated', async () => {
        const code = 'INV01';
        const url = `${baseUrl}${endpoint}/scanners/invites/${code}/start?api=true`;
        fetch_mock_1.default.get(url, { code });
        const result = await client.organizations.startScannerExchange(code);
        expectUnauth(url);
        (0, chai_1.expect)(result).to.be.an('object');
    });
    /**
     *
     */
    it('finishScannerExchange() should POST /organization/scanners/invites unauthenticated with the supplied body', async () => {
        const url = `${baseUrl}${endpoint}/scanners/invites?api=true`;
        fetch_mock_1.default.post(url, { id: 'KEY01' });
        const code = 'INV01';
        const pushToken = 'PUSH';
        const scannerDeviceInfo = {
            manufacturer: 'Apple',
            model: 'iPhone',
            osVersion: '17.0',
            device: 'Mobile',
            deviceName: 'My iPhone',
        };
        const result = await client.organizations.finishScannerExchange(code, pushToken, scannerDeviceInfo);
        expectUnauth(url);
        (0, chai_1.expect)(result).to.be.an('object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ code, pushToken, scannerDeviceInfo }));
    });
    /**
     *
     */
    it('getApiKeys() should GET /organization/apiKeys', async () => {
        const url = `${baseUrl}${endpoint}/apiKeys?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'KEY01' }]);
        const result = await client.organizations.getApiKeys();
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('getPassTypes() should GET /organization/passTypes', async () => {
        const url = `${baseUrl}${endpoint}/passTypes?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'pass.io.example.demo' }]);
        const result = await client.organizations.getPassTypes();
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('exportPassType() should GET /organization/passTypes/:id/export with token query', async () => {
        const id = 'pass.io.example.demo';
        const token = 'OTT01';
        const url = `${baseUrl}${endpoint}/passTypes/${id}/export?token=${token}&api=true`;
        fetch_mock_1.default.get(url, {
            id,
            signerCert: 'CERT',
            signerKey: 'KEY',
            signerKeyPassphrase: '',
            teamIdentifier: 'TEAM01',
        });
        const result = await client.organizations.exportPassType(id, token);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('getGoogleIssuers() should GET /organization/googleIssuers', async () => {
        const url = `${baseUrl}${endpoint}/googleIssuers?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'issuer01', name: 'Example Issuer' }]);
        const result = await client.organizations.getGoogleIssuers();
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('exportGoogleIssuer() should GET /organization/googleIssuers/:id/export with token query', async () => {
        const id = 'issuer01';
        const token = 'OTT01';
        const url = `${baseUrl}${endpoint}/googleIssuers/${id}/export?token=${token}&api=true`;
        fetch_mock_1.default.get(url, {
            id,
            name: 'Example Issuer',
            credentials: '{"type":"service_account"}',
        });
        const result = await client.organizations.exportGoogleIssuer(id, token);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('getApiKey() should GET /organization/apiKeys/:id with scanner query', async () => {
        const id = 'KEY01';
        const scannerStr = encodeURIComponent(JSON.stringify(''));
        const url = `${baseUrl}${endpoint}/apiKeys/${id}?scanner=${scannerStr}&api=true`;
        fetch_mock_1.default.get(url, { id });
        const result = await client.organizations.getApiKey(id);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('deleteApiKey() should DELETE /organization/apiKeys/:id', async () => {
        const id = 'KEY01';
        const url = `${baseUrl}${endpoint}/apiKeys/${id}?api=true`;
        fetch_mock_1.default.delete(url, {});
        await client.organizations.deleteApiKey(id);
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('DELETE');
    });
});
