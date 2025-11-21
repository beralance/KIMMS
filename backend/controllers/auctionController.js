// controllers/auctionController.js
import Auction from "../models/Auction.js";
import Inventory from "../models/Inventory.js"; // ✅ Auction uses Inventory as source
import Bid from "../models/Bid.js";
import { createNotification } from "../controllers/auctionNotificationController.js";
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
            return res
                .status(404)
                .json({ message: "Inventory item not found" });
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
            .populate({
                path: "inventoryId",
                select: "productName price isLocal category status description details condition images weight",
                populate: {
                    path: "category",
                    select: "name",
                },
            })
            .sort({ createdAt: -1 });

        // attach top 3 bids for each auction
        const auctionsWithBids = await Promise.all(
            auctions.map(async (auction) => {
                const topBids = await Bid.find({ auctionId: auction._id })
                    .sort({ amount: -1, createdAt: 1 })
                    .limit(3)
                    .populate({
                        path: "userId",
                        select: "fullName email",
                    });

                return {
                    ...auction.toObject(),
                    topBidders: topBids.map((bid) => ({
                        userId: bid.userId._id,
                        userName: bid.userId.fullName,
                        email: bid.userId.email,
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
        const auction = await Auction.findById(req.params.id).populate({
            path: "inventoryId",
            select: "productName category condition details images status createdAt description",
            populate: {
                path: "category",
                select: "name",
            },
        });

        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        res.json(auction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deletePendingAuction = async (req, res) => {
    try {
        const { id } = req.params;

        const auction = await Auction.findById(id).populate("inventoryId");

        console.log("Auction found", auction);
        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        if (auction.status !== "PENDING") {
            return res
                .status(400)
                .json({ message: "Only pending auctions can be deleted." });
        }

        if (auction.inventoryId) {
            auction.inventoryId.status = "available";
            await auction.inventoryId.save();
        }

        await Auction.findByIdAndDelete(id);

        res.json({ message: "Auction deleted successfully" });
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
            return res
                .status(400)
                .json({ message: "Auction already finalized" });
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
                    path: "category",
                    select: "name",
                },
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

export const claimAuctionItem = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const userId = req.user.id;

        const auction = await Auction.findById(auctionId)
            .populate("winner", "fullName email phoneNumber address")
            .populate(
                "inventoryId",
                "productName category condition isLocal physicalCode"
            );

        if (!auction)
            return res.status(404).json({ message: "Auction not found" });
        if (auction.status !== "PENDING_CLAIM")
            return res
                .status(400)
                .json({ message: "Auction not open for claiming" });
        if (auction.winner.toString() !== userId.toString())
            return res.status(403).json({ message: "You are not the winner" });
        if (auction.claimDeadline && auction.claimDeadline < new Date())
            return res
                .status(400)
                .json({ message: "Claim period has expired" });

        res.status(200).json({ message: "Item successfully claimed", auction });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const confirmAuctionDelivery = async (req, res) => {
    try {
        const { auctionId } = req.params;

        const auction = await Auction.findById(auctionId).populate(
            "inventoryId winner",
            "productName fullName"
        );
        if (!auction)
            return res.status(404).json({ message: "Auction not found" });

        if (auction.status === "CLAIMED")
            return res
                .status(400)
                .json({ message: "Item already claimed or already processed" });

        await auction.save();

        await createNotification(
            auction.winner._id,
            auction._id,
            `Your item "${auction.inventoryId.productName}" has been successfully delivered. Thank you for participating!`
        );

        res.status(200).json({
            message: "Auction successfully marked as completed",
            auction,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const auctionCloseCron = async () => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000); // return to 7days

        const completedAuctions = await Auction.find({
            status: "COMPLETED",
            deliveredAt: { $lt: sevenDaysAgo },
        });

        for (const auction of completedAuctions) {
            auction.status = "CLOSED";
            await auction.save();
        }

        console.log(
            `${completedAuctions.length} auctions closed successfully.`
        );
    } catch (err) {
        console.error("auctionCloseCron error:", err);
    }
};

/**
 * Get auction stats for reports
 * @param {Object} options - optional filters
 *   options.period: 'week' | 'month' | 'year' | {from: Date, to: Date}
 *   options.category: categoryId (requires inventory population)
 *   options.inventoryId: specific inventory item
 *   options.alertThresholds: { pendingHours: Number, liveHours: Number }
 */
export const getAuctionReportStats = async (options = {}) => {
    const { period, category, inventoryId, alertThresholds } = options;
    const pendingHours = alertThresholds?.pendingHours || 24;
    const liveHours = alertThresholds?.liveHours || 2;

    const now = new Date();
    let filter = {};

    // Period filter
    if (period) {
        let fromDate;
        if (period === "week") {
            fromDate = new Date();
            fromDate.setDate(now.getDate() - 7);
        } else if (period === "month") {
            fromDate = new Date();
            fromDate.setMonth(now.getMonth() - 1);
        } else if (period === "year") {
            fromDate = new Date();
            fromDate.setFullYear(now.getFullYear() - 1);
        } else if (period.from && period.to) {
            filter.createdAt = {
                $gte: new Date(period.from),
                $lte: new Date(period.to),
            };
        }

        if (fromDate && !filter.createdAt) {
            filter.createdAt = { $gte: fromDate };
        }
    }

    // Inventory filter
    if (inventoryId) filter.inventoryId = inventoryId;

    // Fetch auctions and populate inventory
    const auctions = await Auction.find(filter).populate(
        "inventoryId",
        "productName category"
    );

    // Category filter (after populate)
    const filteredAuctions = category
        ? auctions.filter(
              (a) => a.inventoryId?.category?.toString() === category.toString()
          )
        : auctions;

    // Counts
    const totalAuctions = filteredAuctions.length;
    const liveAuctions = filteredAuctions.filter(
        (a) => a.status === "LIVE"
    ).length;
    const pendingAuctions = filteredAuctions.filter(
        (a) => a.status === "PENDING"
    ).length;
    const endedAuctions = filteredAuctions.filter(
        (a) => a.status === "ENDED"
    ).length;
    const closedAuctions = filteredAuctions.filter(
        (a) => a.status === "CLOSED"
    ).length;

    // Alerts
    const alerts = [];

    // Pending auctions starting soon
    filteredAuctions
        .filter((a) => a.status === "PENDING")
        .forEach((a) => {
            const diffMs = new Date(a.startTime) - now;
            if (diffMs > 0 && diffMs <= pendingHours * 60 * 60 * 1000) {
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffMinutes = Math.floor(
                    (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                );
                alerts.push({
                    type: "pending_start",
                    message: `Auction '${a.inventoryId.productName}' starts in ${diffHours}h ${diffMinutes}m.`,
                });
            }
        });

    // Live auctions ending soon
    filteredAuctions
        .filter((a) => a.status === "LIVE")
        .forEach((a) => {
            const diffMs = new Date(a.endTime) - now;
            if (diffMs > 0 && diffMs <= liveHours * 60 * 60 * 1000) {
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffMinutes = Math.floor(
                    (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                );
                alerts.push({
                    type: "live_end",
                    message: `Auction '${a.inventoryId.productName}' ending in ${diffHours}h ${diffMinutes}m.`,
                });
            }
        });

    return {
        totalAuctions,
        liveAuctions,
        pendingAuctions,
        endedAuctions,
        closedAuctions,
        alerts,
    };
};
