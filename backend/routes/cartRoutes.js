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
router.use(verifyToken);

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/clear", clearCart);
router.delete('/remove-purchased', removePurchased)
router.delete("/:productId", removeFromCart); 
export default router;
