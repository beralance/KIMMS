import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";


const PaymentSchema = new mongoose.Schema({
    paymongoId: String,
    amount: Number,
    currency: { type: String, default: 'PHP' },
    status: String,
    eventIds: [String],
    createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', PaymentSchema)
export default Payment