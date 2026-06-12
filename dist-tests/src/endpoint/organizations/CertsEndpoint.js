"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const GoogleIssuer_1 = require("../../types/GoogleIssuer");
const PassType_1 = require("../../types/PassType");
const Endpoint_1 = __importDefault(require("../Endpoint"));
/**
 * Communicate with the `/organization/passTypes*` and `/organization/googleIssuers*`
 * sub-endpoints.
 *
 * Accessed via `client.organizations.certs`. Provides access to Apple pass types and
 * Google Wallet issuers, including export of sensitive credentials.
 */
class OrganizationCertsEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param parent The parent `OrganizationsEndpoint` whose `req`, `do`, and `qb` are
     *   reused.
     */
    constructor(parent) {
        super(parent);
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
    }
}
exports.default = OrganizationCertsEndpoint;
