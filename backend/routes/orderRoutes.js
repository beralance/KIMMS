// backend/routes/orderRoutes.js
import express from "express";
import {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
} from "../controllers/orderController.js";
import { verifyToken, adminOnly, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied: Admins only" });
    }
    next();
};

// Create a new order (user must be logged in)
router.post("/", verifyToken, createOrder);

// Get orders
// - If admin: all orders
// - If user: only their orders
router.get("/", verifyToken, getOrders);

// Get a single order (must be owner or admin)
router.get("/:id", verifyToken, getOrder);

// Update order status (admin and staff)
router.patch("/:id/status", verifyToken, requireRole(['admin', 'staff']), updateOrderStatus);

export default router;
