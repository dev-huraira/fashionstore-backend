import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    const token = req.cookies?.auth_token;

    if (!token || token === 'null' || token === 'undefined' || !token.includes('.')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        try {
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) return res.status(401).json({ message: 'User not found' });
            return next();
        } catch (dbError) {
            console.error('Database error in auth middleware:', dbError.message);
            return res.status(500).json({ message: 'Database connection error during authentication' });
        }
    } catch (error) {
        console.error('JWT error:', error.message);
        return res.status(401).json({ message: 'Session expired or invalid token. Please log in again.' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
