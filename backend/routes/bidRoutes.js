import express from "express";
import { placeBid, getBidsByAuction } from "../controllers/bidController.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Place bid (user must be logged in)
router.post("/", verifyToken, placeBid);

// ✅ Get all bids for an auction (admin only for audit/finalization)
router.get("/:auctionId", verifyToken, getBidsByAuction);

export default router;
