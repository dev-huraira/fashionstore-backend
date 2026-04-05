import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/addresses – list addresses for current user
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('addresses');
        res.json(user.addresses || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/addresses – add new address
router.post('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { fullName, phone, address, city, postalCode, country, isDefault } = req.body;

        // If new address is default, clear existing defaults
        if (isDefault) {
            user.addresses.forEach(a => { a.isDefault = false; });
        }

        // If no addresses yet, make first one default
        const makeDefault = isDefault || user.addresses.length === 0;

        user.addresses.push({ fullName, phone, address, city, postalCode, country, isDefault: makeDefault });
        await user.save();
        res.status(201).json(user.addresses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/addresses/:id – update address
router.put('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const addr = user.addresses.id(req.params.id);
        if (!addr) return res.status(404).json({ message: 'Address not found' });

        const { fullName, phone, address, city, postalCode, country, isDefault } = req.body;

        if (isDefault) {
            user.addresses.forEach(a => { a.isDefault = false; });
        }

        if (fullName !== undefined) addr.fullName = fullName;
        if (phone !== undefined) addr.phone = phone;
        if (address !== undefined) addr.address = address;
        if (city !== undefined) addr.city = city;
        if (postalCode !== undefined) addr.postalCode = postalCode;
        if (country !== undefined) addr.country = country;
        if (isDefault !== undefined) addr.isDefault = isDefault;

        await user.save();
        res.json(user.addresses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/addresses/:id – delete address
router.delete('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const addr = user.addresses.id(req.params.id);
        if (!addr) return res.status(404).json({ message: 'Address not found' });

        addr.deleteOne();

        // If deleted address was default, make first remaining the default
        if (addr.isDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        res.json(user.addresses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
