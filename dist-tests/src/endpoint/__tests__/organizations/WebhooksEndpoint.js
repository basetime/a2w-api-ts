"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fetch_mock_1 = __importDefault(require("fetch-mock"));
const constants_1 = require("../../../constants");
const index_1 = require("../../../index");
const baseUrl = (0, constants_1.getBaseUrl)();
const endpoint = '/organization';
describe('OrganizationWebhooksEndpoint', () => {
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
     *
     */
    it('getAll() should GET /organization/webhooks', async () => {
        const url = `${baseUrl}${endpoint}/webhooks?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'WH01' }]);
        const result = await client.organizations.webhooks.getAll();
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('array');
    });
    /**
     *
     */
    it('create() should POST /organization/webhooks with the webhook body', async () => {
        const url = `${baseUrl}${endpoint}/webhooks?api=true`;
        fetch_mock_1.default.post(url, { id: 'WH01' });
        const body = {
            displayName: 'My Webhook',
            url: 'https://example.com/hook',
            event: 'redeemed',
            password: 'secret',
        };
        const result = await client.organizations.webhooks.create(body);
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
    });
    /**
     *
     */
    it('update() should POST /organization/webhooks/:id with the webhook body', async () => {
        const id = 'WH01';
        const url = `${baseUrl}${endpoint}/webhooks/${id}?api=true`;
        fetch_mock_1.default.post(url, { id });
        const body = {
            displayName: 'Renamed',
            url: 'https://example.com/hook',
            event: 'redeemed',
        };
        await client.organizations.webhooks.update(id, body);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
    });
    /**
     *
     */
    it('delete() should DELETE /organization/webhooks/:id', async () => {
        const id = 'WH01';
        const url = `${baseUrl}${endpoint}/webhooks/${id}?api=true`;
        fetch_mock_1.default.delete(url, JSON.stringify('ok'));
        await client.organizations.webhooks.delete(id);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('DELETE');
    });
    /**
     *
     */
    it('getLogs() should GET /organization/webhookLogs', async () => {
        const url = `${baseUrl}${endpoint}/webhookLogs?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'LOG01' }]);
        const result = await client.organizations.webhooks.getLogs();
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('array');
    });
});
