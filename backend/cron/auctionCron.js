import cron from "node-cron";
import Auction from "../models/Auction.js";

export const auctionLifecycleCron = () => {
  // Runs every minute
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();

            // Start auctions that should be LIVE
            const pendingAuctions = await Auction.find({
                status: "PENDING",
                startTime: { $lte: now },
            });

            for (let auction of pendingAuctions) {
                auction.status = "LIVE";
                await auction.save();
                console.log(`Auction ${auction._id} is now LIVE`);
            }

            // End auctions that should be ENDED
            const liveAuctions = await Auction.find({
                status: "LIVE",
                endTime: { $lte: now },
            });

            for (let auction of liveAuctions) {

                // set cooldown duration
                const cooldownDuration = 60 * 1000;
                const cooldownUntil = new Date(Date.now() + cooldownDuration)

                auction.status = "ENDED";
                auction.cooldownUntil = cooldownUntil;

                await auction.save();

                console.log(
                    `⏳ Auction ${auction._id} has ENDED — cooldown active until ${cooldownUntil.toLocaleTimeString()}`
                );

                // Cooldown timer log
                const interval = setInterval(() => {
                    const remaining = auction.cooldownUntil - Date.now()
                    if (remaining <= 0) {
                        clearInterval(interval)
                        console.log(
                            `🧊 Auction ${auction._id} cooldown finished — ready for finalization.`
                        )
                    } 
                    else {
                        console.log(
                            `🔄 Auction ${auction._id}: ${Math.ceil(remaining / 1000)}s remaining cooldown`
                        )
                    }
                }, 10 * 1000);
                console.log(`Auction ${auction._id} has ENDED`);
            }
        } catch (err) {
        console.error("Error updating auction statuses:", err.message);
        }
    });
};
