
import express from 'express'
const router = express.Router();
import axios from 'axios'
import Payment from '../models/Payment.js'

const PAYMONGO_SECRET = process.env.PAYMONGO_SECRET_KEY
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Create a checkout session
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { amount } = req.body // amount in centavos
        const payload = {
            data: {
                attributes: {
                    line_items: [
                        {
                            name: 'Demo purchase',
                            amount: amount,
                            currency: 'PHP',
                            quantity: 1
                        }
                    ],
                    payment_method_types: ['gcash','card'],
                    success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${FRONTEND_URL}/cancel`
                }
            }
        }
        const auth = Buffer.from(PAYMONGO_SECRET + ':').toString('base64')
        const resp = await axios.post('https://api.paymongo.com/v1/checkout_sessions', payload, {
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        })
        const session = resp.data.data;

        // Save minimal record
        await Payment.create({ paymongoId: session.id, amount})

        // Return checkout URL to frontend
        res.json({ checkout_url: session.attributes.checkout_url})
    }
    catch (err) {
        if (err.response) {
            console.error("PayMongo error:", err.response.status, err.response.data);
        } else {
            console.error("Server error:", err.message);
        }
        res.status(500).json({ error: 'Could not create checkout session' });
    }
});


router.post('/webhook', express.json(), async (req, res) => {
    try {
        const event = req.body
        const eventId = event.id
        const type = event.type

        // Example: event.data contains resource info. We guard to avoid reprocessing.
        const resource = event.data?.resource || {}
        const relatedCheckout = resource.id || resource.attributes?.checkout_session_id || null;

        //try to find the Payment by a few fields
        const payment = await Payment.findOne({paymongoId: relatedCheckout}) ||
                        await Payment.findOne({ 'eventIds': { $in: [eventId]}})

        // if not found, optionally create a new record
        if (!payment) {
            await Payment.create({ paymongoId: relatedCheckout || eventId, status: type, eventIds: [eventId]})
            return res.status(200).send('created');
        }

        // Idempotency: if event already processed, return 200
        if (payment.eventIds?.includes(eventId)) return res.status(200).send('already processed')

        // Update payment status depending on event type
        payment.status = type;
        payment.eventIds = payment.eventIds || []
        payment.eventIds.push(eventId)
        await payment.save();
        res.status(200).send('ok')
    }
    catch (err) {
        console.error('webhook error', err.message || err)
        res.status(500).send('error')
    }
})
export default router;