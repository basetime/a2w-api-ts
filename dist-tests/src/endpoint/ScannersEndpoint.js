"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ApiKey_1 = require("../types/ApiKey");
const ScannerApp_1 = require("../types/ScannerApp");
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * Communicate with the scanners endpoints.
 */
class ScannersEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, '/scanners');
        /**
         * Returns the scanner app by registration code.
         *
         * @param registrationCode The registration code of the scanner app.
         * @returns The scanner app.
         */
        this.getByRegistrationCode = async (registrationCode) => {
            return await this.do.get(`/registrationCode/${registrationCode}`, ScannerApp_1.ScannerAppSchema.nullable(), false);
        };
        /**
         * Registers a new scanner device.
         *
         * @param scannerApp The scanner app being registered.
         * @param pushToken The push token to send notifications to the device.
         * @param deviceInfo The device info.
         */
        this.registerDevice = async (scannerApp, pushToken, deviceInfo) => {
            return await this.do.post(`/register/${scannerApp.id}`, { deviceInfo, pushToken }, ApiKey_1.ApiKeySchema.nullable(), false);
        };
        /**
         * Deregisters a scanner device.
         *
         * @param apiKey The API received when registering the device.
         */
        this.deregisterDevice = async (apiKey) => {
            return await this.do.del(`/deregister/${apiKey.id}`);
        };
        /**
         * Returns all the scanner apps for the authenticated organization.
         */
        this.getAll = async () => {
            return await this.do.get('/organizations/apps', zod_1.z.array(ScannerApp_1.ScannerAppSchema));
        };
        /**
         * Returns the scanner app with the given ID.
         *
         * @param id The ID of the scanner app.
         */
        this.getById = async (id) => {
            return await this.do.get(`/organizations/${id}`, ScannerApp_1.ScannerAppSchema.nullable());
        };
        /**
         * Creates a new scanner app.
         *
         * @param app The scanner app to create.
         */
        this.createApp = async (app) => {
            return await this.do.post('/organizations/apps', app, ScannerApp_1.ScannerAppSchema.nullable());
        };
        /**
         * Updates a scanner app.
         *
         * @param id The ID of the scanner app.
         * @param app The scanner app to update.
         */
        this.updateApp = async (id, app) => {
            return await this.do.post(`/organizations/${id}`, app, ScannerApp_1.ScannerAppSchema.nullable());
        };
        /**
         * Deletes a scanner app.
         *
         * @param id The ID of the scanner app.
         */
        this.deleteApp = async (id) => {
            return await this.do.del(`/organizations/apps/${id}`);
        };
    }
}
exports.default = ScannersEndpoint;
