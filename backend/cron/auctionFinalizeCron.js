import cron from "node-cron";
import Auction from "../models/Auction.js";
import User from "../models/User.js";
import Bid from "../models/Bid.js";
import Inventory from "../models/Inventory.js";
import { createNotification } from "../controllers/auctionNotificationController.js";

export const auctionFinalizeCron = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            const MAX_BAD_RECORDS = 5;
            const stage1Auctions = await Auction.find({
                status: "ENDED",
                cooldownUntil: { $lte: now },
            }).populate(
                "inventoryId",
                "productName images condition details description isLocal"
            );

            const stage2Auctions = await Auction.find({
                status: "PENDING_CLAIM",
                claimStage: 1,
                claimDeadline: { $lte: now },
            }).populate(
                "inventoryId",
                "productName images condition details description isLocal"
            );

            const stage3Auctions = await Auction.find({
                status: "PENDING_CLAIM",
                claimStage: 2,
                claimDeadline: { $lte: now },
            }).populate(
                "inventoryId",
                "productName images condition details description.isLocal"
            );

            const fallbackAuctions = await Auction.find({
                status: "PENDING_CLAIM",
                claimStage: 3,
                claimDeadline: { $lte: now },
            }).populate(
                "inventoryId",
                "productName images condition details description.isLocal"
            );

            const claimedAuctions = await Auction.find({
                status: "CLAIMED",
                claimStage: 5,
                winnerClaimed: true,
                claimDeadline: { $lte: now },
            }).populate(
                "inventoryId",
                "productName images condition details description.isLocal"
            );

            if (
                (!stage1Auctions || stage1Auctions.length === 0) &&
                (!stage2Auctions || stage2Auctions.length === 0) &&
                (!stage3Auctions || stage3Auctions.length === 0) &&
                (!fallbackAuctions || fallbackAuctions.length === 0) &&
                (!claimedAuctions || claimedAuctions.length === 0)
            )
                return;

            // ---------------- STAGE 1 ----------------
            for (const auction of stage1Auctions) {
                try {
                    console.log(`Finalizing auction ${auction._id}...`);
                    console.log(
                        `Cooldown ended at ${auction.cooldownUntil?.toLocaleTimeString()}`
                    );

                    // Get all bids for auction
                    let bids = await Bid.find({
                        auctionId: auction._id,
                    }).populate("userId", "fullName email phoneNumber address");

                    // Sort by amount desc, then createdAt asc
                    bids.sort((a, b) =>
                        b.amount !== a.amount
                            ? b.amount - a.amount
                            : a.createdAt - b.createdAt
                    );

                    const topBids = bids.slice(0, 3);
                    const nonTopBidders = bids.slice(3);

                    // Notify non-top bidders
                    for (const bid of nonTopBidders) {
                        await createNotification(
                            bid.userId._id,
                            auction._id,
                            false,
                            `You did not win the auction for ${auction.inventoryId?.productName}. Better luck next time!`,
                            "Auction Ended"
                        );
                    }

                    // Handle case with no bids
                    if (bids.length === 0) {
                        const inventoryItem = await Inventory.findById(
                            auction.inventoryId
                        );
                        if (inventoryItem) {
                            inventoryItem.status = "available";
                            await inventoryItem.save();
                        }
                        auction.status = "UNCLAIMED";
                        auction.finalized = true;
                        await auction.save();
                        continue;
                    }

                    // Stage 1 notifications
                    if (
                        auction.status === "ENDED" &&
                        auction.winnerNotified === "none"
                    ) {
                        auction.status = "PENDING_CLAIM";
                        auction.claimStage = 1;
                        auction.claimDeadline = new Date(
                            Date.now() + 5 * 60 * 1000
                        );
                        auction.winnerNotified = "Top1";

                        if (bids[0]) auction.winner = bids[0].userId;

                        if (bids[0])
                            await createNotification(
                                bids[0].userId._id,
                                auction._id,
                                true,
                                `You are the top bidder for ${auction.inventoryId?.productName}! Please claim and pay within 24 hours.`,
                                "Congratulation! You're the Winner"
                            );
                        if (bids[1])
                            await createNotification(
                                bids[1].userId._id,
                                auction._id,
                                false,
                                `You did not win but you still have a chance to get the item. We will notify you soon.`,
                                "Almost there! You Still Have a Chance"
                            );
                        if (bids[2])
                            await createNotification(
                                bids[2].userId._id,
                                auction._id,
                                false,
                                `You did not win but you still have a chance to get the item. We will notify you soon.`,
                                "Almost there! You Still Have a Chance"
                            );
                        await auction.save();
                        console.log(
                            `1️⃣ Auction ${auction} has finally entered STAGE 1`
                        );
                        console.log(
                            `1️⃣ Auction status changed from ENDED to PENDING_CLAIM`
                        );
                        console.log(`1️⃣ 📧Notification sent to WINNER 1`);
                    }
                } catch (err) {
                    console.error(
                        `Error finalizing Stage 1 auction ${auction._id}:`,
                        err.message
                    );
                }
            }

            // ---------------- STAGE 2 ----------------
            for (const auction of stage2Auctions) {
                try {
                    const bids = await Bid.find({ auctionId: auction._id })
                        .sort({ amount: -1, createdAt: 1 })
                        .limit(3)
                        .populate(
                            "userId",
                            "fullName email badRecords auctionRestriction"
                        );

                    if (auction.winnerClaimed === false) {
                        auction.claimStage = 2;
                        auction.claimDeadline = new Date(
                            Date.now() + 24 * 60 * 60 * 1000
                        );
                        auction.winnerNotified = "Top2";

                        const firstBidder = bids[0]?.userId || null;
                        const secondBidder = bids[1]?.userId || null;

                        if (firstBidder) {
                            firstBidder.badRecords += 1;

                            if (firstBidder.badRecords > MAX_BAD_RECORDS) {
                                firstBidder.auctionRestriction = true;
                                console.log(
                                    `Auction Finalize: User ${firstBidder.fullName} is RESTRICTED to participate in auction.`
                                );
                            }
                            await firstBidder.save();
                        } else {
                            console.log(
                                "No 1st bidder — skipping bad record increment."
                            );
                        }

                        if (secondBidder) {
                            auction.winner = secondBidder._id;
                        } else {
                            auction.winner = null;
                            auction.claimStage = 3;
                            auction.claimDeadline = new Date();
                        }

                        if (firstBidder)
                            await createNotification(
                                firstBidder._id,
                                auction._id,
                                false,
                                `You failed to claim "${auction.inventoryId?.productName}". You can no longer purchase the item.`,
                                "Claim Period Expired"
                            );
                        if (secondBidder)
                            await createNotification(
                                secondBidder._id,
                                auction._id,
                                true,
                                `You are now the top bidder of "${auction.inventoryId?.productName}"! Please claim and pay within 24 hours.`,
                                "You're Now the Top Bidder"
                            );

                        await auction.save();
                        console.log(
                            `2️⃣ Auction ${auction} is passed to WINNER 2, winner 1 did not claim the item`
                        );
                        console.log(`2️⃣ 📧Notification sent to WINNER 2`);
                    } else {
                        continue;
                    }
                } catch (err) {
                    console.error(
                        `Error finalizing Stage 2 auction ${auction._id}:`,
                        err.message
                    );
                }
            }

            // ---------------- STAGE 3 ----------------
            for (const auction of stage3Auctions) {
                try {
                    const bids = await Bid.find({ auctionId: auction._id })
                        .sort({ amount: -1, createdAt: 1 })
                        .limit(3)
                        .populate(
                            "userId",
                            "fullName email badRecords auctionRestriction"
                        );

                    if (auction.winnerClaimed === false) {
                        auction.claimStage = 3;
                        auction.claimDeadline = new Date(
                            Date.now() + 5 * 60 * 1000
                        );
                        auction.winnerNotified = "Top3";

                        const secondBidder = bids[1]?.userId || null;
                        const thirdBidder = bids[2]?.userId || null;

                        if (secondBidder) {
                            secondBidder.badRecords += 1;

                            if (secondBidder.badRecords >= MAX_BAD_RECORDS) {
                                secondBidder.auctionRestriction = true;
                                console.log(
                                    `Auction Finalize: User ${secondBidder.fullName} is RESTRICTED to participate in auction.`
                                );
                            }
                            await secondBidder.save();
                        } else {
                            console.log(
                                "No 2nd bidder — skipping bad record increment."
                            );
                        }

                        if (thirdBidder) {
                            auction.winner = thirdBidder._id;
                        } else {
                            auction.winner = null;
                            auction.claimStage = 3;
                            auction.claimDeadline = new Date();
                        }

                        if (secondBidder)
                            await createNotification(
                                secondBidder._id,
                                auction._id,
                                false,
                                `You failed to claim "${auction.inventoryId?.productName}". You can no longer purchase the item.`,
                                "Claim Period Expired"
                            );
                        if (thirdBidder)
                            await createNotification(
                                thirdBidder._id,
                                auction._id,
                                true,
                                `You are now the top bidder of "${auction.inventoryId?.productName}"! Please claim and pay within 24 hours.`,
                                "You're Now the Top Bidder"
                            );

                        await auction.save();
                        console.log(
                            `3️⃣ Auction ${auction} is passed to WINNER 3, winner 1 did not claim the item`
                        );
                        console.log(`3️⃣ 📧Notification sent to WINNER 3`);
                    } else {
                        continue;
                    }
                } catch (err) {
                    console.error(
                        `Error finalizing Stage 3 auction ${auction._id}:`,
                        err.message
                    );
                }
            }

            // ---------------- STAGE FALLBACK ----------------

            for (const auction of fallbackAuctions) {
                try {
                    const bids = await Bid.find({ auctionId: auction._id })
                        .sort({ amount: -1, createdAt: 1 })
                        .limit(3)
                        .populate(
                            "userId",
                            "fullName email badRecords auctionRestriction"
                        );

                    if (auction.winnerClaimed === false) {
                        console.log(
                            `4️⃣ Auction ${auction} was unclaimed and about to return BACK TO inventory`
                        );
                        auction.status = "UNCLAIMED";
                        auction.claimStage = 4;
                        auction.claimDeadline = null;
                        auction.winnerNotified = "No notification claim";
                        auction.winner = null;
                        auction.finalized = true;

                        const thirdBidder = bids[2]?.userId || null;

                        if (thirdBidder) {
                            thirdBidder.badRecords += 1;

                            if (thirdBidder.badRecords >= MAX_BAD_RECORDS) {
                                thirdBidder.auctionRestriction = true;
                                console.log(
                                    `User ${thirdBidder.fullName} reached max bad records and is now restricted.`
                                );
                            }
                            await thirdBidder.save();
                        } else {
                            console.log(
                                "No 3rd bidder — skipping bad record increment."
                            );
                        }

                        if (thirdBidder)
                            await createNotification(
                                thirdBidder._id,
                                auction._id,
                                false,
                                `You failed to claim "${auction.inventoryId?.productName}". You can no longer purchase the item.`,
                                "Claim Period Expired"
                            );

                        await auction.save();

                        const inventoryItem = await Inventory.findById(
                            auction.inventoryId
                        );
                        if (inventoryItem) {
                            inventoryItem.status = "available";
                            await inventoryItem.save();
                        }
                        console.log(`3️⃣ 📧Notification sending is now CLOSED`);
                        console.log(
                            `4️⃣ Auction ${auction} has RETURNED to inventory`
                        );
                    } else continue;
                } catch (err) {
                    console.error(
                        `Error finalizing Stage 3 auction ${auction._id}:`,
                        err.message
                    );
                }
            }

            // ---------------- STAGE FINALIZE CLAIM ----------------

            for (const auction of claimedAuctions) {
                try {
                    const bids = await Bid.find({ auctionId: auction._id })
                        .sort({ amount: -1, createdAt: 1 })
                        .limit(3)
                        .populate("userId", "fullName email");

                    if (auction.winnerNotified === "Top1") {
                        if (bids[0])
                            await createNotification(
                                bids[0].userId._id,
                                auction._id,
                                false,
                                `Auction item "${auction.inventoryId?.productName}" has been added to your orders and ready to be processed. Thank you for choosing us!`,
                                "Auction Order Completed"
                            );
                        if (bids[1])
                            await createNotification(
                                bids[1].userId._id,
                                auction._id,
                                false,
                                `The auction item "${auction.inventoryId?.productName}" has been claimed. Claiming chances is closed`,
                                "Auction Claiming Closed"
                            );
                        if (bids[2])
                            await createNotification(
                                bids[2].userId._id,
                                auction._id,
                                false,
                                `The auction item "${auction.inventoryId?.productName}" has been claimed. Claiming chances is closed`,
                                "Auction Claiming Closed"
                            );
                        console.log(
                            `2️⃣ Auction ${auction} has been CLAIMED by TOP 1 / WINNER 1`
                        );
                        console.log(
                            `2️⃣ 📧📧Notification sent to TOP 2 and TOP 3`
                        );
                    } else if (auction.winnerNotified === "Top2") {
                        if (bids[1])
                            await createNotification(
                                bids[1].userId._id,
                                auction._id,
                                `Auction item "${auction.inventoryId?.productName}" has been added to your orders and ready to be processed. Thank you for choosing us!`,
                                "Auction Order Completed"
                            );
                        if (bids[2])
                            await createNotification(
                                bids[2].userId._id,
                                auction._id,
                                `The auction item "${auction.inventoryId?.productName}" has been claimed. Claiming chances is closed`,
                                "Auction Claiming Closed"
                            );
                        console.log(
                            `3️⃣ Auction ${auction} has been CLAIMED by TOP 2 / WINNER 2`
                        );
                        console.log(`3️⃣ 📧📧Notification sent to TOP 3`);
                    }
                    auction.finalized = true;
                    auction.status = "COMPLETED";
                    await auction.save();

                    console.log(
                        `5️⃣ Auction ${auction} successfully CLAIMED, FINALIZED and COMPLETED`
                    );
                } catch (err) {
                    console.error(
                        `Error finalizing Stage 5 auction ${auction._id}:`,
                        err.message
                    );
                }
            }
        } catch (err) {
            console.error("Error fetching ended auctions:", err.message);
        }
    });
};
