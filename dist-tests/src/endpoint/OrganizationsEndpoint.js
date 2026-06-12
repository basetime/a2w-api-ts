"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ApiKey_1 = require("../types/ApiKey");
const GoogleIssuer_1 = require("../types/GoogleIssuer");
const Organization_1 = require("../types/Organization");
const PassType_1 = require("../types/PassType");
const ScannerInvite_1 = require("../types/ScannerInvite");
const DataStoresEndpoint_1 = __importDefault(require("./organizations/DataStoresEndpoint"));
const ExportersEndpoint_1 = __importDefault(require("./organizations/ExportersEndpoint"));
const WebhooksEndpoint_1 = __importDefault(require("./organizations/WebhooksEndpoint"));
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * Communicate with the organizations endpoints.
 *
 * Top-level methods cover the org itself, scanner-invite handshake, and API keys. Resource
 * sub-endpoints (webhooks, dataStores, exporters) are exposed as `public readonly` props,
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
         * Returns the Apple pass types for the authenticated organization.
         *
         * Sensitive fields (signer certificate, key, passphrase) are omitted from the response.
         */
        this.getPassTypes = async () => {
            return await this.do.get('/passTypes', zod_1.z.array(PassType_1.PassTypeSchema));
        };
        /**
         * Exports a pass type, including its signer certificate, key, and passphrase.
         *
         * @param id The ID of the pass type.
         */
        this.exportPassType = async (id) => {
            return await this.do.get(`/passTypes/${id}/export`, PassType_1.PassTypeExportSchema);
        };
        /**
         * Returns the Google Wallet issuers for the authenticated organization.
         *
         * Service-account credentials are omitted from the response.
         */
        this.getGoogleIssuers = async () => {
            return await this.do.get('/googleIssuers', zod_1.z.array(GoogleIssuer_1.GoogleIssuerSchema));
        };
        /**
         * Exports a Google issuer, including its service-account credentials.
         *
         * @param id The ID of the Google issuer.
         */
        this.exportGoogleIssuer = async (id) => {
            return await this.do.get(`/googleIssuers/${id}/export`, GoogleIssuer_1.GoogleIssuerExportSchema);
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
        this.webhooks = new WebhooksEndpoint_1.default(this);
        this.dataStores = new DataStoresEndpoint_1.default(this);
        this.exporters = new ExportersEndpoint_1.default(this);
    }
}
exports.default = OrganizationsEndpoint;
