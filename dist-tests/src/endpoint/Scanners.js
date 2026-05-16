"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * The scanners endpoint.
 */
const endpoint = '/scanners';
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
        super(req, endpoint);
        /**
         * Returns the scanner app by registration code.
         *
         * @param registrationCode The registration code of the scanner app.
         * @returns The scanner app.
         */
        this.getByRegistrationCode = async (registrationCode) => {
            return await this.doGet(`${endpoint}/registrationCode/${registrationCode}`, false);
        };
        /**
         * Registers a new scanner device.
         *
         * @param scannerApp The scanner app being registered.
         * @param pushToken The push token to send notifications to the device.
         * @param deviceInfo The device info.
         */
        this.registerDevice = async (scannerApp, pushToken, deviceInfo) => {
            return await this.doPost(`${endpoint}/register/${scannerApp.id}`, { deviceInfo, pushToken }, false);
        };
        /**
         * Deregisters a scanner device.
         *
         * @param apiKey The API received when registering the device.
         */
        this.deregisterDevice = async (apiKey) => {
            return await this.doDelete(`${endpoint}/deregister/${apiKey.id}`);
        };
        /**
         * Returns all the scanner apps for the authenticated organization.
         */
        this.getAll = async () => {
            return await this.doGet(`${endpoint}/organizations/apps`);
        };
        /**
         * Returns the scanner app with the given ID.
         *
         * @param id The ID of the scanner app.
         */
        this.getById = async (id) => {
            return await this.doGet(`${endpoint}/organizations/${id}`);
        };
        /**
         * Creates a new scanner app.
         *
         * @param app The scanner app to create.
         */
        this.createApp = async (app) => {
            return await this.doPost(`${endpoint}/organizations/apps`, app);
        };
        /**
         * Updates a scanner app.
         *
         * @param id The ID of the scanner app.
         * @param app The scanner app to update.
         */
        this.updateApp = async (id, app) => {
            return await this.doPost(`${endpoint}/organizations/${id}`, app);
        };
        /**
         * Deletes a scanner app.
         *
         * @param id The ID of the scanner app.
         */
        this.deleteApp = async (id) => {
            return await this.doDelete(`${endpoint}/organizations/apps/${id}`);
        };
    }
}
exports.default = ScannersEndpoint;
