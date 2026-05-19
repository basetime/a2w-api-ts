"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAuthProvider_1 = __importStar(require("./BaseAuthProvider"));
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
     * @param app The ID of the app requesting authentication.
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
            return `${this.baseUrl}/auth/oauth/code?app=${e(this.app)}&redirectUrl=${e(redirectUrl)}&scope=${e(scopes.join(' '))}&state=${e(state)}`;
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
                    body: JSON.stringify({ app: this.app, code: this.code }),
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
            return (0, BaseAuthProvider_1.parseAuthed)(await resp.json(), '/auth/oauth/token');
        };
    }
}
exports.default = OAuthProvider;
