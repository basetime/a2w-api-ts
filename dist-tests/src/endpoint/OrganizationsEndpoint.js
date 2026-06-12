"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ApiKey_1 = require("../types/ApiKey");
const Organization_1 = require("../types/Organization");
const ScannerInvite_1 = require("../types/ScannerInvite");
const CertsEndpoint_1 = __importDefault(require("./organizations/CertsEndpoint"));
const DataStoresEndpoint_1 = __importDefault(require("./organizations/DataStoresEndpoint"));
const ExportersEndpoint_1 = __importDefault(require("./organizations/ExportersEndpoint"));
const WebhooksEndpoint_1 = __importDefault(require("./organizations/WebhooksEndpoint"));
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * Communicate with the organizations endpoints.
 *
 * Top-level methods cover the org itself, scanner-invite handshake, and API keys. Resource
 * sub-endpoints (certs, webhooks, dataStores, exporters) are exposed as `public readonly`
 * props,
 * mirroring the composition pattern of {@link ../Client | Client}.
 */
class OrganizationsEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, '/organization');
        /**
         * Fetches the details of the authenticated organization.
         *
         * @returns The organization.
         */
        this.getMine = async () => {
            return await this.do.get('', Organization_1.OrganizationSchema);
        };
        /**
         * Returns a scanner invite by code.
         *
         * @param code The invite code.
         */
        this.getScannerInvite = async (code) => {
            return await this.do.get(`/scanners/invites/${code}`, ScannerInvite_1.ScannerInviteSchema.nullable(), false);
        };
        /**
         * Begins the scanner exchange.
         *
         * @param code The invite code.
         */
        this.startScannerExchange = async (code) => {
            return await this.do.get(`/scanners/invites/${code}/start`, ScannerInvite_1.ScannerInviteSchema.nullable(), false);
        };
        /**
         * Accepts an scanner app invite code and returns api keys.
         *
         * @param code The invite code.
         * @param pushToken The push token.
         * @param scannerDeviceInfo The scanner device info.
         */
        this.finishScannerExchange = async (code, pushToken, scannerDeviceInfo) => {
            return await this.do.post('/scanners/invites', {
                code,
                pushToken,
                scannerDeviceInfo,
            }, ApiKey_1.ApiKeySchema, false);
        };
        /**
         * Returns the API keys for the authenticated organization.
         */
        this.getApiKeys = async () => {
            return await this.do.get('/apiKeys', zod_1.z.array(ApiKey_1.ApiKeySchema));
        };
        /**
         * Returns an API key by ID.
         *
         * @param id The ID of the API key.
         * @param scanner Optional scanner context — typed as `unknown` because the backend
         *   accepts any JSON-serializable value; defaults to the empty string.
         */
        this.getApiKey = async (id, scanner = '') => {
            const url = this.qb.create('/apiKeys/{id}')
                .addParam('id', id)
                .addQuery('scanner', JSON.stringify(scanner));
            return await this.do.get(url, ApiKey_1.ApiKeySchema.nullable());
        };
        /**
         * Deletes an API key.
         *
         * @param id The ID of the API key.
         */
        this.deleteApiKey = async (id) => {
            return await this.do.del(`/apiKeys/${id}`);
        };
        this.certs = new CertsEndpoint_1.default(this);
        this.webhooks = new WebhooksEndpoint_1.default(this);
        this.dataStores = new DataStoresEndpoint_1.default(this);
        this.exporters = new ExportersEndpoint_1.default(this);
    }
}
exports.default = OrganizationsEndpoint;
