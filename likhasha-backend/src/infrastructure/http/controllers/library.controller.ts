import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { z } from 'zod';
import { dbRepository } from '../../database/firestore.repository';
import { AppError } from '../../../domain/errors';
import { env } from '../../../config/env.config';

// ─── Fetch library ────────────────────────────────────────────────────────────

export const getLibrary = async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.uid;

  const querySchema = z.object({
    type: z.string().optional(),
    language: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
    cursor: z.string().optional(),
  });

  const query = querySchema.parse(req.query);

  const user = await dbRepository.getUser(uid);
  const maxLimit = user?.plan === 'premium' ? 50 : 7;
  const limit = Math.min(query.limit, maxLimit);

  const { generations, nextCursor } = await dbRepository.getGenerations(
    uid,
    { type: query.type, language: query.language },
    limit,
    query.cursor,
  );

  res.status(200).json({
    success: true,
    data: {
      generations,
      nextCursor,
      total: user?.totalGenerations || 0,
    },
  });
};

// ─── Save a generation (explicit "Save" button) ───────────────────────────────

const saveSchema = z.object({
  content: z.string().min(1).max(5000),
  type: z.string().min(1),
  language: z.string().min(1),
  mood: z.string().default('neutral'),
  userInput: z.string().max(500).default(''),
});

export const saveGeneration = async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.uid;
  const parsed = saveSchema.parse(req.body);

  const user = await dbRepository.getUser(uid);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Free users limited to 7 saved verses
  if (user.plan === 'free') {
    const { generations } = await dbRepository.getGenerations(uid, {}, 8);
    if (generations.length >= 7) {
      throw new AppError(
        'Free plan allows up to 7 saved verses. Upgrade to Premium for unlimited storage.',
        403,
        'SAVE_LIMIT_REACHED',
      );
    }
  }

  const generationId = await dbRepository.saveGeneration({
    uid,
    content: parsed.content,
    type: parsed.type,
    language: parsed.language,
    mood: parsed.mood,
    scene: 'AbstractParticlesScene',
    userInput: parsed.userInput,
    wordCount: parsed.content.split(/\s+/).length,
    shared: false,
    shareCount: 0,
    createdAt: new Date(),
  });

  res.status(201).json({
    success: true,
    data: { generationId },
  });
};

// ─── Delete a generation ─────────────────────────────────────────────────────

export const deleteGeneration = async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.uid;
  const { id } = req.params;

  await dbRepository.deleteGeneration(id as string, uid);

  res.status(200).json({
    success: true,
    message: 'Generation deleted.',
  });
};
