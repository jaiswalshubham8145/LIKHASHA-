import { Router } from 'express';
import { generateContent } from './controllers/generate.controller';
import { getLibrary, saveGeneration, deleteGeneration } from './controllers/library.controller';
import { getUserProfile } from './controllers/user.controller';
import { createSubscription } from './controllers/subscribe.controller';
import { handleRazorpayWebhook } from './controllers/webhook.controller';
import { getLanguages } from './controllers/languages.controller';
import { requireAuth } from './middlewares/auth.middleware';
import { checkGenerationLimit } from './middlewares/planCheck.middleware';
import { generateLimiter } from '../../app';

const router = Router();

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
router.get('/languages', getLanguages);


// Razorpay webhook (raw body parsing handled by express.json already since we
// parse the signature from the stringified body; keep as JSON route)
router.post('/webhook/razorpay', handleRazorpayWebhook);

// ─── Protected routes (require Firebase ID token) ────────────────────────────
router.use(requireAuth);

// User profile — supports both /user/me and /user/:uid
router.get('/user/me', getUserProfile);
router.get('/user/:uid', getUserProfile);

// Core Generation — rate limited + plan checked
router.post('/generate', generateLimiter, checkGenerationLimit, generateContent);

// Library CRUD
router.get('/library', getLibrary);
router.post('/library/save', saveGeneration);
router.delete('/library/:id', deleteGeneration);

// Subscription
router.post('/subscribe', createSubscription);

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

export default router;
