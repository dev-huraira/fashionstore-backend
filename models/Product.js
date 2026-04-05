import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
    size: { type: String, required: true },
    color: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    price: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    description: { type: String, required: true },
    features: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    images: [{ type: String }],
    variants: [variantSchema],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
