import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const PaymentSchema = new mongoose.Schema(
    {
        // internal reference to the order/cart
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: false, // set to ture when order backend
        },

        productIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],

        checkoutSessionId: {
            type: String,
            required: false,
            unique: true
        },
        // PayMongo data
        paymongoId: {
            type: String,
            required: false,
            sparse: true,
            unique: true, // ensures no duplicate payments
        },
        eventIds: [
            {
                type: String, // PayMongo event IDs (evt_...)
            },
        ],
        orderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: 'true'},
        
        // Money
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: "PHP",
            enum: ["PHP"],
        },

        // Status in system
        status: {
            type: String,
            enum: ["pending", "paid", "failed", "cancelled"],
            default: "pending",
        },

        // metadata
        provider: {
            type: String, // "gcash", "grabpay", "card"
        },
        rawPayload: {
            type: Object, // store original webhook payload for debugging
        },
    },
    { timestamps: true }
);

PaymentSchema.index({ paymongoId: 1 });

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
