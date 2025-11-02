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
        claimStage: {
            type: Number,
            default: 0,
        },
        winnerClaimed: {
            type: Boolean,
            default: false
        },
        claimedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        claimAt: {
            type: Date,
            default: null
        },
        winnerNotified: {
            type: String,
            default: 'none',
        },
        claimDeadline: {
            type: Date,
            default: null,
        },
        // Lifecycle of the auction
        status: {
            type: String,
            enum: ["PENDING", "PENDING_CLAIM", "CLAIMED", "COMPLETED", "LIVE", "ENDED", "CLOSED", "UNCLAIMED"],
            default: "PENDING",
        },

        description: {
            type: String,
        },

        finalized: {
            type: Boolean,
            default: false,
        },

        cooldownUntil: {
            type: Date, default: null
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
