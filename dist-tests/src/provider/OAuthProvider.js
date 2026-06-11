"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Authed_1 = require("../types/Authed");
const BaseAuthProvider_1 = __importDefault(require("./BaseAuthProvider"));
const e = encodeURIComponent;
/**
 * Authenticates with the a2w API using an oauth code.
 *
 * The initial grant exchanges the supplied `code` at `/auth/oauth/token`. The shared
 * {@link BaseAuthProvider} machinery handles caching, in-flight dedup, clock-skew
 * margin, and refresh-token exchange via `/auth/apiRefresh` — so an expired token is
 * refreshed without re-spending the original (one-shot) code.
 */
class OAuthProvider extends BaseAuthProvider_1.default {
    /**
     * Constructor.
     *
     * @param app The OAuth app's client ID.
     * @param code The code that was received from the oauth.
     * @param logger The logger to use.
     * @param baseUrl The API base URL to send the grant request to.
     */
    constructor(app, code = '', logger, baseUrl) {
        super(logger, baseUrl);
        this.app = app;
        this.code = code;
        /**
         * Returns a URL to get an oauth code.
         *
         * @param redirectUrl The URL to redirect to after the oauth code is received.
         * @param scopes The requested scopes.
         * @param state Any value, it will be returned in the redirect.
         */
        this.getCodeUrl = (redirectUrl, scopes, state) => {
            this.logger.debug('OAuth.getCodeUrl', { redirectUrl, scopes, state });
            return `${this.baseUrl}/auth/oauth/code?client_id=${e(this.app)}&redirect_uri=${e(redirectUrl)}&scope=${e(scopes.join(' '))}&state=${e(state)}`;
        };
        /**
         * @inheritdoc
         */
        this.fetchAuthed = async () => {
            const url = `${this.baseUrl}/auth/oauth/token`;
            this.logger.debug(`Sending request to ${url}`);
            let resp;
            try {
                resp = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ client_id: this.app, code: this.code }),
                });
            }
            catch (err) {
                const wrapped = new Error(`Failed to authenticate: ${err.message ?? err}`);
                wrapped.cause = err;
                throw wrapped;
            }
            if (!resp.ok) {
                throw new Error(`Authentication returned non-ok response: ${resp.status} ${resp.statusText}`);
            }
            const parsed = Authed_1.OAuthTokenSchema.safeParse(await resp.json());
            if (!parsed.success) {
                throw new Error(`Invalid response from /auth/oauth/token endpoint: ${parsed.error.message}`);
            }
            const { access_token, refresh_token, expires_at } = parsed.data;
            return {
                idToken: access_token,
                refreshToken: refresh_token,
                expiresAt: expires_at,
            };
        };
    }
}
exports.default = OAuthProvider;
