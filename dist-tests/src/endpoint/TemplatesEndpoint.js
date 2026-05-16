"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * Communicate with the templates endpoints.
 */
class TemplatesEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, '/templates');
        /**
         * Returns a template by ID.
         *
         * @param id The ID of the template.
         */
        this.getById = async (id) => {
            return await this.do.get(`/simple/${id}`);
        };
        /**
         * Returns all of the templates for authenticated organization.
         *
         * @returns The templates.
         */
        this.getAll = async () => {
            return await this.do.get('/organization');
        };
        /**
         * Returns all of the templates for a specific tag.
         *
         * @param tag The tag.
         * @returns The templates.
         */
        this.getByTag = async (tag) => {
            return await this.do.get(`/tagged/${tag}`);
        };
    }
}
exports.default = TemplatesEndpoint;
