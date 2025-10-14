import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                priceAtPurchase: {type: Number},
            },
        ],

        // for linking auction based orders
        auctionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auction',
            default: null,
        },

        // identify where the order comes from (auction, fixed)
        orderType: {
            type: String,
            enum: ['fixed', 'auction'],
            required: true,
            default: 'fixed',
        },


        totalPrice: { type: Number, required: true },

        // payment status tracking
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", 'refunded'],
            default: "pending",
        },

        // fulfillment progress
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
