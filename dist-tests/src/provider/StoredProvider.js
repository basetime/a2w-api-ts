"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoopLogger_1 = __importDefault(require("../NoopLogger"));
/**
 * Authenticates the with the a2w API using stored id and refresh tokens.
 */
class StoredProvider {
    /**
     * Constructor.
     *
     * @param authed The auth credentials.
     * @param logger The logger to use.
     */
    constructor(authed, logger) {
        this.authed = authed;
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
            this.logger.error('StoredProvider: No valid authed found');
            throw new Error('StoredProvider: No valid authed found');
        };
        this.logger = logger || new NoopLogger_1.default();
    }
}
exports.default = StoredProvider;
