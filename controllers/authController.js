import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || '',
            role: 'user', // Registration always creates a user, never an admin
        });

        if (user) {
            const token = generateToken(user._id);
            res.cookie('auth_token', token, COOKIE_OPTIONS);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    User login (users only — admins must use /api/auth/admin-login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        res.cookie('auth_token', token, COOKIE_OPTIONS);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin-only login — rejects if role !== admin
// @route   POST /api/auth/admin-login
// @access  Public (rate limited)
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const timestamp = new Date().toISOString();

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log(`[ADMIN LOGIN FAILED] ${email} | ${timestamp} | Reason: Invalid credentials`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.role !== 'admin') {
            console.log(`[ADMIN LOGIN DENIED] ${email} | ${timestamp} | Reason: Not an admin`);
            return res.status(403).json({ message: 'Access denied. Admin accounts only.' });
        }

        console.log(`[ADMIN LOGIN SUCCESS] ${email} | ${timestamp}`);

        const token = generateToken(user._id);
        // Set both the general auth cookie and an admin-specific cookie for the middleware
        res.cookie('auth_token', token, COOKIE_OPTIONS);
        res.cookie('admin_session', '1', {
            httpOnly: false, // needs to be readable by Next.js middleware
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 4 * 60 * 60 * 1000, // 4 hours
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout — clear cookies
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
    res.clearCookie('auth_token', { httpOnly: true, sameSite: 'strict', path: '/' });
    res.clearCookie('admin_session', { sameSite: 'strict', path: '/' });
    res.json({ message: 'Logged out successfully' });
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update logged in user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (email && email !== user.email) {
            const exists = await User.findOne({ email });
            if (exists) return res.status(400).json({ message: 'Email already in use' });
            user.email = email;
        }
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;

        await user.save();
        res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
