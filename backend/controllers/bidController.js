import Bid from "../models/Bid.js";
import Auction from "../models/Auction.js";
import User from "../models/User.js";

// Place a bid (sealed)
export const placeBid = async (req, res) => {
    try {
        const { auctionId, amount } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

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

        // ✅ Save bid (sealed: no real-time visibility)
        const bid = new Bid({ auctionId, userId, amount });
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
