import cron from "node-cron";
import Auction from "../models/Auction.js";
import User from '../models/User.js'
import Bid from "../models/Bid.js";
import Inventory from "../models/Inventory.js";
import { createNotification } from "../controllers/auctionNotificationController.js"

export const auctionFinalizeCron = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date()
                
            const stage1Auctions = await Auction.find({
                status: "ENDED",
                cooldownUntil: {$lte: now},
            }).populate('inventoryId', 'productName images condition details description isLocal');

            const stage2Auctions = await Auction.find({
                status: "PENDING_CLAIM",
                claimStage: 1,
                claimDeadline: { $lte: now }
            }).populate('inventoryId', 'productName images condition details description isLocal');


            const stage3Auctions = await Auction.find({
                status: "PENDING_CLAIM",
                claimStage: 2,
                claimDeadline: { $lte: now }
            }).populate('inventoryId', 'productName images condition details description.isLocal');

            if (
                (!stage1Auctions || stage1Auctions.length === 0) &&
                (!stage2Auctions || stage2Auctions.length === 0) &&
                (!stage3Auctions || stage3Auctions.length === 0)
             ) return;

            // ---------------- STAGE 1 ----------------
            for (const auction of stage1Auctions) {
                try {
                    console.log(`Finalizing auction ${auction._id}...`);
                    console.log(`Cooldown ended at ${auction.cooldownUntil?.toLocaleTimeString()}`);

                    // Get all bids for auction
                    let bids = await Bid.find({ auctionId: auction._id })
                        .populate("userId", "fullName email phoneNumber address");

                    // Sort by amount desc, then createdAt asc
                    bids.sort((a, b) => (b.amount !== a.amount ? b.amount - a.amount : a.createdAt - b.createdAt));

                    const topBids = bids.slice(0, 3);
                    const nonTopBidders = bids.slice(3);

                    // Notify non-top bidders
                    for (const bid of nonTopBidders) {
                        await createNotification(
                            bid.userId._id,
                            auction._id,
                            `You did not win the auction for ${auction.inventoryId?.productName}. Better luck next time!`
                        );
                    }

                    // Handle case with no bids
                    if (bids.length === 0) {
                        const inventoryItem = await Inventory.findById(auction.inventoryId);
                        if (inventoryItem) {
                            inventoryItem.status = 'available';
                            await inventoryItem.save();
                        }
                        auction.status = 'UNCLAIMED';
                        auction.finalized = true;
                        await auction.save();
                        continue;
                    }

                    // Stage 1 notifications
                    if (auction.status === 'ENDED' && auction.winnerNotified === 'none') {
                        auction.status = 'PENDING_CLAIM';
                        auction.claimStage = 1;
                        auction.claimDeadline = new Date(Date.now() + 2 * 60 * 1000); // 2 min for testing
                        auction.winnerNotified = 'Top 1';
                        await auction.save();

                        if (bids[0]) await createNotification(bids[0].userId._id, auction._id, `You are the top bidder for ${auction.inventoryId?.productName}! Please claim and pay within 24 hours.`);
                        if (bids[1]) await createNotification(bids[1].userId._id, auction._id, `You did not win but you still have a chance to get the item. We will notify you soon.`);
                        if (bids[2]) await createNotification(bids[2].userId._id, auction._id, `You did not win but you still have a chance to get the item. We will notify you soon.`);
                    }
                } catch (err) {
                    console.error(`Error finalizing Stage 1 auction ${auction._id}:`, err.message);
                }
            }

            console.log('OUTSIDE stage 2')

            // ---------------- STAGE 2 ----------------
            for (const auction of stage2Auctions) {
                try {
                    const bids = await Bid.find({ auctionId: auction._id })
                        .sort({ amount: -1, createdAt: 1 })
                        .limit(3)
                        .populate("userId", "fullName email");

                    console.log('Inside stage 2', bids)
                    auction.claimStage = 2;
                    auction.claimDeadline = new Date(Date.now() + 2 * 60 * 1000);
                    auction.winnerNotified = 'Top 2';

                    if (bids[0]) await createNotification(bids[0].userId._id, auction._id, `You failed to claim "${auction.inventoryId?.productName}". You can no longer purchase the item.`);
                    if (bids[1]) await createNotification(bids[1].userId._id, auction._id, `You are now the top bidder of "${auction.inventoryId?.productName}"! Please claim and pay within 24 hours.`);
                    
                    await auction.save();
                } catch (err) {
                    console.error(`Error finalizing Stage 2 auction ${auction._id}:`, err.message);
                }
            }

            // ---------------- STAGE 3 ----------------
            for (const auction of stage3Auctions) {
                try {
                    const bids = await Bid.find({ auctionId: auction._id })
                        .sort({ amount: -1, createdAt: 1 })
                        .limit(3)
                        .populate("userId", "fullName email");

                    auction.claimStage = 3;
                    auction.claimDeadline = new Date(Date.now() + 3 * 60 * 1000);
                    auction.winnerNotified = 'No claims';
                    auction.status = 'UNCLAIMED';
                    auction.finalized = true;

                    if (bids[2]) await createNotification(bids[2].userId._id, auction._id, `You failed to claim "${auction.inventoryId?.productName}". You can no longer purchase the item.`);
                    await auction.save();

                    const inventoryItem = await Inventory.findById(auction.inventoryId);
                    if (inventoryItem) {
                        inventoryItem.status = 'available';
                        await inventoryItem.save();
                    }
                } catch (err) {
                    console.error(`Error finalizing Stage 3 auction ${auction._id}:`, err.message);
                }
            }
        } catch (err) {
            console.error("Error fetching ended auctions:", err.message);
        }
    });
};
