import express from "express";
import {
  createAuction,
  getAuctions,
  getAuctionById,
  // updateAuction,   // Optional: only for pre-auction editing
  // deleteAuction,   // Optional: only for pre-auction deletion
  finalizeAuction,
  getPastAuctions,
} from "../controllers/auctionController.js";

import { verifyToken, adminOnly, requireRole } from "../middleware/authmiddleware.js";

const router = express.Router();

// Admin: create new auction
router.post("/", verifyToken, adminOnly, requireRole(['admin']), createAuction);

// Public: list all auctions (active, upcoming, closed)
router.get("/", getAuctions);

// Public: get single auction by ID
router.get("/:id", getAuctionById);

// Optional: admin manual finalize (override)
router.post("/:id/finalize", verifyToken, adminOnly, requireRole(['admin']), finalizeAuction);

// Public route to get auction history
router.get('/history/past', getPastAuctions)

export default router;
