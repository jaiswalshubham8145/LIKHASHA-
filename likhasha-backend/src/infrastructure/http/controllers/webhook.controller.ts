import { Request, Response } from 'express';
import { RazorpayService } from '../../services/razorpay.service';
import { dbRepository } from '../../database/firestore.repository';
import { logger } from '../../../config/logger.config';
import { AppError } from '../../../domain/errors';

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const bodyString = JSON.stringify(req.body);

  if (!signature || !RazorpayService.verifyWebhookSignature(bodyString, signature)) {
    logger.warn('Invalid Razorpay Webhook Signature');
    throw new AppError('Invalid signature', 400, 'INVALID_SIGNATURE');
  }

  const { event, payload } = req.body;

  try {
    const subscription = payload?.subscription?.entity;
    if (!subscription) {
      return res.status(200).send('OK');
    }

    const uid = subscription.notes?.uid;
    if (!uid) {
      logger.warn('Webhook received but missing UID in notes', { subscriptionId: subscription.id });
      return res.status(200).send('OK');
    }

    switch (event) {
      case 'subscription.activated':
      case 'subscription.charged':
        const endDate = new Date(subscription.current_end * 1000);
        await dbRepository.createUser(uid, {
          plan: 'premium',
          premiumExpiry: endDate as any
        });
        logger.info(`Subscription activated/charged for user ${uid}`);
        break;

      case 'subscription.cancelled':
      case 'subscription.expired':
        await dbRepository.createUser(uid, {
          plan: 'free',
          premiumExpiry: null as any
        });
        logger.info(`Subscription cancelled/expired for user ${uid}`);
        break;

      default:
        logger.info(`Unhandled Razorpay event: ${event}`);
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    logger.error('Error processing webhook', { error });
    res.status(500).send('Webhook processing failed');
  }
};
