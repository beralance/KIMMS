import express from "express";
import upload from "../middleware/upload.js";
import Inventory from "../models/Inventory.js";
import { 
    createInventoryItem, 
    getInventoryItems, 
    getInventoryItemById, 
    updateInventoryItem, 
    deleteInventoryItem 
} from "../controllers/inventoryController.js";
import { verifyToken, adminOnly, requireRole } from '../middleware/authMiddleware.js'
import multer from "multer";

const router = express.Router();

router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
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

router.post("/", (req,res,next) => {
    upload.array('images')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({error: 'File too large. Max 50MB allowed'})
            }
            return res.status(400).json({error: err.message})
        }
        else if (err) {
            return res.status(500).json({error: 'Server error during file upload.'})
        }
        next();
    })
}, verifyToken, requireRole(['admin', 'staff']), createInventoryItem);
router.get("/", getInventoryItems);
router.get("/:id", getInventoryItemById);
router.put("/:id", (req, res, next) => {
    upload.array('images')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({error: 'File too large. Max 50MB allowed'})
            }
            return res.status(400).json({error: err.message})
        }
        else if (err) {
            return res.status(500).json({error: 'Server error during file upload.'})
        }
        next();
    })
}, verifyToken, requireRole(['admin', 'staff']), updateInventoryItem);
router.delete("/:id", verifyToken, adminOnly, requireRole(['admin']), deleteInventoryItem);

export default router;
