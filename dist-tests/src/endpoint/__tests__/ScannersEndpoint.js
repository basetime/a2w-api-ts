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
const endpoint = '/scanners';
/**
 * Builds a minimal valid ScannerApp used as a fixture for tests that don't
 * care about most fields.
 *
 * @param overrides Optional partial overrides.
 */
const buildScannerApp = (overrides = {}) => ({
    id: 'APP01',
    name: 'App',
    description: '',
    registrationCode: 'REG01',
    organizationId: 'ORG01',
    parentId: '0',
    tags: [],
    attributes: { items: [] },
    webviewScanUrl: '',
    webviewStandbyUrl: '',
    webviewErrorUrl: '',
    webviewPassword: '',
    scannerCount: 0,
    ...overrides,
});
/**
 * A minimal ScannerAppInput used as a fixture for create/update tests.
 */
const sampleInput = {
    name: 'App',
    description: '',
    tags: [],
    attributes: { items: [] },
    webviewScanUrl: '',
    webviewStandbyUrl: '',
    webviewErrorUrl: '',
    webviewPassword: '',
};
describe('ScannersEndpoint', () => {
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
    it('getByRegistrationCode() should GET /scanners/registrationCode/:code unauthenticated', async () => {
        const code = 'REG01';
        const url = `${baseUrl}${endpoint}/registrationCode/${code}?api=true`;
        fetch_mock_1.default.get(url, { id: 'APP01' });
        const result = await client.scanners.getByRegistrationCode(code);
        expectUnauth(url);
        (0, chai_1.expect)(result).to.be.an('object');
    });
    /**
     *
     */
    it('registerDevice() should POST /scanners/register/:appId unauthenticated with deviceInfo + pushToken', async () => {
        const scannerApp = buildScannerApp({ id: 'APP01' });
        const url = `${baseUrl}${endpoint}/register/${scannerApp.id}?api=true`;
        fetch_mock_1.default.post(url, { id: 'KEY01' });
        const pushToken = 'PUSH';
        const deviceInfo = {
            manufacturer: 'Apple',
            model: 'iPhone',
            osVersion: '17.0',
            device: 'Mobile',
            deviceName: 'My iPhone',
        };
        const result = await client.scanners.registerDevice(scannerApp, pushToken, deviceInfo);
        expectUnauth(url);
        (0, chai_1.expect)(result).to.be.an('object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ deviceInfo, pushToken }));
    });
    /**
     *
     */
    it('deregisterDevice() should DELETE /scanners/deregister/:apiKeyId', async () => {
        const apiKey = {
            id: 'KEY01',
            name: 'k',
            key: 'k',
            secret: 's',
            organizationId: 'ORG01',
            createdDate: new Date(),
        };
        const url = `${baseUrl}${endpoint}/deregister/${apiKey.id}?api=true`;
        fetch_mock_1.default.delete(url, {});
        await client.scanners.deregisterDevice(apiKey);
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('DELETE');
    });
    /**
     *
     */
    it('getAll() should GET /scanners/organizations/apps', async () => {
        const url = `${baseUrl}${endpoint}/organizations/apps?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'APP01' }]);
        const result = await client.scanners.getAll();
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('getById() should GET /scanners/organizations/:id', async () => {
        const id = 'APP01';
        const url = `${baseUrl}${endpoint}/organizations/${id}?api=true`;
        fetch_mock_1.default.get(url, { id });
        const result = await client.scanners.getById(id);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('createApp() should POST /scanners/organizations/apps with the input body', async () => {
        const url = `${baseUrl}${endpoint}/organizations/apps?api=true`;
        fetch_mock_1.default.post(url, { id: 'APP01' });
        const result = await client.scanners.createApp(sampleInput);
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(sampleInput));
    });
    /**
     *
     */
    it('updateApp() should POST /scanners/organizations/:id with the input body', async () => {
        const id = 'APP01';
        const url = `${baseUrl}${endpoint}/organizations/${id}?api=true`;
        fetch_mock_1.default.post(url, { id });
        const result = await client.scanners.updateApp(id, sampleInput);
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(sampleInput));
    });
    /**
     *
     */
    it('deleteApp() should DELETE /scanners/organizations/apps/:id', async () => {
        const id = 'APP01';
        const url = `${baseUrl}${endpoint}/organizations/apps/${id}?api=true`;
        fetch_mock_1.default.delete(url, {});
        await client.scanners.deleteApp(id);
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('DELETE');
    });
});
