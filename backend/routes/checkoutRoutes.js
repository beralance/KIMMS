// routes/checkout.js
import express from "express";
import { handleCheckout, handleCodCheckout } from "../controllers/checkoutController.js";

const router = express.Router();
router.post("/", handleCheckout);
router.post('/cod', handleCodCheckout)
export default router;
