import Notification from "../models/AuctionNotification.js";

// Create a new notification
export const createNotification = async (userId, auctionId, message) => {
    try {
        const notif = new Notification({ userId, auctionId, message });
        await notif.save();
        return notif;
    } catch (err) {
        console.error("Error creating notification:", err.message);
    }
};

// Get notifications for a user
export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
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
