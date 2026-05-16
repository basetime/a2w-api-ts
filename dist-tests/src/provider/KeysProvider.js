"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoopLogger_1 = __importDefault(require("../NoopLogger"));
const constants_1 = require("../constants");
/**
 * Authenticates the with the a2w API using an API key and secret.
 *
 * Used to make authentication requests to a2w in order to obtain tokens. The
 * tokens will be used for future requests to the API.
 */
class KeysProvider {
    /**
     * Constructor.
     *
     * @param key The API key.
     * @param secret The API secret.
     * @param logger The logger to use.
     */
    constructor(key, secret, logger) {
        this.key = key;
        this.secret = secret;
        /**
         * @inheritdoc
         */
        this.setLogger = (logger) => {
            this.logger = logger;
        };
        /**
         * @inheritdoc
         */
        this.getAuthed = () => {
            return this.authed;
        };
        /**
         * @inheritdoc
         */
        this.authenticate = async () => {
            if (this.authed && this.authed.expiresAt > Date.now() / 1000) {
                return this.authed.idToken;
            }
            const opts = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: this.key,
                    secret: this.secret,
                }),
            };
            const baseUrl = (0, constants_1.getBaseUrl)();
            this.logger.debug(`Sending request to ${baseUrl}/auth/apiGrant`);
            this.authed = await fetch(`${baseUrl}/auth/apiGrant`, opts)
                .then(async (resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error(`Authentication returned non-ok response: ${resp.status} ${resp.statusText}`);
            })
                .then((json) => {
                if (typeof json !== 'object') {
                    throw new Error('Invalid object from /auth/apiGrant endpoint.');
                }
                if (typeof json.idToken !== 'string') {
                    throw new Error('Invalid idToken from /auth/apiGrant endpoint.');
                }
                if (typeof json.refreshToken !== 'string') {
                    throw new Error('Invalid refreshToken from /auth/apiGrant endpoint.');
                }
                if (typeof json.expiresAt !== 'number') {
                    throw new Error('Invalid expiresAt from /auth/apiGrant endpoint.');
                }
                return json;
            })
                .catch((err) => {
                throw new Error(`Failed to authenticate: ${err.toString()}`);
            });
            return this.authed.idToken;
        };
        this.logger = logger || new NoopLogger_1.default();
    }
}
exports.default = KeysProvider;
