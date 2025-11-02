import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";
import Auction from "../models/Auction.js";
import Inventory from '../models/Inventory.js'
import Cart from '../models/Cart.js'
import { createNotification } from "../controllers/auctionNotificationController.js"
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
        //console.log("Parsed event:", JSON.stringify(event, null, 2));
        const eventId = event.data?.id;
        const type = event.data?.attributes?.type;
        const paymentData = event.data?.attributes?.data || {};
        //console.log('✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅')
        //console.log('✅✅✅✅✅✅PAYMENT DATA✅✅✅✅✅✅✅', paymentData)
        const paymongoId = paymentData.id;
        
        // Payment Attribute
        const paymentAttr = paymentData.attributes || {};
        //console.log('✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅')
        //console.log('✅✅✅✅✅✅PAYMENT ATTRIBUTES✅✅✅✅✅✅✅', paymentAttr)
        const checkoutSessionId = paymentAttr.metadata?.checkoutSessionId;
        const checkoutOrderId = paymentAttr.metadata?.orderId;
        const paymentMethod = paymentAttr.source?.type;
    
        // Payment Intent
        const lineItems = paymentAttr?.line_items
        const amount = lineItems?.[0]?.amount || 0;
        const currency = lineItems?.[0]?.currency || 'PHP';
        //console.log(lineItems)
        //console.log('AMOUNT', amount)
        //console.log('THIS IS THE AMOUNT FROM LINE ITEMS', lineItems?.[0].amount)
        //console.log('THIS IS THE CURRENCY FROM LINE ITEMS', lineItems?.[0].currency)

        if (!paymongoId) {
            console.log("❌ No paymongoId found");
            return res.status(400).send("invalid webhook");
        }

        // Try to find by paymongoId first
        let payment = await Payment.findOne({ paymongoId }).populate('orderId', 'userId auctionId orderType paymentMethod isActive finalPrice paymentStatus purchaseStatus orderId');
        //console.log("✅✅✅ paymongo Id is: ", paymongoId);

        // Fallback: use checkoutSessionId from metadata
        if (!payment && checkoutSessionId) {
            payment = await Payment.findOne({ checkoutSessionId }).populate('orderId', 'userId auctionId orderType paymentMethod isActive finalPrice paymentStatus purchaseStatus orderId');
            if (payment) {
                payment.paymongoId = paymongoId; // link PayMongo ID
                await payment.save();
            }
        }

        // If  not found
        if (!payment) {
            console.log("❌ Payment not found for webhook", {checkoutSessionId, paymongoId});
            return res.status(400).send('Payment not found')
        } 
        
        // Skip duplicate events
        if (payment.eventIds.includes(eventId)) {
            console.log("Duplicate event, skipping");
            return res.status(200).send("already processed");
        }

        // Update existing payment
        payment.status = mapEventTypeToStatus(type);
        payment.amount = amount;
        payment.currency = currency;
        payment.eventIds.push(eventId);
        await payment.save();


        const orderId = checkoutOrderId || payment.orderId
        const auction = await Auction.findById(payment?.orderId?.auctionId)
            .populate({
                path: "inventoryId", 
                select: "productName price isLocal category status description details condition images",
                populate: {
                    path: 'category',
                    select: 'name',
                }
            })

        console.log('AUCTION ITEM via webhook:', auction )
        console.log('PAYMENT ORDER ID ITEM via webhook:', payment.orderId.auctionId )
        console.log('PAYMENT via webhook:', payment )


        // Update products if payment is paid
        if (payment.status === "paid" && (checkoutOrderId || payment.orderId)) { // replaced: payment.status === "paid" && Array.isArray(payment.productIds) && payment.productIds.length
            console.log("Updating products:", payment.productIds);



            // Update ORDER Collection
            const order = await Order.findById(checkoutOrderId)
            if (order) {
                order.paymentStatus = 'paid';
                order.purchaseStatus = 'confirmed';
                order.checkoutSessionId = checkoutSessionId
                order.paymentId = payment._id;
                order.paymentMethod = paymentMethod //|| 'gcash'
                order.transactionReference = paymongoId
                order.isActive = true
                await order.save();
                console.log('order updated via webhook:', order )
            }
            else {
                console.log('Order not found for order ID:', orderId)
            }



            // Check if auction ID is available: if not proceed to normal payment, SKIP if no auction
            if (payment?.orderId?.auctionId || payment?.orderId?.orderType === 'auction') {
                console.log('Auction Transactin RUNNING.')
                const auctionId = payment?.orderId?.auctionId
                const userId = payment?.orderId?.userId

                if (!auctionId || !userId) {
                    console.log('No auction or user ID found.')
                }
                else {
                    await Auction.findByIdAndUpdate(
                        auctionId,
                        { 
                            $set: {
                                    claimedBy: userId,
                                    claimAt: new Date(), 
                                    winnerClaimed: true, 
                                    claimDeadline: new Date(),
                                    status: 'CLAIMED',
                                    claimStage: 5,
                            }
                        }
                    )
                
                    await createNotification(userId, auctionId, 
                        `Your order for ${auctionName} is successful. You can now check your order in "My Purchase".`, 
                        'Order Success!'
                    );

                    if (!auction.inventoryId) {
                        console.log('No inventory IDs found for these products')
                        return res.status(404).json({error: 'No inventory IDs found'})
                    }
                    await Inventory.findByIdAndUpdate(
                        auction.inventoryId?._id,
                        {$set: {status: 'sold'}},
                        console.log('Auction MARKED as SOLD')
                    )
                }
                console.log(`Auction ${auctionId} updated for winner ${userId}`);
            }
            else {
                console.log('Normal Transactin RUNNING.')
                await Product.updateMany(
                    { _id: { $in: payment?.productIds } },
                    { $set: { visibility: 'sold', purchaseStatus: "sold" } }
                );

                const prod = await Product.find({_id: {$in: payment?.productIds}})
                if (!prod.length) {
                    console.log('No Products found for payment')
                    return res.status(404).json({error: 'No products found'})
                }

                const inventoryIds = prod.map(p => p.inventoryId)
                if (!inventoryIds.length) {
                    console.log('No inventory IDs found for these products')
                    return res.status(404).json({error: 'No inventory IDs found'})
                }
                await Inventory.updateMany(
                    {_id: {$in: inventoryIds}},
                    {$set: {status: 'sold'}},
                )

                const userCart = await Cart.findOne({ userId: order.userId });
                if (userCart) {
                    userCart.items = userCart.items.filter(
                        cartItemId => !payment?.productIds.some(pid => pid.equals(cartItemId.productId))
                    );
                    await userCart.save();
                }

                req.io.emit('productSold', prod)
            }
        } 
        else if (['failed', 'cancelled'].includes(payment?.status)) {
            const auctionName = auction?.inventoryId?.productName || 'the item';
            if (payment?.orderId?.auctionId || payment?.orderId?.orderType === 'auction') 
                await createNotification(payment?.orderId?.userId, payment?.orderId?.auctionId, 
                    `Something went wrong during transaction with ${auctionName}, please try again later.`, 
                    'Order Transaction Failed'
                );

            const order = await Order.findById(orderId)
            if (order) {
                order.paymentStatus = payment?.status;
                order.purchaseStatus = 'cancelled';
                order.isActive = false;
                await order.save()
                console.log(`Order ${orderId} marked as ${payment?.status}`)
            }
        }

        res.status(200).send("ok");
    } catch (err) {
        console.error("Webhook error:", err.message || err);
        res.status(500).send("error");
    }
};
