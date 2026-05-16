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
describe('OrganizationDataStoresEndpoint', () => {
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
    it('getAll() should GET /organization/dataStores', async () => {
        const url = `${baseUrl}${endpoint}/dataStores?api=true`;
        fetch_mock_1.default.get(url, [{ id: 'DS01' }]);
        const result = await client.organizations.dataStores.getAll();
        (0, chai_1.expect)(fetch_mock_1.default.called(authUrl)).to.be.true;
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('array');
    });
    /**
     *
     */
    it('getById() should GET /organization/dataStores/:id', async () => {
        const id = 'DS01';
        const url = `${baseUrl}${endpoint}/dataStores/${id}?api=true`;
        fetch_mock_1.default.get(url, { id });
        const result = await client.organizations.dataStores.getById(id);
        (0, chai_1.expect)(fetch_mock_1.default.called(url)).to.be.true;
        (0, chai_1.expect)(result).to.be.an('object');
    });
    /**
     *
     */
    it('create() should PUT /organization/dataStores with the supplied body', async () => {
        const url = `${baseUrl}${endpoint}/dataStores?api=true`;
        fetch_mock_1.default.put(url, { id: 'DS01' });
        const body = {
            name: 'Members',
            source: 'key-value',
            keyValue: [{ key: 'k', value: 'v' }],
        };
        await client.organizations.dataStores.create(body);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('PUT');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
    });
    /**
     *
     */
    it('update() should POST /organization/dataStores/:id with the supplied body', async () => {
        const id = 'DS01';
        const url = `${baseUrl}${endpoint}/dataStores/${id}?api=true`;
        fetch_mock_1.default.post(url, { id });
        const body = { name: 'Members', source: 'key-value' };
        await client.organizations.dataStores.update(id, body);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('POST');
        (0, chai_1.expect)(init.body).to.equal(JSON.stringify(body));
    });
    /**
     *
     */
    it('delete() should DELETE /organization/dataStores/:id', async () => {
        const id = 'DS01';
        const url = `${baseUrl}${endpoint}/dataStores/${id}?api=true`;
        fetch_mock_1.default.delete(url, []);
        await client.organizations.dataStores.delete(id);
        const init = fetch_mock_1.default.lastCall(url)?.[1];
        (0, chai_1.expect)(init.method).to.equal('DELETE');
    });
});
