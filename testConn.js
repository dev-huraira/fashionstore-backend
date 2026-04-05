import mongoose from 'mongoose';

const uri = "mongodb+srv://huraira:MyPass123@cluster0.zenqe7r.mongodb.net/fashion_ecommerce?retryWrites=true&w=majority&appName=Cluster0";

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
