"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGenerationLimit = void 0;
const firestore_repository_1 = require("../../database/firestore.repository");
const errors_1 = require("../../../domain/errors");
const env_config_1 = require("../../../config/env.config");
const checkGenerationLimit = async (req, res, next) => {
    const uid = req.user.uid;
    const user = await firestore_repository_1.dbRepository.getUser(uid);
    if (!user) {
        await firestore_repository_1.dbRepository.createUser(uid, {
            email: req.user.email || '',
            displayName: req.user.displayName || req.user.email?.split('@')[0] || 'User'
        });
        return next();
    }
    // Check if premium has expired
    const isPremiumExpired = user.plan === 'premium' && user.premiumExpiry && user.premiumExpiry < new Date();
    const effectivePlan = isPremiumExpired ? 'free' : user.plan;
    // Check if daily reset is needed
    const now = new Date();
    if (now >= user.dailyReset) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        await firestore_repository_1.dbRepository.createUser(uid, {
            dailyCount: 0,
            dailyReset: tomorrow,
            plan: effectivePlan,
        });
        user.dailyCount = 0;
    }
    if (effectivePlan === 'free' && user.dailyCount >= env_config_1.env.FREE_TIER_DAILY_LIMIT) {
        return next(new errors_1.AppError('Daily generation limit reached. Upgrade to premium for unlimited access.', 429, 'LIMIT_EXCEEDED'));
    }
    next();
};
exports.checkGenerationLimit = checkGenerationLimit;
