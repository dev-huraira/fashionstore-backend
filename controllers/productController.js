import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const category = req.query.category ? { category: req.query.category } : {};
        const subCategory = req.query.subCategory ? { subCategory: req.query.subCategory } : {};

        const products = await Product.find({ ...keyword, ...category, ...subCategory });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const { name, price, description, images, category, subCategory, variants, sizes, colors, features, discount } = req.body;

        const product = new Product({
            name: name || 'Sample name',
            price: price || 0,
            user: req.user._id,
            images: images || [],
            category: category || 'Sample category',
            subCategory: subCategory || '',
            description: description || 'Sample description',
            variants: variants || [],
            sizes: sizes || [],
            colors: colors || [],
            features: features || [],
            discount: discount || 0
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            images,
            category,
            subCategory,
            variants,
            sizes,
            colors,
            features,
            discount,
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name === undefined ? product.name : name;
            product.price = price === undefined ? product.price : price;
            product.description = description === undefined ? product.description : description;
            product.images = images === undefined ? product.images : images;
            product.category = category === undefined ? product.category : category;
            product.subCategory = subCategory === undefined ? product.subCategory : subCategory;
            product.variants = variants === undefined ? product.variants : variants;
            product.sizes = sizes === undefined ? product.sizes : sizes;
            product.colors = colors === undefined ? product.colors : colors;
            product.features = features === undefined ? product.features : features;
            product.discount = discount === undefined ? product.discount : discount;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
