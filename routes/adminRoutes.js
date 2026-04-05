import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { adminLogger } from '../middleware/adminLogger.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

const router = express.Router();

// Apply auth + admin check + logging to every admin route
router.use(protect, admin, adminLogger);

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalCoupons = await Coupon.countDocuments();

        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email');

        res.json({ totalOrders, totalProducts, totalUsers, totalCoupons, totalRevenue, recentOrders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id
router.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: req.body.role },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
