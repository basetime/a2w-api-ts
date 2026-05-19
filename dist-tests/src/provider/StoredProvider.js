"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAuthProvider_1 = __importDefault(require("./BaseAuthProvider"));
/**
 * Authenticates with the a2w API using stored id and refresh tokens.
 *
 * Wraps a pre-existing `Authed` value (e.g. one persisted across server restarts).
 * When the cached id token has expired, the shared {@link BaseAuthProvider} machinery
 * will refresh it at `/auth/apiRefresh` using the stored refresh token rather than
 * failing.
 */
class StoredProvider extends BaseAuthProvider_1.default {
    /**
     * Constructor.
     *
     * @param authed The auth credentials.
     * @param logger The logger to use.
     * @param baseUrl The API base URL to send refresh requests to.
     */
    constructor(authed, logger, baseUrl) {
        super(logger, baseUrl);
        /**
         * @inheritdoc
         *
         * `StoredProvider` has no grant flow to run — the only way to obtain a fresh token
         * is via the refresh endpoint. When the cached refresh token is rejected, this
         * surfaces as an error.
         */
        this.fetchAuthed = async () => {
            const refreshToken = this.authed?.refreshToken;
            if (!refreshToken) {
                this.logger.error('StoredProvider: No refresh token available');
                throw new Error('StoredProvider: No refresh token available');
            }
            return this.exchangeRefreshToken(refreshToken);
        };
        this.authed = authed;
    }
}
exports.default = StoredProvider;
