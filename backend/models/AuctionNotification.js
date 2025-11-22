import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
    message: { type: String, required: true },
    showClaimButton: { type: Boolean, default: false },
    label: { type: String, required: true },
    read: { type: Boolean, default: false }, // for marking notifications as read
    createdAt: { type: Date, default: Date.now },
});

// index for faster fetching of unread notifications per user
notificationSchema.index({ userId: 1, read: 1 });

export default mongoose.model("Notification", notificationSchema);
