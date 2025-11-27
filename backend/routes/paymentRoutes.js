// routes/paymentRoutes.js
import express from 'express';
import { createCheckoutSession, cancelPayment, getPaymentStatus} from '../controllers/paymentController.js';
import { handleWebhook } from '../controllers/webhookController.js';

const router = express.Router();

router.post('/cancel', cancelPayment)
router.post('/create-checkout-session', createCheckoutSession);
router.post('/webhook', handleWebhook);
router.get("/status/:orderId", getPaymentStatus);



export default router;
