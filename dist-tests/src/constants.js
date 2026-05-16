"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBaseUrl = exports.getBaseUrl = void 0;
/**
 * Base url when explicitly set.
 */
let baseUrl = undefined;
/**
 * Returns the base URL for all requests to the API.
 *
 * @returns The base URL for all requests to the API.
 */
const getBaseUrl = () => {
    if (baseUrl) {
        return baseUrl;
    }
    return 'https://app.addtowallet.io/api/v1';
};
exports.getBaseUrl = getBaseUrl;
/**
 * Sets the base URL for all requests to the API.
 *
 * @param url The base URL for all requests to the API.
 */
const setBaseUrl = (url) => {
    baseUrl = url;
};
exports.setBaseUrl = setBaseUrl;
