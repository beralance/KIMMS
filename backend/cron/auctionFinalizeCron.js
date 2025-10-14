import cron from "node-cron";
import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import Inventory from "../models/Inventory.js";
import { createNotification } from "../controllers/auctionNotificationController.js"

export const auctionFinalizeCron = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date()

            // Find ended auctions that are past their cooldown period and not yet finalized
            const endedAuctions = await Auction.find({
                status: "ENDED",
                finalized: { $ne: true },
                cooldownUntil: {$lte: now},
            });

            for (let auction of endedAuctions) {
                try {
                    console.log(`Finalizing auction ${auction._id}...`)
                    console.log(`Cooldown ended at ${auction.cooldownUntil?.toLocaleTimeString()}`)
                    
                    // Get all bids for auction
                    const bids = await Bid.find({ auctionId: auction._id })
                        .sort({ amount: -1, createdAt: 1 })
                        .populate("userId", "name");

                
                    const winner = bids.length > 0 ? bids[0].userId._id : null;

                    // Notify top 3 bidders
                    const topBidders = bids.slice(0, 3);
                    for (let i = 0; i < topBidders.length; i++) {
                        const bid = topBidders[i];
                        let message = "";

                        if (i === 0) {
                            message =
                                winner === bid.userId._id
                                ? `You won the auction for item ${auction.inventoryId}! Please complete payment.`
                                : "The winning item is not available. You lost.";
                        } else {
                            message =
                                winner === bid.userId._id
                                ? "You lost the auction, but may still get the item if the top bidder fails."
                                : "You lost the auction, please try again next time.";
                        }

                        await createNotification(bid.userId._id, auction._id, message);
                    }

                // Update auction
                auction.winner = winner;
                auction.status = "CLOSED";
                auction.finalized = true;
                await auction.save();

                // Update inventory if winner exists
                if (winner) {
                    const inventoryItem = await Inventory.findById(auction.inventoryId);
                    if (inventoryItem) {
                        inventoryItem.status = "sold";
                        await inventoryItem.save();
                    }
                }

                console.log(`Auction ${auction._id} finalized. Winner: ${winner || "None"}`);
            } catch (err) {
                console.error(`Error finalizing auction ${auction._id}:`, err.message);
            }
        }
        } catch (err) {
            console.error("Error fetching ended auctions:", err.message);
        }
    });
};
