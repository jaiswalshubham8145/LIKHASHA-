"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_config_1 = require("./config/env.config");
const logger_config_1 = require("./config/logger.config");
const PORT = env_config_1.env.PORT || 8080;
const server = app_1.default.listen(PORT, () => {
    logger_config_1.logger.info(`🚀 Server running on port ${PORT} in ${env_config_1.env.NODE_ENV} mode`);
});
// Graceful Shutdown
const gracefulShutdown = () => {
    logger_config_1.logger.info('Received shutdown signal. Closing HTTP server...');
    server.close(() => {
        logger_config_1.logger.info('HTTP server closed.');
        process.exit(0);
    });
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('uncaughtException', (error) => {
    logger_config_1.logger.error('Uncaught Exception:', { error, stack: error.stack });
    gracefulShutdown();
});
process.on('unhandledRejection', (reason, promise) => {
    logger_config_1.logger.error('Unhandled Rejection at:', { promise, reason });
    gracefulShutdown();
});
