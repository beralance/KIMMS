import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
    {
        inventoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory",
            required: true,
        },

        startPrice: {
            type: Number,
            required: true,
        },

        reservePrice: {
            type: Number,
        },

        startTime: {
            type: Date,
            required: true,
        },

        endTime: {
            type: Date,
            required: true,
        },

        // Lifecycle of the auction
        status: {
            type: String,
            enum: ["PENDING", "LIVE", "ENDED", "CLOSED"],
            default: "PENDING",
        },

        description: {
            type: String,
        },

        finalized: {
            type: Boolean,
            default: false,
        },

        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Auction = mongoose.model("Auction", auctionSchema);
export default Auction;
