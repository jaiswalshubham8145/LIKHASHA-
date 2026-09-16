"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generate_controller_1 = require("./controllers/generate.controller");
const library_controller_1 = require("./controllers/library.controller");
const user_controller_1 = require("./controllers/user.controller");
const subscribe_controller_1 = require("./controllers/subscribe.controller");
const webhook_controller_1 = require("./controllers/webhook.controller");
const languages_controller_1 = require("./controllers/languages.controller");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const planCheck_middleware_1 = require("./middlewares/planCheck.middleware");
const rateLimiter_middleware_1 = require("./middlewares/rateLimiter.middleware");
const router = (0, express_1.Router)();
// ─── Public routes ───────────────────────────────────────────────────────────
// Root API status
router.get('/', (_req, res) => {
    res.status(200).json({
        status: 'online',
        name: 'Likhasha API',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        endpoints: [
            '/api/languages',
            '/api/generate',
            '/api/library',
            '/api/user/me',
            '/api/subscribe'
        ]
    });
});
router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Static metadata
router.get('/languages', languages_controller_1.getLanguages);
// Razorpay webhook (raw body parsing handled by express.json already since we
// parse the signature from the stringified body; keep as JSON route)
router.post('/webhook/razorpay', webhook_controller_1.handleRazorpayWebhook);
// ─── Protected routes (require Firebase ID token) ────────────────────────────
router.use(auth_middleware_1.requireAuth);
// User profile — supports both /user/me and /user/:uid
router.get('/user/me', user_controller_1.getUserProfile);
router.get('/user/:uid', user_controller_1.getUserProfile);
// Core Generation — rate limited + plan checked
router.post('/generate', rateLimiter_middleware_1.generateLimiter, planCheck_middleware_1.checkGenerationLimit, generate_controller_1.generateContent);
// Library CRUD
router.get('/library', library_controller_1.getLibrary);
router.post('/library/save', library_controller_1.saveGeneration);
router.delete('/library/:id', library_controller_1.deleteGeneration);
// Subscription
router.post('/subscribe', subscribe_controller_1.createSubscription);
// Share (increments share count)
router.post('/share', async (req, res) => {
    const { generationId, platform } = req.body;
    res.status(200).json({
        success: true,
        data: {
            shareUrl: `https://likhasha.com/share/${generationId}`,
            platform,
        },
    });
});
exports.default = router;
