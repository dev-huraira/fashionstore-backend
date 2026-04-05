import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const email = 'ms4824427@gmail.com';

const check = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            console.log('USER_FOUND: ' + JSON.stringify({ email: user.email, role: user.role }));
        } else {
            console.log('USER_NOT_FOUND');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

check();
