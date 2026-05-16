"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("../Endpoint"));
/**
 * Communicate with the `/organization/webhooks*` sub-endpoints.
 *
 * Accessed via `client.organizations.webhooks`. Provides CRUD over an organization's
 * webhooks and access to the per-organization delivery log.
 */
class OrganizationWebhooksEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, '/organization');
        /**
         * Returns all webhooks for the authenticated organization.
         */
        this.getAll = async () => {
            return await this.do.get('/webhooks');
        };
        /**
         * Creates a new webhook.
         *
         * @param body The webhook to create.
         */
        this.create = async (body) => {
            return await this.do.post('/webhooks', body);
        };
        /**
         * Updates an existing webhook.
         *
         * @param id The ID of the webhook to update.
         * @param body The new webhook values.
         */
        this.update = async (id, body) => {
            return await this.do.post(`/webhooks/${id}`, body);
        };
        /**
         * Deletes a webhook.
         *
         * @param id The ID of the webhook to delete.
         */
        this.delete = async (id) => {
            return await this.do.del(`/webhooks/${id}`);
        };
        /**
         * Returns the delivery logs for all webhooks owned by the authenticated organization.
         */
        this.getLogs = async () => {
            return await this.do.get('/webhookLogs');
        };
    }
}
exports.default = OrganizationWebhooksEndpoint;
