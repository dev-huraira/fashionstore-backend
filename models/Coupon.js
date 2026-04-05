import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true }, // Percentage discount
    expiryDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
