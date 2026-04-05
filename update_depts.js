import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const updateProductDept = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const product = await Product.findOne({ name: 'ss' });
        if (product) {
            product.subCategory = 'Tops & Tees';
            await product.save();
            console.log('Product "ss" updated to subCategory: Tops & Tees');
        } else {
            console.log('Product "ss" not found');
        }

        const product2 = await Product.findOne({ name: 'eeeee' });
        if (product2) {
            product2.subCategory = 'Bottoms';
            await product2.save();
            console.log('Product "eeeee" updated to subCategory: Bottoms');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateProductDept();
