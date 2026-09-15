import { Request, Response, NextFunction } from 'express';
import { auth } from '../../../config/firebase.config';
import { UnauthorizedError } from '../../../domain/errors';
import { logger } from '../../../config/logger.config';

export interface AuthenticatedRequest extends Request {
  id?: string;
  user?: {
    uid: string;
    email?: string;
    displayName?: string;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid token');
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
    };

    next();
  } catch (error) {
    logger.warn('Auth failed', { error });
    next(new UnauthorizedError('Invalid authentication token'));
  }
};
