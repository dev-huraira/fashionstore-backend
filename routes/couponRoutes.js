import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import Coupon from '../models/Coupon.js';

const router = express.Router();

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Create coupon (admin)
// @route   POST /api/coupons
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { code, discount, expiryDate, active } = req.body;
        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) return res.status(400).json({ message: 'Coupon code already exists' });
        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discount,
            expiryDate,
            active: active !== undefined ? active : true,
        });
        res.status(201).json(coupon);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Update coupon (admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Delete coupon (admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json({ message: 'Coupon deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Validate coupon code (public — used at checkout)
// @route   POST /api/coupons/validate
// @access  Private
router.post('/validate', protect, async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
        if (!coupon) return res.status(404).json({ message: 'Invalid or expired coupon code' });
        if (new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({ message: 'This coupon has expired' });
        }
        res.json({ code: coupon.code, discount: coupon.discount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
