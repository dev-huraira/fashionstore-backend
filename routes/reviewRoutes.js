import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true }); // mergeParams to get :productId

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Submit a review
// @route   POST /api/products/:productId/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;

        // Check if user already reviewed this product
        const existing = await Review.findOne({ product: productId, user: req.user._id });
        if (existing) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = await Review.create({
            product: productId,
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        });

        // Recalculate product average rating
        const allReviews = await Review.find({ product: productId });
        const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        await Product.findByIdAndUpdate(productId, {
            averageRating: Math.round(avg * 10) / 10,
            numReviews: allReviews.length,
        });

        res.status(201).json(review);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }
        res.status(500).json({ message: err.message });
    }
});

// @desc    Delete a review (owner or admin)
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private
router.delete('/:reviewId', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await review.deleteOne();

        // Recalculate
        const allReviews = await Review.find({ product: req.params.productId });
        const avg = allReviews.length ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length : 0;
        await Product.findByIdAndUpdate(req.params.productId, {
            averageRating: Math.round(avg * 10) / 10,
            numReviews: allReviews.length,
        });

        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
