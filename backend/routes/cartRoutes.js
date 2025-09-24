import express from "express";
import {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    removePurchased,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
// Protect all routes with JWT
router.use(verifyToken);

router.get("/", getCart);              // GET /api/cart
router.post("/", addToCart);           // POST /api/cart
router.delete("/clear", clearCart);    // DELETE /api/cart/clear
router.delete('/remove-purchased', removePurchased)
router.delete("/:productId", removeFromCart); // DELETE /api/cart/:productId
export default router;
