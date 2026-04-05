import express from 'express';
import {
    registerUser,
    loginUser,
    adminLogin,
    logoutUser,
    getMe,
    updateMe,
    changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { userLoginLimiter, adminLoginLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', userLoginLimiter, loginUser);
router.post('/admin-login', adminLoginLimiter, adminLogin);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/change-password', protect, changePassword);

export default router;
