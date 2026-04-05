import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const dumpProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({});
        console.log(JSON.stringify(products, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

dumpProducts();
