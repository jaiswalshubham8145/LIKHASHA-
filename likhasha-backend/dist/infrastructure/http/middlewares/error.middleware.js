"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../../../domain/errors");
const logger_config_1 = require("../../../config/logger.config");
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            error: 'VALIDATION_ERROR',
            message: 'Invalid request payload',
            details: err.errors,
        });
        return;
    }
    if (err instanceof errors_1.AppError) {
        if (!err.isOperational) {
            logger_config_1.logger.error('Non-operational error', { err });
        }
        else {
            logger_config_1.logger.warn(`Operational error: ${err.message}`, { code: err.code });
        }
        res.status(err.statusCode).json({
            success: false,
            error: err.code,
            message: err.message,
        });
        return;
    }
    // Unhandled errors
    logger_config_1.logger.error('Unhandled error', { err, stack: err.stack, path: req.path });
    res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : err.message,
    });
};
exports.errorHandler = errorHandler;
