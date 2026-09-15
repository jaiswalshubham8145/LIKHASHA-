import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { dbRepository } from '../../database/firestore.repository';
import { AppError } from '../../../domain/errors';
import { env } from '../../../config/env.config';

export const checkGenerationLimit = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const uid = req.user!.uid;

  const user = await dbRepository.getUser(uid);
  if (!user) {
    await dbRepository.createUser(uid, {
      email: req.user!.email || '',
      displayName: req.user!.displayName || req.user!.email?.split('@')[0] || 'User'
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

    await dbRepository.createUser(uid, {
      dailyCount: 0,
      dailyReset: tomorrow,
      plan: effectivePlan,
    });
    user.dailyCount = 0;
  }

  if (effectivePlan === 'free' && user.dailyCount >= env.FREE_TIER_DAILY_LIMIT) {
    return next(new AppError('Daily generation limit reached. Upgrade to premium for unlimited access.', 429, 'LIMIT_EXCEEDED'));
  }

  next();
};
