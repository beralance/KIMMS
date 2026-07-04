import mongoose from "mongoose";
import { generateOrderId } from "../utils/generateOrderId.js";


const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
                inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: false },
                priceAtPurchase: {type: Number},
            },
        ],
        orderId: {
            type: String,
            default: generateOrderId,
            unique: true,
            required: true,
        },
        auctionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auction',
            default: null,
        },

        orderType: {
            type: String,
            enum: ['fixed', 'auction'],
            required: true,
            default: 'fixed',
        },

        orderStatus: {
            type: String,
            enum: ['PENDING', 'SUCCESSFUL', 'CANCELLED'],
            default: 'PENDING'
        },

        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
            default: null,
        },

        checkoutSessionId: {
            type: String, 
            default: null,
        },
        shippingInfo: {
            address: {type: String},
            contacNumber: {type: String},
            recipientName: {type: String},
            notes: {type: String},
        },
        transactionReference: {type: String, default: null},
        paymentMethod: {
            type: String, 
            enum: ['gcash', 'card', 'cashOnDelivery', 'cashOnPickup'], 
            default: 'gcash'
        },
        expiryDate: {type: Date, default: null},
        isActive: {type: Boolean, default: true},
        totalPrice: { type: Number, required: true, default: 0},
        finalPrice: { type: Number, required: true, default: 0},

        paymentStatus: {
            type: String,
            enum: ["pending", 'unpaid', "paid", "failed", 'refunded'],
            default: "pending",
        },

        purchaseStatus: {
            type: String,
            enum: [
                "pending",          // order placed
                "confirmed",        // confirmed by admin
                "processing",       // preparing for delivery
                "out_for_delivery", // shipped
                "delivered",        // received by customer
                "cancelled",        // cancelled manually
            ],
            default: "pending",
        },
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        // For auction fallback logic
        priorityLevel: {
            type: Number, // 1 = top bidder, 2 = second, etc.
            default: null,
        },

        // admin fallback or manual override
        adminNote: {type: String, default: ''},
        
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
