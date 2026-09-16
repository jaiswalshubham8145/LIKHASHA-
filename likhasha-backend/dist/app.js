"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const uuid_1 = require("uuid");
const error_middleware_1 = require("./infrastructure/http/middlewares/error.middleware");
const env_config_1 = require("./config/env.config");
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        const allowedOrigins = env_config_1.env.NODE_ENV === 'production'
            ? ['https://likhasha.com', 'https://www.likhasha.com', 'https://likhasha.wtf', 'https://www.likhasha.wtf']
            : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000', 'http://localhost:8081'];
        const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
        const isVercel = origin.endsWith('.vercel.app');
        const isAllowed = env_config_1.env.NODE_ENV !== 'production' ? (isLocalhost || isVercel || allowedOrigins.includes(origin)) : (allowedOrigins.includes(origin) || isVercel);
        if (isAllowed) {
            callback(null, true);
        }
        else {
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// Performance Middlewares
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
// Request ID middleware for tracing
app.use((req, _res, next) => {
    req.id = req.headers['x-request-id'] || (0, uuid_1.v4)();
    next();
});
// Logging
if (env_config_1.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('combined'));
}
const rateLimiter_middleware_1 = require("./infrastructure/http/middlewares/rateLimiter.middleware");
app.use('/api', rateLimiter_middleware_1.globalLimiter);
// Root and health checks
app.get('/', (_req, res) => {
    res.status(200).json({
        status: 'online',
        name: 'Likhasha API',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
    });
});
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Mount all API routes under both /api and root to handle any Vercel rewrite configuration
const routes_1 = __importDefault(require("./infrastructure/http/routes"));
app.use('/api', routes_1.default);
app.use('/', routes_1.default);
// Centralized Error Handling
app.use(error_middleware_1.errorHandler);
exports.default = app;
