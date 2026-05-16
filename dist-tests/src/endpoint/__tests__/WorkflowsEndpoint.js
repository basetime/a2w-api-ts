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
const endpoint = '/workflows';
describe('WorkflowsEndpoint', () => {
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
     *
     */
    it('getAll() should GET /workflows', async () => {
        const url = `${baseUrl}${endpoint}?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'WF01' }]);
        const result = await client.workflows.getAll();
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('getById() should GET /workflows/:id', async () => {
        const id = 'WF01';
        const url = `${baseUrl}${endpoint}/${id}?api=true`;
        fetch_mock_1.default.get(url, { id });
        const result = await client.workflows.getById(id);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('create() should POST /workflows with the workflow body', async () => {
        const url = `${baseUrl}${endpoint}?api=true`;
        fetch_mock_1.default.post(url, { id: 'WF01' });
        const input = {
            organizationId: 'ORG01',
            scannerAppId: null,
            name: 'W',
            description: '',
            code: '',
            packages: [],
        };
        const result = await client.workflows.create(input);
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(input));
    });
    /**
     *
     */
    it('update() should POST /workflows/:id with the partial workflow body', async () => {
        const id = 'WF01';
        const url = `${baseUrl}${endpoint}/${id}?api=true`;
        fetch_mock_1.default.post(url, { id });
        const body = { name: 'renamed' };
        const result = await client.workflows.update(id, body);
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
    });
    /**
     *
     */
    it('delete() should DELETE /workflows/:id', async () => {
        const id = 'WF01';
        const url = `${baseUrl}${endpoint}/${id}?api=true`;
        fetch_mock_1.default.delete(url, {});
        await client.workflows.delete(id);
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('DELETE');
    });
    /**
     *
     */
    it('getJobs() should GET /workflows/:id/jobs', async () => {
        const id = 'WF01';
        const url = `${baseUrl}${endpoint}/${id}/jobs?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'JOB01' }]);
        const result = await client.workflows.getJobs(id);
        expectCommon(url, result, 'array');
    });
    /**
     *
     */
    it('getJob() should GET /workflows/jobs/:jobId', async () => {
        const id = 'JOB01';
        const url = `${baseUrl}${endpoint}/jobs/${id}?api=true`;
        fetch_mock_1.default.get(url, { id });
        const result = await client.workflows.getJob(id);
        expectCommon(url, result, 'object');
    });
    /**
     *
     */
    it('updateJob() should POST /workflows/jobs/:jobId with the partial job body', async () => {
        const id = 'JOB01';
        const url = `${baseUrl}${endpoint}/jobs/${id}?api=true`;
        fetch_mock_1.default.post(url, { id });
        const body = { status: 'success' };
        const result = await client.workflows.updateJob(id, body);
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
    });
    /**
     *
     */
    it('addJobLog() should POST /workflows/jobs/:jobId/logs with the message body', async () => {
        const id = 'JOB01';
        const url = `${baseUrl}${endpoint}/jobs/${id}/logs?api=true`;
        fetch_mock_1.default.post(url, { id });
        const message = { type: 'info', message: 'hi' };
        const result = await client.workflows.addJobLog(id, message);
        expectCommon(url, result, 'object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(message));
    });
    /**
     *
     */
    it('getSnippets() should GET /workflows/libraries', async () => {
        const url = `${baseUrl}${endpoint}/libraries?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'LIB01' }]);
        const result = await client.workflows.getSnippets();
        expectCommon(url, result, 'array');
    });
});
