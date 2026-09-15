import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { dbRepository } from '../../database/firestore.repository';
import { AppError } from '../../../domain/errors';
import { env } from '../../../config/env.config';

export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  // Support both /user/me and /user/:uid
  const uid = req.params.uid === 'me' || !req.params.uid
    ? req.user!.uid
    : req.params.uid;

  // Users can only fetch their own profile
  if (uid !== req.user!.uid) {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }

  let user = await dbRepository.getUser(uid);

  if (!user) {
    await dbRepository.createUser(uid, {
      email: req.user!.email || '',
      displayName:
        req.user!.displayName ||
        req.user!.email?.split('@')[0] ||
        'User',
    });
    user = await dbRepository.getUser(uid);
  }

  // Auto-downgrade expired premium
  const isPremiumExpired =
    user?.plan === 'premium' &&
    user.premiumExpiry != null &&
    user.premiumExpiry < new Date();

  const effectivePlan = isPremiumExpired ? 'free' : (user?.plan ?? 'free');

  if (isPremiumExpired) {
    // Persist downgrade
    await dbRepository.createUser(uid, { plan: 'free', premiumExpiry: null as any });
  }

  res.status(200).json({
    success: true,
    data: {
      uid,
      displayName: user!.displayName,
      email: user!.email,
      plan: effectivePlan,
      dailyCount: user!.dailyCount,
      dailyLimit: effectivePlan === 'free' ? env.FREE_TIER_DAILY_LIMIT : -1,
      premiumExpiry: user!.premiumExpiry,
      totalGenerations: user!.totalGenerations,
    },
  });
};
