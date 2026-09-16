"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscription = void 0;
const razorpay_service_1 = require("../../services/razorpay.service");
const createSubscription = async (req, res) => {
    const uid = req.user.uid;
    const subscriptionData = await razorpay_service_1.RazorpayService.createSubscription(uid);
    res.status(200).json({
        success: true,
        data: subscriptionData
    });
};
exports.createSubscription = createSubscription;
