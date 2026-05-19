"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const Exporter_1 = require("../../types/Exporter");
const ExporterLog_1 = require("../../types/ExporterLog");
const Endpoint_1 = __importDefault(require("../Endpoint"));
/**
 * Communicate with the `/organization/exporters*` sub-endpoints.
 *
 * Accessed via `client.organizations.exporters`. CRUD on exporters plus the ability to
 * run an exporter on demand and tail its execution logs.
 */
class OrganizationExportersEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param parent The parent `OrganizationsEndpoint` whose `req`, `do`, and `qb` are
     *   reused.
     */
    constructor(parent) {
        super(parent);
        /**
         * Returns all exporters for the authenticated organization.
         */
        this.getAll = async () => {
            return await this.do.get('/exporters', zod_1.z.array(Exporter_1.ExporterSchema));
        };
        /**
         * Returns a single exporter by ID.
         *
         * @param id The ID of the exporter.
         */
        this.getById = async (id) => {
            return await this.do.get(`/exporters/${id}`, Exporter_1.ExporterSchema);
        };
        /**
         * Creates a new exporter.
         *
         * The backend uses `PUT` for create on this collection (the corresponding `POST` is the
         * update verb), matching the route definitions. Returns the full list of exporters after
         * creation, mirroring the backend response.
         *
         * @param body The exporter to create.
         */
        this.create = async (body) => {
            return await this.do.put('/exporters', body, zod_1.z.array(Exporter_1.ExporterSchema));
        };
        /**
         * Updates an existing exporter.
         *
         * @param id The ID of the exporter.
         * @param body The new exporter values.
         */
        this.update = async (id, body) => {
            return await this.do.post(`/exporters/${id}`, body, Exporter_1.ExporterSchema);
        };
        /**
         * Deletes an exporter.
         *
         * @param id The ID of the exporter to delete.
         */
        this.delete = async (id) => {
            return await this.do.del(`/exporters/${id}`, zod_1.z.string());
        };
        /**
         * Runs an exporter on demand.
         *
         * @param id The ID of the exporter to run.
         */
        this.run = async (id) => {
            return await this.do.post(`/exporters/${id}/run`, {}, zod_1.z.string());
        };
        /**
         * Returns the execution logs for an exporter.
         *
         * @param id The ID of the exporter.
         */
        this.getLogs = async (id) => {
            return await this.do.get(`/exporters/${id}/logs`, zod_1.z.array(ExporterLog_1.ExporterLogSchema));
        };
        /**
         * Returns a single execution log entry for an exporter.
         *
         * @param id The ID of the exporter.
         * @param logId The ID of the log entry.
         */
        this.getLog = async (id, logId) => {
            return await this.do.get(`/exporters/${id}/logs/${logId}`, ExporterLog_1.ExporterLogSchema);
        };
    }
}
exports.default = OrganizationExportersEndpoint;
