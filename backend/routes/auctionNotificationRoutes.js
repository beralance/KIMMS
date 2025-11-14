import express from "express";
import {
    getUserNotifications,
    hasRead,
    markAsRead,
} from "../controllers/auctionNotificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getUserNotifications);
router.patch("/:id/read", verifyToken, markAsRead);
router.get("/has-unread", verifyToken, hasRead);

export default router;
