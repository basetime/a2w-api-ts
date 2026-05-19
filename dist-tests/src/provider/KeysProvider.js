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
/**
 * Authenticates with the a2w API using an API key and secret.
 *
 * Posts the supplied key/secret pair to `/auth/apiGrant` to obtain an `Authed`. The
 * shared {@link BaseAuthProvider} machinery handles caching, in-flight dedup,
 * clock-skew margin, and refresh-token exchange.
 */
class KeysProvider extends BaseAuthProvider_1.default {
    /**
     * Constructor.
     *
     * @param key The API key.
     * @param secret The API secret.
     * @param logger The logger to use.
     * @param baseUrl The API base URL to send the grant request to.
     */
    constructor(key, secret, logger, baseUrl) {
        super(logger, baseUrl);
        this.key = key;
        this.secret = secret;
        /**
         * @inheritdoc
         */
        this.fetchAuthed = async () => {
            const url = `${this.baseUrl}/auth/apiGrant`;
            this.logger.debug(`Sending request to ${url}`);
            let resp;
            try {
                resp = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ key: this.key, secret: this.secret }),
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
            return (0, BaseAuthProvider_1.parseAuthed)(await resp.json(), '/auth/apiGrant');
        };
    }
}
exports.default = KeysProvider;
