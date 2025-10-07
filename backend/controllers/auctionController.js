// controllers/auctionController.js
import Auction from "../models/Auction.js";
import Inventory from "../models/Inventory.js"; // ✅ Auction uses Inventory as source
import Bid from '../models/Bid.js'
/**
 * Create a new auction
 */
export const createAuction = async (req, res) => {
    try {
        const {
            inventoryId,
            startPrice,
            startTime,
            endTime,
            reservePrice,
            description,
        } = req.body;

        // ✅ Validate inventory exists
        const inventoryItem = await Inventory.findById(inventoryId);
        if (!inventoryItem) {
            return res.status(404).json({ message: "Inventory item not found" });
        }

        // ✅ Prevent double posting
        if (inventoryItem.status !== "available") {
            return res.status(400).json({
                message: "This inventory item is not available for auction",
            });
        }

        // Create auction
        const auction = new Auction({
            inventoryId,
            startPrice,
            startTime,
            endTime,
            reservePrice,
            description,
            status: "PENDING",
            finalized: false,
        });

        await auction.save();

        // ✅ Mark inventory as reserved
        inventoryItem.status = "reserved";
        await inventoryItem.save();

        res.status(201).json(auction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get all auctions
 */
export const getAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find()
            .populate("inventoryId", "productName price status description images")
            .sort({ createdAt: -1 });

        // attach top 3 bids for each auction
        const auctionsWithBids = await Promise.all(
            auctions.map(async (auction) => {
                const topBids = await Bid.find({ auctionId: auction._id })
                    .sort({ amount: -1, createdAt: 1 })
                    .limit(3)
                    .populate("userId", "name email");

                return {
                    ...auction.toObject(),
                    topBidders: topBids.map((bid) => ({
                        userId: bid.userId.name || bid.userId._id,
                        amount: bid.amount,
                    })),
                };
            })
        );

        res.json(auctionsWithBids); // ✅ return auctions with topBidders
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get single auction by ID
 */
export const getAuctionById = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id)
            .populate({
                path: "inventoryId",
                select: "productName category condition details images status createdAt description",
                populate: {
                    path: 'category',
                    select: 'name',
                }
            })

        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        res.json(auction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Finalize auction (mark as closed & sold if winner exists)
 */
export const finalizeAuction = async (req, res) => {
    try {
        const { id } = req.params;
        const auction = await Auction.findById(id);

        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        if (auction.finalized) {
            return res.status(400).json({ message: "Auction already finalized" });
        }

        // Mark auction as closed
        auction.status = "CLOSED";
        auction.finalized = true;
        await auction.save();

        // Update inventory if there is a winner
        if (auction.winner) {
            const inventoryItem = await Inventory.findById(auction.inventoryId);
            if (inventoryItem) {
                inventoryItem.status = "sold";
                await inventoryItem.save();
            }
        }

        res.json({ message: "Auction finalized", auction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get past (closed) auctions
export const getPastAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({ status: "CLOSED" })
            .populate({
                path: "inventoryId",
                select: "productName images condition category details description",
                populate: {
                    path: 'category',
                    select: 'name'
                }
            })
            .sort({ endTime: -1 })
            .lean(); // convert to plain JS object

        for (let auction of auctions) {
            const bids = await Bid.find({ auctionId: auction._id })
                .sort({ amount: -1, createdAt: 1 })
                .limit(3)
                .populate("userId", "name email");
            auction.topBidders = bids;
        }

        res.json(auctions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
