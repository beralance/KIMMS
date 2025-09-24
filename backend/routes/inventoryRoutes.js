// backend/routes/productRoutes.js
import express from "express";
import upload from "../middleware/upload.js";
import Inventory from "../models/Inventory.js"; // <-- add this
import { 
    createInventoryItem, 
    getInventoryItems, 
    getInventoryItemById, 
    updateInventoryItem, 
    deleteInventoryItem 
} from "../controllers/inventoryController.js";
import { verifyToken, adminOnly, requireRole } from '../middleware/authMiddleware.js'

const router = express.Router();

// PATCH /api/inventory/:id/status
router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body; // e.g., "sold" or "available"
        const inventory = await Inventory.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!inventory) return res.status(404).json({ error: "Inventory not found" });
        res.json(inventory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update inventory status" });
    }
});

router.post("/", upload.array("images"), verifyToken, requireRole(['admin', 'staff']), createInventoryItem);
router.get("/", getInventoryItems);
router.get("/:id", getInventoryItemById);
router.put("/:id", verifyToken, requireRole(['admin', 'staff']), upload.single("images"), updateInventoryItem);
router.delete("/:id", verifyToken, adminOnly, requireRole(['admin']), deleteInventoryItem);

export default router;
