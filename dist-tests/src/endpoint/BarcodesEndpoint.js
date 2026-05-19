"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoint_1 = __importDefault(require("./Endpoint"));
/**
 * Communicate with the `/barcodes` endpoint.
 *
 * Accessed via `client.barcodes`. The barcode route lives outside `/api/v1`, so this
 * endpoint is constructed with `{ siteRoot: true }` — the inherited `this.do` builds
 * absolute URLs against the requester's current site base URL.
 */
class BarcodesEndpoint extends Endpoint_1.default {
    /**
     * Constructor.
     *
     * @param req The object to use to make requests.
     */
    constructor(req) {
        super(req, '/barcodes', { siteRoot: true });
        /**
         * Renders a barcode and returns the PNG body as a string.
         *
         * The body is returned via `Response.text()` to match the SDK's existing pkpass
         * download convention. Consumers that need the binary buffer should call the URL
         * directly via `client.http.fetch(...)` with a custom `Accept` header.
         *
         * @param input The barcode render input.
         */
        this.render = async (input) => {
            const url = this.qb.create('')
                .addQuery('type', input.type)
                .addQuery('data', input.data);
            if (input.width !== undefined) {
                url.addQuery('width', input.width);
            }
            if (input.height !== undefined) {
                url.addQuery('height', input.height);
            }
            if (input.color !== undefined) {
                url.addQuery('color', input.color);
            }
            if (input.background !== undefined) {
                url.addQuery('background', input.background);
            }
            return await this.do.fetch(url, {
                method: 'GET',
                headers: { Accept: 'image/png' },
            }, false);
        };
    }
}
exports.default = BarcodesEndpoint;
