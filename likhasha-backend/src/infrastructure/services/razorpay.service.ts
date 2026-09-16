import Razorpay from 'razorpay';
import { env } from '../../config/env.config';
import { logger } from '../../config/logger.config';
import { AppError } from '../../domain/errors';
import crypto from 'crypto';

let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      throw new AppError('Razorpay credentials are not configured on the server', 503, 'PAYMENT_CONFIG_MISSING');
    }
    razorpayInstance = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

export class RazorpayService {
  static async createSubscription(uid: string): Promise<any> {
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
        razorpayKeyId: env.RAZORPAY_KEY_ID
      };
    } catch (error) {
      logger.error('Razorpay create subscription error', { error });
      throw new AppError('Payment service unavailable', 502, 'PAYMENT_ERROR');
    }
  }

  static verifyWebhookSignature(body: string, signature: string): boolean {
    if (!env.RAZORPAY_WEBHOOK_SECRET) {
      logger.warn('RAZORPAY_WEBHOOK_SECRET is not configured');
      return false;
    }
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  }
}
