import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address: node promoteUser.js example@email.com');
    process.exit(1);
}

const promote = async () => {
    try {
        console.log('MONGO_URI from env:', process.env.MONGO_URI ? 'Defined' : 'UNDEFINED');
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            console.error('User not found');
        } else {
            console.log(`User ${user.email} promoted to admin successfully!`);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

promote();
