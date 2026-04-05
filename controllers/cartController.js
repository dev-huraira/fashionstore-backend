import Cart from '../models/Cart.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images');

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
    try {
        const { productId, size, color, quantity, price } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const existItem = cart.items.find((item) => item.product.toString() === productId && item.size === size && item.color === color);

        if (existItem) {
            existItem.quantity += Number(quantity);
        } else {
            cart.items.push({ product: productId, size, color, quantity: Number(quantity), price: Number(price) });
        }

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price images');
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.id(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        item.quantity = Number(quantity);
        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price images');
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
            await cart.save();

            const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price images');
            res.json(updatedCart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
