'use server'
import connectDB from '../mongodb'
import Coupon from '../models/Coupon'

export async function createCoupon(data) {
    await connectDB()
    const coupon = await Coupon.create(data)
    return {
        ...coupon.toObject(),
        _id: coupon._id.toString(),
        id: coupon._id.toString(),
        createdAt: coupon.createdAt ? coupon.createdAt.toISOString() : null,
        updatedAt: coupon.updatedAt ? coupon.updatedAt.toISOString() : null,
        expiresAt: coupon.expiresAt ? coupon.expiresAt.toISOString() : null,
    }
}

export async function getAllCoupons() {
    await connectDB()
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean()
    return coupons.map(c => ({
        ...c,
        _id: c._id.toString(),
        id: c._id.toString(),
        createdAt: c.createdAt ? c.createdAt.toISOString() : null,
        updatedAt: c.updatedAt ? c.updatedAt.toISOString() : null,
        expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
    }))
}

export async function validateCoupon(code) {
    await connectDB()
    const coupon = await Coupon.findOne({ code }).lean()
    if (!coupon) return { valid: false, message: 'Invalid coupon code' }
    if (new Date(coupon.expiresAt) < new Date()) return { valid: false, message: 'Coupon has expired' }
    return {
        valid: true,
        coupon: {
            ...coupon,
            _id: coupon._id.toString(),
            id: coupon._id.toString(),
            createdAt: coupon.createdAt ? coupon.createdAt.toISOString() : null,
            updatedAt: coupon.updatedAt ? coupon.updatedAt.toISOString() : null,
            expiresAt: coupon.expiresAt ? coupon.expiresAt.toISOString() : null,
        },
    }
}

export async function deleteCoupon(code) {
    await connectDB()
    await Coupon.findOneAndDelete({ code })
    return { success: true }
}
