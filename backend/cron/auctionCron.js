import cron from "node-cron";
import Auction from "../models/Auction.js";

/**
 * Cron job to automatically update auction statuses
 * PENDING → LIVE → ENDED
 */
export const auctionLifecycleCron = () => {
  // Runs every minute
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();

            // 1️⃣ Start auctions that should be LIVE
            const pendingAuctions = await Auction.find({
                status: "PENDING",
                startTime: { $lte: now },
            });

            for (let auction of pendingAuctions) {
                auction.status = "LIVE";
                await auction.save();
                console.log(`Auction ${auction._id} is now LIVE`);
            }

            // 2️⃣ End auctions that should be ENDED
            const liveAuctions = await Auction.find({
                status: "LIVE",
                endTime: { $lte: now },
            });

            for (let auction of liveAuctions) {
                auction.status = "ENDED";
                await auction.save();
                console.log(`Auction ${auction._id} has ENDED`);
            }
        } catch (err) {
        console.error("Error updating auction statuses:", err.message);
        }
    });
};
