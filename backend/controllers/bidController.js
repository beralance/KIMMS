import Bid from "../models/Bid.js";
import Auction from "../models/Auction.js";

// Place a bid (sealed)
export const placeBid = async (req, res) => {
    try {
        const { auctionId, amount } = req.body;
        const userId = req.user.id;

        // ✅ Validate auction exists
        const auction = await Auction.findById(auctionId);
        if (!auction) return res.status(404).json({ message: "Auction not found" });

        if (auction.status !== "LIVE") {
            return res.status(400).json({ message: "Auction is not active" });
        }

        // ✅ Ensure bid meets reserve/start price
        const minAllowed = auction.reservePrice || auction.startPrice;
        if (amount < minAllowed) {
            return res.status(400).json({ message: `Bid must be at least ${minAllowed}` });
        }

        // ✅ Save bid (sealed: no real-time visibility)
        const bid = new Bid({ auctionId, userId, amount });
        await bid.save();

        res.status(201).json({ message: "Bid placed successfully" });
    } catch (err) {
        // Handle duplicate bid if using unique index
        if (err.code === 11000) {
            return res.status(400).json({ message: "You have already placed a bid for this auction" });
        }
        res.status(500).json({ error: err.message });
    }
};

// Optional: Only admin can view all bids (for audit/finalization)
export const getBidsByAuction = async (req, res) => {
    try {
        const bids = await Bid.find({ auctionId: req.params.auctionId })
            .populate("userId", "name email") // admin sees user info
            .sort({ amount: -1, createdAt: 1 }); // highest bid first, earliest if tie

        res.json(bids);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
