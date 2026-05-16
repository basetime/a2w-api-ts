"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fetch_mock_1 = __importDefault(require("fetch-mock"));
const constants_1 = require("../../constants");
const index_1 = require("../../index");
const apiBaseUrl = (0, constants_1.getBaseUrl)();
const siteBaseUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, '');
describe('WidgetsEndpoint', () => {
    let client;
    /**
     *
     */
    beforeEach(() => {
        client = new index_1.Client();
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
    it('signJwt() should POST /widgets/jwt with the payload + secret body', async () => {
        const url = `${siteBaseUrl}/widgets/jwt?api=true`;
        fetch_mock_1.default.post(url, JSON.stringify('JWT-TOKEN'));
        const payload = { sub: 'user' };
        const secret = 'shhh';
        const result = await client.widgets.signJwt(payload, secret);
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.equal('JWT-TOKEN');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ payload, secret }));
    });
    /**
     *
     */
    it('signCampaignJwt() should POST /widgets/jwt/:campaignId with the payload body', async () => {
        const campaignId = 'C01';
        const url = `${siteBaseUrl}/widgets/jwt/${campaignId}?api=true`;
        fetch_mock_1.default.post(url, JSON.stringify('JWT-TOKEN'));
        const payload = { metaValues: {}, formValues: { primaryKey: '1' } };
        const result = await client.widgets.signCampaignJwt(campaignId, payload);
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.equal('JWT-TOKEN');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify({ payload }));
    });
    /**
     *
     */
    it('signCampaignJwt() should URL-encode the campaign ID segment', async () => {
        const campaignId = 'C 01/x';
        const encoded = encodeURIComponent(campaignId);
        const url = `${siteBaseUrl}/widgets/jwt/${encoded}?api=true`;
        fetch_mock_1.default.post(url, JSON.stringify('JWT-TOKEN'));
        await client.widgets.signCampaignJwt(campaignId, {});
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
    });
    /**
     *
     */
    it('signJwt() should not require an auth provider', async () => {
        const url = `${siteBaseUrl}/widgets/jwt?api=true`;
        fetch_mock_1.default.post(url, JSON.stringify('JWT-TOKEN'));
        await client.widgets.signJwt({}, 'x');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        const headers = new Headers(init.headers);
        (0, chai_1.expect)(headers.has('Authorization')).to.be.false;
    });
});
