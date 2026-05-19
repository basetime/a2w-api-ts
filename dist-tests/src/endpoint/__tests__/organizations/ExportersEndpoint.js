"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fetch_mock_1 = __importDefault(require("fetch-mock"));
const constants_1 = require("../../../constants");
const index_1 = require("../../../index");
const baseUrl = constants_1.DEFAULT_BASE_URL;
const endpoint = '/organization';
describe('OrganizationExportersEndpoint', () => {
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
     * Sample input shared across the create/update tests.
     */
    const sampleInput = () => ({
        name: 'Daily SFTP',
        what: 'enrollments',
        when: 'daily',
        time: '03:00',
        source: 'sftp',
        config: { hostname: 'sftp.example.com' },
    });
    /**
     *
     */
    it('getAll() should GET /organization/exporters', async () => {
        const url = `${baseUrl}${endpoint}/exporters?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'EX01' }]);
        const result = await client.organizations.exporters.getAll();
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('array');
    });
    /**
     *
     */
    it('getById() should GET /organization/exporters/:id', async () => {
        const id = 'EX01';
        const url = `${baseUrl}${endpoint}/exporters/${id}?api=true`;
        fetch_mock_1.default.get(url, { id });
        const result = await client.organizations.exporters.getById(id);
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('object');
    });
    /**
     *
     */
    it('create() should PUT /organization/exporters with the supplied body', async () => {
        const url = `${baseUrl}${endpoint}/exporters?api=true`;
        fetch_mock_1.default.put(url, [{ id: 'EX01' }]);
        const body = sampleInput();
        await client.organizations.exporters.create(body);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('PUT');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
    });
    /**
     *
     */
    it('update() should POST /organization/exporters/:id with the supplied body', async () => {
        const id = 'EX01';
        const url = `${baseUrl}${endpoint}/exporters/${id}?api=true`;
        fetch_mock_1.default.post(url, { id });
        const body = sampleInput();
        await client.organizations.exporters.update(id, body);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
    });
    /**
     *
     */
    it('delete() should DELETE /organization/exporters/:id', async () => {
        const id = 'EX01';
        const url = `${baseUrl}${endpoint}/exporters/${id}?api=true`;
        fetch_mock_1.default.delete(url, JSON.stringify('ok'));
        await client.organizations.exporters.delete(id);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('DELETE');
    });
    /**
     *
     */
    it('run() should POST /organization/exporters/:id/run with an empty body', async () => {
        const id = 'EX01';
        const url = `${baseUrl}${endpoint}/exporters/${id}/run?api=true`;
        fetch_mock_1.default.post(url, JSON.stringify('ok'));
        await client.organizations.exporters.run(id);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({}));
    });
    /**
     *
     */
    it('getLogs() should GET /organization/exporters/:id/logs', async () => {
        const id = 'EX01';
        const url = `${baseUrl}${endpoint}/exporters/${id}/logs?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'LOG01' }]);
        const result = await client.organizations.exporters.getLogs(id);
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('array');
    });
    /**
     *
     */
    it('getLog() should GET /organization/exporters/:id/logs/:logId', async () => {
        const id = 'EX01';
        const logId = 'LOG01';
        const url = `${baseUrl}${endpoint}/exporters/${id}/logs/${logId}?api=true`;
        fetch_mock_1.default.get(url, { id: logId });
        const result = await client.organizations.exporters.getLog(id, logId);
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('object');
    });
});
