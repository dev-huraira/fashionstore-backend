import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fashion_ecommerce');
        const users = await User.find({});
        console.log('--- Current Users ---');
        for (const user of users) {
            // We can't see plain password, but we can verify against '123456'
            const isMatch = await bcrypt.compare('123456', user.password);
            console.log(`Name: ${user.name}, Email: ${user.email}, Role: ${user.role}, PwdMatch123456: ${isMatch}`);
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
