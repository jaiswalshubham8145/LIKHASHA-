import rateLimit from 'express-rate-limit';

// Global Rate Limiting (100 requests per 15 minutes)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

// Stricter rate limit for AI generation endpoint (10 requests per minute)
export const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many generation requests. Please wait a moment.' },
});
