"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const firebase_config_1 = require("../../../config/firebase.config");
const errors_1 = require("../../../domain/errors");
const logger_config_1 = require("../../../config/logger.config");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new errors_1.UnauthorizedError('Missing or invalid token');
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await firebase_config_1.auth.verifyIdToken(token);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            displayName: decodedToken.name,
        };
        next();
    }
    catch (error) {
        logger_config_1.logger.warn('Auth failed', { error });
        next(new errors_1.UnauthorizedError('Invalid authentication token'));
    }
};
exports.requireAuth = requireAuth;
