"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("../Endpoint"));
/**
 * Communicate with the `/organization/dataStores*` sub-endpoints.
 *
 * Accessed via `client.organizations.dataStores`. Provides CRUD over data stores that
 * workflows can read from.
 */
class OrganizationDataStoresEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, '/organization');
        /**
         * Returns all data stores for the authenticated organization.
         */
        this.getAll = async () => {
            return await this.do.get('/dataStores');
        };
        /**
         * Returns a single data store by ID.
         *
         * @param id The ID of the data store.
         */
        this.getById = async (id) => {
            return await this.do.get(`/dataStores/${id}`);
        };
        /**
         * Creates a new data store.
         *
         * The backend uses `PUT` for create on this collection (the corresponding `POST` is the
         * update verb), matching the route definitions.
         *
         * @param body The data store to create.
         */
        this.create = async (body) => {
            return await this.do.put('/dataStores', body);
        };
        /**
         * Updates an existing data store.
         *
         * @param id The ID of the data store.
         * @param body The new data store values.
         */
        this.update = async (id, body) => {
            return await this.do.post(`/dataStores/${id}`, body);
        };
        /**
         * Deletes a data store.
         *
         * Returns the remaining data stores for the organization.
         *
         * @param id The ID of the data store to delete.
         */
        this.delete = async (id) => {
            return await this.do.del(`/dataStores/${id}`);
        };
    }
}
exports.default = OrganizationDataStoresEndpoint;
