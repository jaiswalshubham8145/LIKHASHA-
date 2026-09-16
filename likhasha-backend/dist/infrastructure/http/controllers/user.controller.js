"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = void 0;
const firestore_repository_1 = require("../../database/firestore.repository");
const errors_1 = require("../../../domain/errors");
const env_config_1 = require("../../../config/env.config");
const getUserProfile = async (req, res) => {
    // Support both /user/me and /user/:uid
    const uid = req.params.uid === 'me' || !req.params.uid
        ? req.user.uid
        : req.params.uid;
    // Users can only fetch their own profile
    if (uid !== req.user.uid) {
        throw new errors_1.AppError('Forbidden', 403, 'FORBIDDEN');
    }
    let user = await firestore_repository_1.dbRepository.getUser(uid);
    if (!user) {
        await firestore_repository_1.dbRepository.createUser(uid, {
            email: req.user.email || '',
            displayName: req.user.displayName ||
                req.user.email?.split('@')[0] ||
                'User',
        });
        user = await firestore_repository_1.dbRepository.getUser(uid);
    }
    // Auto-downgrade expired premium
    const isPremiumExpired = user?.plan === 'premium' &&
        user.premiumExpiry != null &&
        user.premiumExpiry < new Date();
    const effectivePlan = isPremiumExpired ? 'free' : (user?.plan ?? 'free');
    if (isPremiumExpired) {
        // Persist downgrade
        await firestore_repository_1.dbRepository.createUser(uid, { plan: 'free', premiumExpiry: null });
    }
    res.status(200).json({
        success: true,
        data: {
            uid,
            displayName: user.displayName,
            email: user.email,
            plan: effectivePlan,
            dailyCount: user.dailyCount,
            dailyLimit: effectivePlan === 'free' ? env_config_1.env.FREE_TIER_DAILY_LIMIT : -1,
            premiumExpiry: user.premiumExpiry,
            totalGenerations: user.totalGenerations,
        },
    });
};
exports.getUserProfile = getUserProfile;
