"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const DataStore_1 = require("../../types/DataStore");
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
     * @param parent The parent `OrganizationsEndpoint` whose `req`, `do`, and `qb` are
     *   reused.
     */
    constructor(parent) {
        super(parent);
        /**
         * Returns all data stores for the authenticated organization.
         */
        this.getAll = async () => {
            return await this.do.get('/dataStores', zod_1.z.array(DataStore_1.DataStoreSchema));
        };
        /**
         * Returns a single data store by ID.
         *
         * @param id The ID of the data store.
         */
        this.getById = async (id) => {
            return await this.do.get(`/dataStores/${id}`, DataStore_1.DataStoreSchema);
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
            return await this.do.put('/dataStores', body, DataStore_1.DataStoreSchema);
        };
        /**
         * Updates an existing data store.
         *
         * @param id The ID of the data store.
         * @param body The new data store values.
         */
        this.update = async (id, body) => {
            return await this.do.post(`/dataStores/${id}`, body, DataStore_1.DataStoreSchema);
        };
        /**
         * Deletes a data store.
         *
         * Returns the remaining data stores for the organization.
         *
         * @param id The ID of the data store to delete.
         */
        this.delete = async (id) => {
            return await this.do.del(`/dataStores/${id}`, zod_1.z.array(DataStore_1.DataStoreSchema));
        };
    }
}
exports.default = OrganizationDataStoresEndpoint;
