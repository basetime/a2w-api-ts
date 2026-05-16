"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A logger that does nothing.
 */
class NoopLogger {
    /**
     * @inheritDoc
     */
    debug(message, meta) {
        // Do nothing
    }
    /**
     * @inheritDoc
     */
    info(message, meta) {
        // Do nothing
    }
    /**
     * @inheritDoc
     */
    error(message, meta) {
        // Do nothing
    }
}
exports.default = NoopLogger;
