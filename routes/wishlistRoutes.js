import express from 'express';
import Wishlist from '../models/Wishlist.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('products');
        res.json(wishlist ? wishlist.products : []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
router.post('/:productId', protect, async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [req.params.productId] });
        } else {
            if (!wishlist.products.includes(req.params.productId)) {
                wishlist.products.push(req.params.productId);
                await wishlist.save();
            }
        }
        res.json({ message: 'Added to wishlist' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        if (wishlist) {
            wishlist.products = wishlist.products.filter(
                id => id.toString() !== req.params.productId
            );
            await wishlist.save();
        }
        res.json({ message: 'Removed from wishlist' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
