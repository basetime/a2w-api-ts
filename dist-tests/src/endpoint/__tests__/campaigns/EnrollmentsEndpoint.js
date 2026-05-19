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
const enrollmentEndpoint = '/e';
describe('CampaignEnrollmentsEndpoint', () => {
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
    it('getAll() should GET /campaigns/:id/enrollments', async () => {
        const campaignId = 'UUUUUU';
        const url = `${baseUrl}${endpoint}/${campaignId}/enrollments?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'PPPPPP' }]);
        const enrollments = await client.campaigns.enrollments.getAll(campaignId);
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(enrollments).to.be.an('array');
    });
    /**
     *
     */
    it('create() should throw when jwtEncode is not configured', async () => {
        let caught;
        try {
            await client.campaigns.enrollments.create('C01');
        }
        catch (err) {
            caught = err;
        }
        (0, chai_1.expect)(caught).to.be.an.instanceof(Error);
        (0, chai_1.expect)(caught?.message).to.include('jwtEncode');
    });
    /**
     *
     */
    it('create() should POST /e/campaign/:id with a jwt-encoded body', async () => {
        const campaignId = 'C01';
        const url = `${baseUrl}${enrollmentEndpoint}/campaign/${campaignId}?api=true`;
        fetch_mock_1.default.post(url, { pass: 'BUNDLE01', errors: [] });
        client.campaigns.enrollments.jwtEncode = async () => 'encoded-jwt';
        const result = await client.campaigns.enrollments.create(campaignId, { logo: 'logo.png' }, { form: 'f' });
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('object');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ d: 'encoded-jwt' }));
    });
});
