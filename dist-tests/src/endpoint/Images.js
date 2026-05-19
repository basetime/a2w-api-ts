"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const Image_1 = require("../types/Image");
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * Communicate with the images endpoints.
 */
class ImagesEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, '/images');
        /**
         * Returns the image with the given ID.
         *
         * @param id The ID of the image.
         */
        this.getById = async (id) => {
            return await this.do.get(`/${id}`, Image_1.ImageSchema.nullable());
        };
        /**
         * Returns the images with the given IDs.
         *
         * @param ids The IDs of the images.
         */
        this.getByIds = async (ids) => {
            const url = this.qb.create('/ids').addQuery('ids', ids.join(','));
            return await this.do.get(url, zod_1.z.array(Image_1.ImageSchema));
        };
    }
}
exports.default = ImagesEndpoint;
