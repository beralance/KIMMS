// controllers/paymentController.js
import Payment from "../models/Payment.js";
import Order from '../models/Order.js'
import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const PAYMONGO_SECRET = process.env.PAYMONGO_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const createCheckoutSession = async (req, res) => {
    try {
        const { amount, productIds, orderId } = req.body;

        if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });
        if (!productIds || !Array.isArray(productIds) || !productIds.length)
            return res.status(400).json({ error: "No products selected" });


        const payload = {
            data: {
                attributes: {
                    line_items: [{ name: "Purchase", amount, currency: "PHP", quantity: 1 }],
                    payment_method_types: ["gcash"],
                    success_url: `${FRONTEND_URL}/success?orderId=${orderId}`,
                    cancel_url: `${FRONTEND_URL}/cancel?orderId=${orderId}`,
                    metadata: {
                        checkoutSessionId: "cs_" + new mongoose.Types.ObjectId(),
                        orderId, // <-- store orderId in metadata if needed
                    },
                },
            },
        };

        const auth = Buffer.from(PAYMONGO_SECRET + ":").toString("base64");

        const resp = await axios.post("https://api.paymongo.com/v1/checkout_sessions", payload, {
            headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        });

        const session = resp.data.data;

        await Payment.create({
            checkoutSessionId: payload.data.attributes.metadata.checkoutSessionId,
            paymongoId: "temp_" + new mongoose.Types.ObjectId(),
            paymongoEventIds: [],
            amount,
            currency: "PHP",
            status: "pending",
            productIds,
            orderId, // <-- link payment to the order
            rawPayload: session,
        });
        res.status(200).json({
            checkout_url: session.attributes.checkout_url,
            sessionId: payload.data.attributes.metadata.checkoutSessionId
        });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "Could not create checkout session" });
    }
};



export const cancelPayment = async (req, res) => {
    const { checkoutSessionId } = req.body;

    if (!checkoutSessionId) return res.status(400).json({ error: "No session ID" });
    console.log('The checkout session id is: ', checkoutSessionId)
   
    const cleanedId = checkoutSessionId.replace(/"/g, '').trim();


    try {
        // updates PAYMENT status to cancelled
        const payment = await Payment.findOne({ checkoutSessionId: cleanedId }).populate('order');
        console.log('***** This is the checkoutSessionId found *****: \n',  payment)

        payment.status = "cancelled";
        await payment.save();

        // updates ORDER status to cancelled
        console.log('@ This is the order id:', payment.orderId)
        if (payment.orderId) {
            const order = await Order.findById(payment.orderId)

            console.log('@ This is whats inside ORDER:', order)
            if (order) {
                order.paymentStatus = 'failed';
                console.log('@ PaymentStatus is:', order.paymentStatus)

                order.purchaseStatus = 'cancelled';
                console.log('@ PurchaseStatus is:', order.purchaseStatus)

                order.orderStatus = 'CANCELLED';
                console.log('@ PurchaseStatus is:', order.orderStatus)
                
                await order.save();
            }
        }

        res.status(200).json({ message: "Payment cancelled successfully" });
    }
    catch (err) {
        console.error('Error cancelling payment: ', err)
        res.status(500).json({error: 'Server error'})

    }
};

export const getPaymentStatus = async (req, res) => {
    try {
    const {orderId} = req.params
    if (!orderId) return res.status(400).json({error: 'Order ID is required'})

    const payment = await Payment.findOne({orderId})
    if (!payment) return res.status(404).json({error: 'Payment not found'})


    res.status(200).json({
        orderId: payment.orderId,
        checkoutSessionId: payment.checkoutSessionId,
        paymongoId: payment.paymongoId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        productIds: payment.productIds,
        paidAt: payment.createdAt || null,
    })
    }
    catch (err) {
        console.error(err) 
        res.status(500).json({error: 'Failed to fetch payment status.'})
    }
}