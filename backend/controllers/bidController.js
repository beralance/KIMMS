import Bid from "../models/Bid.js";
import Auction from "../models/Auction.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// Place a bid (sealed)
export const placeBid = async (req, res) => {
    try {
        const { auctionId, amount } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.auctionRestriction) {
            return res.status(403).json({
                message:
                    "You cannot participate in auction due to bad activities",
            });
        }
        const missingFields = [];

        if (!user.fullName?.trim()) missingFields.push("fullName");
        if (!user.phoneNumber?.trim()) missingFields.push("phoneNumber");

        const { address } = user;
        const addressFields = [
            "street",
            "city",
            "province",
            "region",
            "postalCode",
        ];
        addressFields.forEach((field) => {
            if (!address?.[field]?.trim())
                missingFields.push(`address.${field}`);
        });

        if (!user.isVerified) {
            missingFields.push("emailVerification");
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Please complete your profile before placing a bid.",
                missingFields,
            });
        }

        const totalSuccessfulPurchases = await Order.aggregate([
            {
                $match: {
                    userId: user._id,
                    orderStatus: "SUCCESSFUL",
                    paymentStatus: "paid",
                    orderType: "fixed",
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$finalPrice" },
                },
            },
        ]);

        const totalAmount = totalSuccessfulPurchases[0]?.totalAmount
            ? totalSuccessfulPurchases[0].totalAmount
            : 0;

        console.log("total Amount", totalAmount);

        if (totalAmount < 10000) {
            return res.status(400).json({
                message:
                    "You do not meet the minimum purchase requirement to join this auction.",
                required: 10000,
                currentTotal: totalAmount,
            });
        }

        // ✅ Validate auction exists
        const auction = await Auction.findById(auctionId);
        if (!auction)
            return res.status(404).json({ message: "Auction not found" });

        if (auction.status !== "LIVE") {
            return res.status(400).json({ message: "Auction is not active" });
        }

        // ✅ Ensure bid meets reserve/start price
        const minAllowed = auction.reservePrice || auction.startPrice;
        if (amount < minAllowed) {
            return res
                .status(400)
                .json({ message: `Bid must be at least ${minAllowed}` });
        }

        let bid = await Bid.findOne({ auctionId, userId, status: "ACTIVE" });
        console.log("BID", bid);
        if (bid) {
            if (!bid.canEdit) {
                return res
                    .status(400)
                    .json({ message: "You already edited your bid once" });
            }
            bid.amount = amount;
            bid.canEdit = false;
            await bid.save();
            return res
                .status(200)
                .json({ message: "Bid updated successfully" });
        }

        bid = new Bid({
            auctionId,
            userId,
            amount,
            canEdit: true,
            canCancel: true,
            status: "ACTIVE",
        });
        await bid.save();

        res.status(201).json({ message: "Bid placed successfully" });
    } catch (err) {
        // Handle duplicate bid if using unique index
        if (err.code === 11000) {
            return res.status(400).json({
                message: "You have already placed a bid for this auction",
            });
        }
        console.error("Error placing bid:", err);
        res.status(500).json({ error: err.message });
    }
};

// Optional: Only admin can view all bids (for audit/finalization)
export const getBidsByAuction = async (req, res) => {
    try {
        console.log("auction id", req.params.auctionId);
        const bids = await Bid.find({ auctionId: req.params.auctionId })
            .populate("userId", "fullName isLocal email") // admin sees user info
            .sort({ amount: -1, createdAt: 1 }); // highest bid first, earliest if tie

        res.json(bids);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const cancelBid = async (req, res) => {
    try {
        const { auctionId } = req.body;
        const userId = req.user.id;

        const bid = await Bid.findOne({ auctionId, userId, status: "ACTIVE" });
        if (!bid)
            return res
                .status(404)
                .json({ message: "No active bid found to cancel" });

        if (!bid.canCancel) {
            return res
                .status(400)
                .json({ message: "You have already used your cancel option" });
        }

        const auction = await Auction.findById(auctionId);
        if (!auction)
            return res.status(404).json({ message: "Auction not found" });

        const now = new Date();
        const auctionEnd = new Date(auction.endTime);
        const diffMinutes = (auctionEnd - now) / (1000 * 60);

        if (diffMinutes <= 10) {
            return res.status(400).json({
                message: "Cannot cancel withing 10 minutes of auction end",
            });
        }

        bid.status = "CANCELLED";
        bid.canCancel = false;
        bid.canEdit = false;
        await bid.save();

        const user = await User.findById(userId);
        user.badRecords += 1;
        if (user.badRecords >= 5) {
            user.auctionRestriction = true;
            console.log(
                `Auction Finalize: User ${user.fullName} is RESTRICTED to participate in auction.`
            );
        }
        await user.save();

        res.status(200).json({ message: "Bid cancelled successfully" });
    } catch (err) {
        console.error("Error cancelling bid:", err);
        res.status(500).json({ error: err.message });
    }
};
