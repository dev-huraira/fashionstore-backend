// This file is for local testing only — credentials must be in .env
// Run: node testConn.js (with .env loaded)
import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;
if (!uri) { console.error('MONGO_URI not set in .env'); process.exit(1); }

console.log('Test connecting...');
mongoose.connect(uri)
    .then(() => {
        console.log('SUCCESS_CONNECTED');
        process.exit(0);
    })
    .catch(err => {
        console.error('ERROR_CONNECTING:', err.message);
        process.exit(1);
    });
