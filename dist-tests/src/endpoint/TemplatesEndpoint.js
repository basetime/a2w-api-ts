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
        /**
         * Deletes a template.
         *
         * @param id The ID of the template to delete.
         */
        this.delete = async (id) => {
            return await this.do.del(`/${id}`);
        };
        /**
         * Clones a template and returns the new template.
         *
         * @param id The ID of the template to clone.
         */
        this.clone = async (id) => {
            return await this.do.post(`/${id}/clone`, {});
        };
        /**
         * Exports a template as a JSON bundle suitable for re-importing into another
         * organization.
         *
         * Returns the parsed JSON object as returned by the backend.
         *
         * @param id The ID of the template to export.
         */
        this.export = async (id) => {
            return await this.do.get(`/${id}/export`);
        };
        /**
         * Imports a template from a JSON bundle previously produced by {@link export}.
         *
         * Sends a `multipart/form-data` POST. The `Content-Type` header is left unset so the
         * runtime can attach the correct multipart boundary automatically.
         *
         * @param file The file to upload. Pass a `Blob`/`File`, or `{ name, content }` to build
         *   one from a string.
         */
        this.import = async (file) => {
            const form = new FormData();
            if (file instanceof Blob) {
                const filename = file instanceof File ? file.name : 'template.json';
                form.append('file', file, filename);
            }
            else {
                const filename = file.name || 'template.json';
                form.append('file', new Blob([file.content], { type: 'application/json' }), filename);
            }
            return await this.do.fetch('/import', {
                method: 'POST',
                body: form,
            });
        };
    }
}
exports.default = TemplatesEndpoint;
