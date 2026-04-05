import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create a Stripe PaymentIntent
// @route   POST /api/payment/create-intent
// @access  Private
router.post('/create-intent', protect, async (req, res) => {
    try {
        // Dynamically import stripe to avoid crashing if not installed
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) {
            return res.status(500).json({ message: 'Stripe is not configured. Add STRIPE_SECRET_KEY to your .env file.' });
        }

        const stripe = (await import('stripe')).default(stripeKey);
        const { amount } = req.body; // amount in cents

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // convert dollars to cents
            currency: 'usd',
            metadata: { userId: req.user._id.toString() },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
