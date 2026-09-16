"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('8080'),
    // Firebase
    FIREBASE_PROJECT_ID: zod_1.z.string().default(''),
    FIREBASE_PRIVATE_KEY: zod_1.z.string().default(''),
    FIREBASE_CLIENT_EMAIL: zod_1.z.string().default(''),
    // Google Gemini API
    GOOGLE_API_KEY: zod_1.z.string().default(''),
    // Razorpay
    RAZORPAY_KEY_ID: zod_1.z.string().default(''),
    RAZORPAY_KEY_SECRET: zod_1.z.string().default(''),
    RAZORPAY_WEBHOOK_SECRET: zod_1.z.string().default(''),
    RAZORPAY_PLAN_ID: zod_1.z.string().default(''),
    // Resend
    RESEND_API_KEY: zod_1.z.string().optional().default(''),
    // App constraints
    FREE_TIER_DAILY_LIMIT: zod_1.z.coerce.number().default(5),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.warn('⚠️ Environment variable parsing warnings:', _env.error.format());
}
exports.env = _env.success ? _env.data : envSchema.parse(process.env || {});
