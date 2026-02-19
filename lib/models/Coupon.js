import mongoose from 'mongoose'

const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    discount: { type: Number, required: true },
    forNewUser: { type: Boolean, required: true },
    forMember: { type: Boolean, default: false },
    isPublic: { type: Boolean, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true })

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema)
