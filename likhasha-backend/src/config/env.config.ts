import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('8080'),

  // Firebase
  FIREBASE_PROJECT_ID: z.string().default(''),
  FIREBASE_PRIVATE_KEY: z.string().default(''),
  FIREBASE_CLIENT_EMAIL: z.string().default(''),

  // Google Gemini API
  GOOGLE_API_KEY: z.string().default(''),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().default(''),
  RAZORPAY_KEY_SECRET: z.string().default(''),
  RAZORPAY_WEBHOOK_SECRET: z.string().default(''),
  RAZORPAY_PLAN_ID: z.string().default(''),

  // Resend
  RESEND_API_KEY: z.string().optional().default(''),

  // App constraints
  FREE_TIER_DAILY_LIMIT: z.coerce.number().default(5),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.warn('⚠️ Environment variable parsing warnings:', _env.error.format());
}

export const env = _env.success ? _env.data : envSchema.parse(process.env || {});

