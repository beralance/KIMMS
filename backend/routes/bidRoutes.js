import express from "express";
import {
    placeBid,
    getBidsByAuction,
    cancelBid,
} from "../controllers/bidController.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, placeBid);
router.post("/cancel", verifyToken, cancelBid);
router.get("/:auctionId", verifyToken, getBidsByAuction);

export default router;
