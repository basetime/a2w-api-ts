"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * The organizations endpoint.
 */
const endpoint = '/organization';
/**
 * Communicate with the organizations endpoints.
 */
class OrganizationsEndpoint extends Endpoint_1.default {
    constructor() {
        super(...arguments);
        /**
         * Fetches the details of the authenticated organization.
         *
         * @returns The organization.
         */
        this.getMine = async () => {
            return await this.doGet(endpoint);
        };
        /**
         * Returns a scanner invite by code.
         *
         * @param code The invite code.
         */
        this.getScannerInvite = async (code) => {
            return await this.doGet(`${endpoint}/scanners/invites/${code}`, false);
        };
        /**
         * Begins the scanner exchange.
         *
         * @param code The invite code.
         */
        this.startScannerExchange = async (code) => {
            return await this.doGet(`${endpoint}/scanners/invites/${code}/start`, false);
        };
        /**
         * Accepts an scanner app invite code and returns api keys.
         *
         * @param code The invite code.
         * @param pushToken The push token.
         * @param scannerDeviceInfo The scanner device info.
         */
        this.finishScannerExchange = async (code, pushToken, scannerDeviceInfo) => {
            return await this.doPost(`${endpoint}/scanners/invites`, {
                code,
                pushToken,
                scannerDeviceInfo,
            }, false);
        };
        /**
         * Returns the API keys for the authenticated organization.
         */
        this.getApiKeys = async () => {
            return await this.doGet(`${endpoint}/apiKeys`);
        };
        /**
         * Returns an API key by ID.
         *
         * @param id The ID of the API key.
         */
        this.getApiKey = async (id, scanner = '') => {
            const scannerStr = encodeURIComponent(JSON.stringify(scanner));
            const url = `${endpoint}/apiKeys/${id}?scanner=${scannerStr}`;
            return await this.doGet(url);
        };
        /**
         * Deletes an API key.
         *
         * @param id The ID of the API key.
         */
        this.deleteApiKey = async (id) => {
            return await this.doDelete(`${endpoint}/apiKeys/${id}`);
        };
    }
}
exports.default = OrganizationsEndpoint;
