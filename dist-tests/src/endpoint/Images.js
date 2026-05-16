"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * The organizations endpoint.
 */
const endpoint = '/images';
/**
 * Communicate with the images endpoints.
 */
class ImagesEndpoint extends Endpoint_1.default {
    constructor() {
        super(...arguments);
        /**
         * Returns the image with the given ID.
         *
         * @param id The ID of the image.
         */
        this.getById = async (id) => {
            return await this.doGet(`${endpoint}/${id}`);
        };
        /**
         * Returns the images with the given IDs.
         *
         * @param ids The IDs of the images.
         */
        this.getByIds = async (ids) => {
            return await this.doGet(`${endpoint}/ids?ids=${ids.join(',')}`);
        };
    }
}
exports.default = ImagesEndpoint;
