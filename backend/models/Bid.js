import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
    {
        auctionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
            required: true,
        },
        canEdit: {type: Boolean, default: true},
        canCancel: {type: Boolean, default: true},
        status: {type: String, enum: ['ACTIVE', 'CANCELLED']},
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

bidSchema.index({ auctionId: 1, userId: 1}, {unique: true})

const Bid = mongoose.model("Bid", bidSchema);
export default Bid;
