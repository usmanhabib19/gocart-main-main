'use server'
import { auth } from '@clerk/nextjs/server'
import connectDB from '../mongodb'
import Rating from '../models/Rating'
import User from '../models/User'
import Product from '../models/Product'

export async function createRating(data) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    await connectDB()
    const rating = await Rating.create({ ...data, userId })
    return {
        ...rating.toObject(),
        _id: rating._id.toString(),
        id: rating._id.toString(),
        createdAt: rating.createdAt ? rating.createdAt.toISOString() : null,
        updatedAt: rating.updatedAt ? rating.updatedAt.toISOString() : null
    }
}

export async function getRatingsByProductId(productId) {
    await connectDB()
    const ratings = await Rating.find({ productId }).sort({ createdAt: -1 }).lean()

    const userIds = ratings.map(r => r.userId)
    const users = await User.find({ _id: { $in: userIds } }).lean()
    const userMap = {}
    users.forEach(u => { userMap[u._id.toString()] = u })

    const productIds = [...new Set(ratings.map(r => r.productId))]
    const products = await Product.find({ _id: { $in: productIds } }).lean()
    const productMap = {}
    products.forEach(p => { productMap[p._id.toString()] = p })

    return ratings.map(r => ({
        ...r,
        _id: r._id.toString(),
        id: r._id.toString(),
        createdAt: r.createdAt ? r.createdAt.toISOString() : null,
        updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
        user: userMap[r.userId] ? {
            ...userMap[r.userId],
            _id: userMap[r.userId]._id.toString(),
            id: userMap[r.userId]._id.toString()
        } : null,
        product: productMap[r.productId] ? {
            ...productMap[r.productId],
            _id: productMap[r.productId]._id.toString(),
            id: productMap[r.productId]._id.toString()
        } : null,
    }))
}

export async function getRatingsByUserId() {
    const { userId } = await auth()
    if (!userId) return []

    await connectDB()
    const ratings = await Rating.find({ userId }).sort({ createdAt: -1 }).lean()

    return ratings.map(r => ({
        ...r,
        _id: r._id.toString(),
        id: r._id.toString(),
        createdAt: r.createdAt ? r.createdAt.toISOString() : null,
        updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
    }))
}
