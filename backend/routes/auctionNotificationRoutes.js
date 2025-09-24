import express from "express";
import { getUserNotifications, markAsRead } from "../controllers/auctionNotificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getUserNotifications);
router.patch("/:id/read", verifyToken, markAsRead);

export default router;
