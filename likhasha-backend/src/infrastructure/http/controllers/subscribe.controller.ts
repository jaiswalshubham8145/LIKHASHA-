import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { RazorpayService } from '../../services/razorpay.service';

export const createSubscription = async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.uid;

  const subscriptionData = await RazorpayService.createSubscription(uid);

  res.status(200).json({
    success: true,
    data: subscriptionData
  });
};
