import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";
import mongoose from 'mongoose';

// modified

const mapEventTypeToStatus = (type) => {
    switch (type) {
        case "payment.paid": return "paid";
        case "payment.failed": return "failed";
        case "payment.pending": return "pending";
        case "payment.cancelled": return "cancelled";
        default: return "pending";
    }
};

export const handleWebhook = async (req, res) => {
    try {
        const event = req.body;
        console.log("Parsed event:", JSON.stringify(event, null, 2));

        const eventId = event.data?.id;
        const type = event.data?.attributes?.type;
        const paymentData = event.data?.attributes?.data || {};
        const paymongoId = paymentData.id;
        const paymentAttr = paymentData.attributes || {};
        const amount = paymentAttr.amount;
        const currency = paymentAttr.currency;
        const checkoutSessionId = paymentAttr.metadata?.checkoutSessionId;

        if (!paymongoId) {
            console.log("❌ No paymongoId found");
            return res.status(400).send("invalid webhook");
        }

        // Try to find by paymongoId first
        let payment = await Payment.findOne({ paymongoId });
        console.log("✅✅✅ paymongo Id is: ", paymongoId);

        // Fallback: use checkoutSessionId from metadata
        if (!payment && checkoutSessionId) {
            payment = await Payment.findOne({ checkoutSessionId });
            if (payment) {
                payment.paymongoId = paymongoId; // link PayMongo ID
                await payment.save();
            }
        }

        // If  not found, create fallback payment
        if (!payment) {
            console.log("❌ Payment not found for webhook", {checkoutSessionId, paymongoId});
            return res.status(400).send('Payment not found')
    
            {/* // fallback if no payment was found
            payment = await Payment.create({
                paymongoId,
                paymongoEventIds: [],
                amount,
                currency: currency || "PHP",
                status: mapEventTypeToStatus(type),
                eventIds: [eventId],
                productIds: [], // never reach here if metadata is used
                orderId,
                rawPayload: paymentData,
            });
            console.log("✅ Payment record created:", payment._id);
            */}
        } 
        
        // Skip duplicate events
        if (payment.eventIds.includes(eventId)) {
            console.log("Duplicate event, skipping");
            return res.status(200).send("already processed");
        }

        // skip if already paid/cancelled/failed
        if (['paid', 'cancelled', 'failed'].includes(payment.status)) {
            console.log(`Payment already ${payment.status}, skipping further events.`)
            return res.status(200).send(`payment already ${payment.status}`)
        }

        // only update if amount and currency exist
        if (amount == null || !currency) {
            console.log('Missing amount or currency, skipping update')
            return res.status(200).send('missing amount/currency')
        }

        // Update existing payment
        payment.status = mapEventTypeToStatus(type);
        payment.amount = amount;
        payment.currency = currency;
        payment.eventIds.push(eventId);
        await payment.save();
    

        // Update products if payment is paid
        if (payment.status === "paid" && Array.isArray(payment.productIds) && payment.productIds.length) {
            console.log("Updating products:", payment.productIds);
            const result = await Product.updateMany(
                { _id: { $in: payment.productIds } },
                { $set: { visibility: 'pending', purchaseStatus: "pending" } }
            );
            console.log("Update result: ", result);

            if (payment.orderId) {
                console.log('! This is the payment.orderId: ', payment.orderId)
                const order = await Order.findOne(payment.orderId) 
                console.log('! This is the found orderId: ', order)


                if (order) {
                    console.log('! This is the BEFORE update: ', order.paymentStatus)
                    order.paymentStatus = 'paid'
                    console.log('! This is the AFTER update: ', order.paymentStatus)

                    await order.save()
                    console.log('Order updated to paid:', order._id)
                }
            }
        } 
        else if (!payment.productIds || payment.productIds.length === 0) {
            console.log("No products to update for this payment.");
        }

        res.status(200).send("ok");
    } catch (err) {
        console.error("Webhook error:", err.message || err);
        res.status(500).send("error");
    }
};
