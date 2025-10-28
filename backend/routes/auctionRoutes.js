import express from "express";
import {
  createAuction,
  getAuctions,
  getAuctionById,
  deletePendingAuction,
  // updateAuction,   // Optional: only for pre-auction editing
  // deleteAuction,   // Optional: only for pre-auction deletion
  finalizeAuction,
  getPastAuctions,
} from "../controllers/auctionController.js";

import { verifyToken, adminOnly, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin: create new auction
router.post("/", verifyToken, adminOnly, requireRole(['admin']), createAuction);

// Public: list all auctions (active, upcoming, closed)
router.get("/", getAuctions);

router.get('/history/past', getPastAuctions)

// Public: get single auction by ID
router.get("/:id", getAuctionById);

router.delete('/:id', verifyToken, deletePendingAuction)

// Optional: admin manual finalize (override)
router.post("/:id/finalize", verifyToken, adminOnly, requireRole(['admin']), finalizeAuction);

// Public route to get auction history


export default router;
