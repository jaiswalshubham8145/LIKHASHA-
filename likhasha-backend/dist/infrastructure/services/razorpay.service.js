"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayService = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const env_config_1 = require("../../config/env.config");
const logger_config_1 = require("../../config/logger.config");
const errors_1 = require("../../domain/errors");
const crypto_1 = __importDefault(require("crypto"));
let razorpayInstance = null;
function getRazorpay() {
    if (!razorpayInstance) {
        if (!env_config_1.env.RAZORPAY_KEY_ID || !env_config_1.env.RAZORPAY_KEY_SECRET) {
            throw new errors_1.AppError('Razorpay credentials are not configured on the server', 503, 'PAYMENT_CONFIG_MISSING');
        }
        razorpayInstance = new razorpay_1.default({
            key_id: env_config_1.env.RAZORPAY_KEY_ID,
            key_secret: env_config_1.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpayInstance;
}
class RazorpayService {
    static async createSubscription(uid) {
        try {
            const razorpay = getRazorpay();
            // In a real app, we would have created a plan beforehand and use its plan_id
            // For this example, assuming a predefined plan ID from config or constant
            const plan_id = process.env.RAZORPAY_PLAN_ID || 'plan_default_99';
            const subscription = await razorpay.subscriptions.create({
                plan_id,
                customer_notify: 1,
                total_count: 120, // 10 years monthly
                notes: {
                    uid
                }
            });
            return {
                subscriptionId: subscription.id,
                amount: 99,
                currency: 'INR',
                razorpayKeyId: env_config_1.env.RAZORPAY_KEY_ID
            };
        }
        catch (error) {
            logger_config_1.logger.error('Razorpay create subscription error', { error });
            throw new errors_1.AppError('Payment service unavailable', 502, 'PAYMENT_ERROR');
        }
    }
    static verifyWebhookSignature(body, signature) {
        if (!env_config_1.env.RAZORPAY_WEBHOOK_SECRET) {
            logger_config_1.logger.warn('RAZORPAY_WEBHOOK_SECRET is not configured');
            return false;
        }
        const expectedSignature = crypto_1.default
            .createHmac('sha256', env_config_1.env.RAZORPAY_WEBHOOK_SECRET)
            .update(body)
            .digest('hex');
        return expectedSignature === signature;
    }
}
exports.RazorpayService = RazorpayService;
