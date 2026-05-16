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
const endpoint = '/campaigns';
describe('CampaignWalletsEndpoint', () => {
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
    it('getAll() should GET /campaigns/:id/wallets', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${endpoint}/${campaignId}/wallets?api=true`;
        fetch_mock_1.default.get(url, { bundled: {}, bundles: [], page: 1, totalItems: 0, totalPages: 0 });
        const result = await client.campaigns.wallets.getAll(campaignId);
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('object');
    });
    /**
     *
     */
    it('getAll() should attach page and perPage query params when supplied', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${endpoint}/${campaignId}/wallets?page=2&perPage=25&api=true`;
        fetch_mock_1.default.get(url, { bundled: {}, bundles: [], page: 2, totalItems: 0, totalPages: 0 });
        await client.campaigns.wallets.getAll(campaignId, { page: 2, perPage: 25 });
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
    });
    /**
     *
     */
    it('getEnrollment() should GET /campaigns/:id/wallets/enrollments/:enrollmentId', async () => {
        const campaignId = 'C01';
        const enrollmentId = 'E01';
        const url = `${baseUrl}${endpoint}/${campaignId}/wallets/enrollments/${enrollmentId}?api=true`;
        fetch_mock_1.default.get(url, { campaign: {}, enrollment: { id: enrollmentId } });
        const result = await client.campaigns.wallets.getEnrollment(campaignId, enrollmentId);
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('object');
    });
    /**
     *
     */
    it('getPushLogs() should GET /campaigns/:id/wallets/pushes/:passId/logs', async () => {
        const campaignId = 'C01';
        const passId = 'P01';
        const url = `${baseUrl}${endpoint}/${campaignId}/wallets/pushes/${passId}/logs?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'WU01' }]);
        const result = await client.campaigns.wallets.getPushLogs(campaignId, passId);
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('array');
    });
    /**
     *
     */
    it('pushTemplates() should POST /campaigns/:id/wallets/pushes with the templates body', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${endpoint}/${campaignId}/wallets/pushes?api=true`;
        fetch_mock_1.default.post(url, JSON.stringify(42));
        const templates = ['T01', 'T02'];
        const result = await client.campaigns.wallets.pushTemplates(campaignId, templates);
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.equal(42);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ templates }));
    });
    /**
     *
     */
    it('dismissPushes() should DELETE /campaigns/:id/wallets/pushes', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${endpoint}/${campaignId}/wallets/pushes?api=true`;
        fetch_mock_1.default.delete(url, JSON.stringify('ok'));
        await client.campaigns.wallets.dismissPushes(campaignId);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('DELETE');
    });
});
