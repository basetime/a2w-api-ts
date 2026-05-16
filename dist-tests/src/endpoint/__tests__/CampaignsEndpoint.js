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
const endpoint = '/campaigns';
describe('CampaignsEndpoint', () => {
    const authUrl = `${baseUrl}/auth/apiGrant`;
    const key = 'api_key';
    const secret = 'api_secret';
    let client;
    /**
     *
     */
    beforeEach(() => {
        const idToken = 'xxxxxxxx';
        const refreshToken = 'yyyyyyyy';
        fetch_mock_1.default.post(authUrl, {
            idToken,
            refreshToken,
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
     * Run for all tests.
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
    it('getPasses() should succeed', async () => {
        const campaignId = 'UUUUUU';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes?api=true`;
        console.log(url);
        fetch_mock_1.default.get(url, [{ id: 'PPPPPP' }]);
        const passes = await client.campaigns.getPasses(campaignId);
        expectCommon(url, passes, 'array');
    });
    /**
     *
     */
    it('getPassesByJob() should succeed', async () => {
        const campaignId = 'UUUUUU';
        const jobId = 'JJJJJJ';
        const url = `${baseUrl}${endpoint}/${campaignId}/passes/${jobId}?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'PPPPPP' }]);
        const passes = await client.campaigns.getPassesByJob(campaignId, jobId);
        expectCommon(url, passes, 'array');
    });
    /**
     *
     */
    it('getClaims() should succeed', async () => {
        const campaignId = 'UUUUUU';
        const url = `${baseUrl}${endpoint}/${campaignId}/claims?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'PPPPPP' }]);
        const claims = await client.campaigns.getClaims(campaignId);
        expectCommon(url, claims, 'array');
    });
    /**
     *
     */
    it('getJobs() should succeed', async () => {
        const campaignId = 'UUUUUU';
        const url = `${baseUrl}${endpoint}/${campaignId}/jobs?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'PPPPPP' }]);
        const jobs = await client.campaigns.getJobs(campaignId);
        expectCommon(url, jobs, 'array');
    });
    /**
     *
     */
    it('getStats() should succeed', async () => {
        const campaignId = 'UUUUUU';
        const url = `${baseUrl}${endpoint}/${campaignId}/stats?api=true`;
        fetch_mock_1.default.get(url, { countMacType: 1 });
        const stats = await client.campaigns.getStats(campaignId);
        expectCommon(url, stats, 'object');
    });
    /**
     *
     */
    it('getEnrollments() should succeed', async () => {
        const campaignId = 'UUUUUU';
        const url = `${baseUrl}${endpoint}/${campaignId}/enrollments?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'PPPPPP' }]);
        const enrollments = await client.campaigns.getEnrollments(campaignId);
        expectCommon(url, enrollments, 'array');
    });
});
