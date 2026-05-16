"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * Communicate with the organizations endpoints.
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
            return await this.do.get('');
        };
        /**
         * Returns a scanner invite by code.
         *
         * @param code The invite code.
         */
        this.getScannerInvite = async (code) => {
            return await this.do.get(`/scanners/invites/${code}`, false);
        };
        /**
         * Begins the scanner exchange.
         *
         * @param code The invite code.
         */
        this.startScannerExchange = async (code) => {
            return await this.do.get(`/scanners/invites/${code}/start`, false);
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
            }, false);
        };
        /**
         * Returns the API keys for the authenticated organization.
         */
        this.getApiKeys = async () => {
            return await this.do.get('/apiKeys');
        };
        /**
         * Returns an API key by ID.
         *
         * @param id The ID of the API key.
         */
        this.getApiKey = async (id, scanner = '') => {
            const url = this.qb.create('/apiKeys/{id}')
                .addParam('id', id)
                .addQuery('scanner', JSON.stringify(scanner));
            return await this.do.get(url);
        };
        /**
         * Deletes an API key.
         *
         * @param id The ID of the API key.
         */
        this.deleteApiKey = async (id) => {
            return await this.do.del(`/apiKeys/${id}`);
        };
    }
}
exports.default = OrganizationsEndpoint;
