import express from "express";
import {
  createAuction,
  getAuctions,
  getAuctionById,
  deletePendingAuction,
  finalizeAuction,
  claimAuctionItem,
  confirmAuctionDelivery,
  getPastAuctions,
} from "../controllers/auctionController.js";

import { verifyToken, adminOnly, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, adminOnly, requireRole(['admin']), createAuction);

router.get("/", getAuctions);

router.get('/history/past', getPastAuctions)

router.get("/:id", getAuctionById);

router.delete('/:id', verifyToken, deletePendingAuction)

router.delete('/:id/deliver', verifyToken, confirmAuctionDelivery)
router.post('/:id/claim', verifyToken, claimAuctionItem)

router.post("/:id/finalize", verifyToken, adminOnly, requireRole(['admin']), finalizeAuction);

// Public route to get auction history


export default router;
