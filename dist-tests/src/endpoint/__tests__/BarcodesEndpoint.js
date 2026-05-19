"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fetch_mock_1 = __importDefault(require("fetch-mock"));
const constants_1 = require("../../constants");
const index_1 = require("../../index");
const apiBaseUrl = constants_1.DEFAULT_BASE_URL;
const siteBaseUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, '');
describe('BarcodesEndpoint', () => {
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
    it('render() should GET /barcodes at the site root (outside /api/v1)', async () => {
        const url = `${siteBaseUrl}/barcodes?type=qrcode&data=hello&api=true`;
        fetch_mock_1.default.get(url, 'PNG-BODY');
        const result = await client.barcodes.render({ type: 'qrcode', data: 'hello' });
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.equal('PNG-BODY');
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        const headers = new Headers(init.headers);
        (0, chai_1.expect)(headers.get('Accept')).to.equal('image/png');
    });
    /**
     *
     */
    it('render() should pass width/height/color/background as query params when set', async () => {
        const url = `${siteBaseUrl}/barcodes?type=code128&data=ABC123&width=200&height=120` +
            `&color=%23000000&background=%23FFFFFF&api=true`;
        fetch_mock_1.default.get(url, 'PNG-BODY');
        await client.barcodes.render({
            type: 'code128',
            data: 'ABC123',
            width: 200,
            height: 120,
            color: '#000000',
            background: '#FFFFFF',
        });
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
    });
    /**
     *
     */
    it('render() should not require an auth provider', async () => {
        const url = `${siteBaseUrl}/barcodes?type=qrcode&data=hello&api=true`;
        fetch_mock_1.default.get(url, 'PNG-BODY');
        await client.barcodes.render({ type: 'qrcode', data: 'hello' });
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        const headers = new Headers(init.headers);
        (0, chai_1.expect)(headers.has('Authorization')).to.be.false;
    });
});
