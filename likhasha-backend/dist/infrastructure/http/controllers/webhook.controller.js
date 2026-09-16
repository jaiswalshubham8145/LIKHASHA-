"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRazorpayWebhook = void 0;
const razorpay_service_1 = require("../../services/razorpay.service");
const firestore_repository_1 = require("../../database/firestore.repository");
const logger_config_1 = require("../../../config/logger.config");
const errors_1 = require("../../../domain/errors");
const handleRazorpayWebhook = async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    const bodyString = JSON.stringify(req.body);
    if (!signature || !razorpay_service_1.RazorpayService.verifyWebhookSignature(bodyString, signature)) {
        logger_config_1.logger.warn('Invalid Razorpay Webhook Signature');
        throw new errors_1.AppError('Invalid signature', 400, 'INVALID_SIGNATURE');
    }
    const { event, payload } = req.body;
    try {
        const subscription = payload?.subscription?.entity;
        if (!subscription) {
            return res.status(200).send('OK');
        }
        const uid = subscription.notes?.uid;
        if (!uid) {
            logger_config_1.logger.warn('Webhook received but missing UID in notes', { subscriptionId: subscription.id });
            return res.status(200).send('OK');
        }
        switch (event) {
            case 'subscription.activated':
            case 'subscription.charged':
                const endDate = new Date(subscription.current_end * 1000);
                await firestore_repository_1.dbRepository.createUser(uid, {
                    plan: 'premium',
                    premiumExpiry: endDate
                });
                logger_config_1.logger.info(`Subscription activated/charged for user ${uid}`);
                break;
            case 'subscription.cancelled':
            case 'subscription.expired':
                await firestore_repository_1.dbRepository.createUser(uid, {
                    plan: 'free',
                    premiumExpiry: null
                });
                logger_config_1.logger.info(`Subscription cancelled/expired for user ${uid}`);
                break;
            default:
                logger_config_1.logger.info(`Unhandled Razorpay event: ${event}`);
        }
        res.status(200).json({ status: 'ok' });
    }
    catch (error) {
        logger_config_1.logger.error('Error processing webhook', { error });
        res.status(500).send('Webhook processing failed');
    }
};
exports.handleRazorpayWebhook = handleRazorpayWebhook;
