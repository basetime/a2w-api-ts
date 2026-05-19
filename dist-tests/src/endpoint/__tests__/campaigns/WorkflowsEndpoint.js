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
const endpoint = '/campaigns';
describe('CampaignWorkflowsEndpoint', () => {
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
    it('getAll() should GET /campaigns/:id/workflows', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${endpoint}/${campaignId}/workflows?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'CWF01' }]);
        const result = await client.campaigns.workflows.getAll(campaignId);
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('array');
    });
    /**
     *
     */
    it('attach() should POST /campaigns/:id/workflows with the supplied body', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${endpoint}/${campaignId}/workflows?api=true`;
        fetch_mock_1.default.post(url, { id: 'CWF01' });
        const body = {
            workflowId: 'WF01',
            runsWhen: 'enrolled',
            schedule: null,
        };
        const result = await client.campaigns.workflows.attach(campaignId, body);
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
    });
    /**
     *
     */
    it('update() should POST /campaigns/:id/workflows/:workflowId with the supplied body', async () => {
        const campaignId = 'C01';
        const workflowId = 'CWF01';
        const url = `${baseUrl}${endpoint}/${campaignId}/workflows/${workflowId}?api=true`;
        fetch_mock_1.default.post(url, JSON.stringify('ok'));
        const body = { runsWhen: 'scheduled', schedule: null };
        await client.campaigns.workflows.update(campaignId, workflowId, body);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
    });
    /**
     *
     */
    it('detach() should DELETE /campaigns/:id/workflows/:workflowId', async () => {
        const campaignId = 'C01';
        const workflowId = 'CWF01';
        const url = `${baseUrl}${endpoint}/${campaignId}/workflows/${workflowId}?api=true`;
        fetch_mock_1.default.delete(url, []);
        await client.campaigns.workflows.detach(campaignId, workflowId);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('DELETE');
    });
});
