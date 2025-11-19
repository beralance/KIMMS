import Notification from "../models/AuctionNotification.js";

// Create a new notification
export const createNotification = async (userId, auctionId, message, label) => {
    try {
        const notif = new Notification({ userId, auctionId, message, label });
        await notif.save();
        return notif;
    } catch (err) {
        console.error("Error creating notification:", err.message);
    }
};

// Get notifications for a user
export const getUserNotifications = async (req, res) => {
    console.log("USER ID", req.user.id);
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .populate({
                path: "auctionId",
                select: "inventoryId claimDeadline winnerClaimed startPrice reservePrice startTime endTime status description finalized createdAt updatedAt winner",
                populate: {
                    path: "inventoryId",
                    select: "productName condition isLocal category description details images",
                    populate: {
                        path: "category",
                        select: "name",
                    },
                },
            })
            .sort({ read: 1, createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ message: "Notification marked as read" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const hasRead = async (req, res) => {
    const userId = req.user.id;

    if (!userId) return;
    try {
        const unreadNotif = await Notification.find({
            userId: userId,
            read: false,
        });
        const hasUnread = unreadNotif.length > 0;

        return res.status(200).json({ hasUnread });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", err });
    }
};
