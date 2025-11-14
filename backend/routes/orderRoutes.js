// backend/routes/orderRoutes.js
import express from "express";
import {
    createOrder,
    getOrders,
    searchOrder,
    getOrder,
    getOrdersForPolling,
    cancelOrder,
    updateOrderStatus,
} from "../controllers/orderController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get('/polling', getOrdersForPolling)
router.get('/search', verifyToken, requireRole(['admin', 'staff']), searchOrder)
router.get("/:id", verifyToken, getOrder);
router.patch("/:id/status", verifyToken, requireRole(['admin', 'staff']), updateOrderStatus);
router.patch('/:id/cancel', verifyToken, requireRole(['admin', 'user']), cancelOrder)
export default router;
