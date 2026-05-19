"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAuthed = exports.TOKEN_SKEW_SECONDS = void 0;
const constants_1 = require("../constants");
const NoopLogger_1 = __importDefault(require("../NoopLogger"));
const Authed_1 = require("../types/Authed");
/**
 * Seconds of clock-skew margin applied to cached token expiry.
 *
 * A cached `Authed` is treated as expired this many seconds before its real
 * `expiresAt`, so we trigger a refresh before the token actually expires mid-request.
 */
exports.TOKEN_SKEW_SECONDS = 30;
/**
 * Abstract base class shared by every {@link AuthProvider} implementation in the SDK.
 *
 * Centralises three concerns that every provider needs and that are easy to get wrong:
 *
 * 1. **In-flight dedup.** When many parallel requests arrive without a cached token,
 *    only one network round-trip fires; the rest await the same promise.
 * 2. **Clock-skew margin.** Cached tokens are considered expired
 *    {@link TOKEN_SKEW_SECONDS} seconds early so we never send a doomed request.
 * 3. **Real refresh-token support.** `refresh()` exchanges the cached refresh token at
 *    `/auth/apiRefresh` and falls back to a fresh grant on failure.
 *
 * Subclasses only have to implement {@link fetchAuthed}, which performs the
 * provider-specific initial grant (key/secret, oauth code, ...).
 */
class BaseAuthProvider {
    /**
     * Constructor.
     *
     * @param logger The logger to use.
     * @param baseUrl The API base URL to send auth requests to.
     */
    constructor(logger, baseUrl = constants_1.DEFAULT_BASE_URL) {
        /**
         * @inheritdoc
         */
        this.setLogger = (logger) => {
            this.logger = logger;
        };
        /**
         * @inheritdoc
         */
        this.setBaseUrl = (baseUrl) => {
            this.baseUrl = baseUrl;
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
            if (this.isTokenFresh()) {
                return this.authed.idToken;
            }
            if (this.pendingAuth) {
                const cached = await this.pendingAuth;
                return cached.idToken;
            }
            this.pendingAuth = this.fetchAuthed()
                .then((authed) => {
                this.authed = authed;
                return authed;
            })
                .finally(() => {
                this.pendingAuth = undefined;
            });
            const authed = await this.pendingAuth;
            return authed.idToken;
        };
        /**
         * @inheritdoc
         */
        this.refresh = async () => {
            if (this.pendingRefresh) {
                const cached = await this.pendingRefresh;
                return cached.idToken;
            }
            const refreshToken = this.authed?.refreshToken;
            if (!refreshToken) {
                return this.authenticate();
            }
            this.pendingRefresh = this.exchangeRefreshToken(refreshToken)
                .then((authed) => {
                this.authed = authed;
                return authed;
            })
                .catch(async (err) => {
                this.logger.debug(`Refresh failed, falling back to full grant: ${err}`);
                const grantToken = await this.authenticate();
                return { idToken: grantToken, refreshToken, expiresAt: this.authed?.expiresAt ?? 0 };
            })
                .finally(() => {
                this.pendingRefresh = undefined;
            });
            const authed = await this.pendingRefresh;
            return authed.idToken;
        };
        /**
         * Returns whether the cached `Authed` is still usable.
         *
         * A token is considered fresh when it exists and its `expiresAt` is more than
         * {@link TOKEN_SKEW_SECONDS} seconds in the future.
         */
        this.isTokenFresh = () => {
            if (!this.authed) {
                return false;
            }
            const now = Date.now() / 1000;
            return this.authed.expiresAt > now + exports.TOKEN_SKEW_SECONDS;
        };
        /**
         * Exchanges a refresh token at `/auth/apiRefresh` for a fresh `Authed`.
         *
         * @param refreshToken The cached refresh token.
         */
        this.exchangeRefreshToken = async (refreshToken) => {
            const url = `${this.baseUrl}/auth/apiRefresh`;
            this.logger.debug(`Refreshing token at ${url}`);
            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });
            if (!resp.ok) {
                throw new Error(`Refresh returned non-ok response: ${resp.status} ${resp.statusText}`);
            }
            return (0, exports.parseAuthed)(await resp.json(), '/auth/apiRefresh');
        };
        this.logger = logger || new NoopLogger_1.default();
        this.baseUrl = baseUrl;
    }
}
exports.default = BaseAuthProvider;
/**
 * Parses an auth response into an `Authed`, throwing a descriptive error on failure.
 *
 * Used by both {@link BaseAuthProvider.exchangeRefreshToken} and subclass
 * `fetchAuthed()` implementations to avoid duplicating the hand-rolled shape check.
 *
 * @param raw The raw response body.
 * @param endpoint The endpoint path (used in error messages).
 */
const parseAuthed = (raw, endpoint) => {
    const parsed = Authed_1.AuthedSchema.safeParse(raw);
    if (!parsed.success) {
        throw new Error(`Invalid response from ${endpoint} endpoint: ${parsed.error.message}`);
    }
    return parsed.data;
};
exports.parseAuthed = parseAuthed;
