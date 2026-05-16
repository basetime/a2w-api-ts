"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoopLogger_1 = __importDefault(require("../NoopLogger"));
const constants_1 = require("../constants");
const e = encodeURIComponent;
/**
 * Authenticates with the a2w API using an oauth code.
 */
class OAuthProvider {
    /**
     * Constructor.
     *
     * @param app The ID of the app requesting authentication.
     * @param code The code that was received from the oauth.
     * @param logger The logger to use.
     */
    constructor(app, code = '', logger) {
        this.app = app;
        this.code = code;
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
         * Returns a URL to get an oauth code.
         *
         * @param redirectUrl The URL to redirect to after the oauth code is received.
         * @param scopes The requested scopes.
         * @param state Any value, it will be returned in the redirect.
         */
        this.getCodeUrl = (redirectUrl, scopes, state) => {
            this.logger.debug('OAuth.getCodeUrl', { redirectUrl, scopes, state });
            return `${(0, constants_1.getBaseUrl)()}/auth/oauth/code?app=${e(this.app)}&redirectUrl=${e(redirectUrl)}&scope=${e(scopes.join(' '))}&state=${e(state)}`;
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
                    app: this.app,
                    code: this.code,
                }),
            };
            const baseUrl = (0, constants_1.getBaseUrl)();
            this.logger.debug(`Sending request to ${baseUrl}/auth/oauth/token`);
            this.authed = await fetch(`${baseUrl}/auth/oauth/token`, opts)
                .then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error(`Authentication returned non-ok response: ${resp.status} ${resp.statusText}`);
            })
                .then((json) => {
                if (typeof json !== 'object') {
                    throw new Error('Invalid object from /oauth/token endpoint.');
                }
                if (typeof json.idToken !== 'string') {
                    throw new Error('Invalid idToken from /oauth/token endpoint.');
                }
                if (typeof json.refreshToken !== 'string') {
                    throw new Error('Invalid refreshToken from /oauth/token endpoint.');
                }
                if (typeof json.expiresAt !== 'number') {
                    throw new Error('Invalid expiresAt from /oauth/token endpoint.');
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
exports.default = OAuthProvider;
