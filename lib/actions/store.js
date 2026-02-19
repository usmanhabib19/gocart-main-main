'use server'
import { auth } from '@clerk/nextjs/server'
import connectDB from '../mongodb'
import Store from '../models/Store'
import User from '../models/User'

export async function createStore(data) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    await connectDB()

    // Check if user already has a store
    const existing = await Store.findOne({ userId })
    if (existing) throw new Error('You already have a store')

    const store = await Store.create({
        ...data,
        userId,
        status: 'pending',
        isActive: false,
    })

    return {
        ...store.toObject(),
        _id: store._id.toString(),
        id: store._id.toString(),
        createdAt: store.createdAt ? store.createdAt.toISOString() : null,
        updatedAt: store.updatedAt ? store.updatedAt.toISOString() : null
    }
}

export async function getStoreByUserId() {
    const { userId } = await auth()
    if (!userId) return null

    await connectDB()
    const store = await Store.findOne({ userId }).lean()
    if (!store) return null
    return {
        ...store,
        _id: store._id.toString(),
        id: store._id.toString(),
        createdAt: store.createdAt ? store.createdAt.toISOString() : null,
        updatedAt: store.updatedAt ? store.updatedAt.toISOString() : null
    }
}

export async function getStoreByUsername(username) {
    await connectDB()
    const store = await Store.findOne({ username }).lean()
    if (!store) return null

    const user = await User.findById(store.userId).lean()
    return {
        ...store,
        _id: store._id.toString(),
        id: store._id.toString(),
        createdAt: store.createdAt ? store.createdAt.toISOString() : null,
        updatedAt: store.updatedAt ? store.updatedAt.toISOString() : null,
        user: user ? {
            ...user,
            _id: user._id.toString(),
            id: user._id.toString(),
            createdAt: user.createdAt ? user.createdAt.toISOString() : null,
            updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null
        } : null,
    }
}

export async function getAllStores() {
    await connectDB()
    const stores = await Store.find().sort({ createdAt: -1 }).lean()

    const userIds = stores.map(s => s.userId)
    const users = await User.find({ _id: { $in: userIds } }).lean()
    const userMap = {}
    users.forEach(u => { userMap[u._id.toString()] = u })

    return stores.map(s => ({
        ...s,
        _id: s._id.toString(),
        id: s._id.toString(),
        createdAt: s.createdAt ? s.createdAt.toISOString() : null,
        updatedAt: s.updatedAt ? s.updatedAt.toISOString() : null,
        user: userMap[s.userId] ? {
            ...userMap[s.userId],
            _id: userMap[s.userId]._id.toString(),
            id: userMap[s.userId]._id.toString(),
            createdAt: userMap[s.userId].createdAt ? userMap[s.userId].createdAt.toISOString() : null,
            updatedAt: userMap[s.userId].updatedAt ? userMap[s.userId].updatedAt.toISOString() : null
        } : null,
    }))
}

export async function updateStoreStatus(storeId, status) {
    await connectDB()
    const isActive = status === 'approved'
    const store = await Store.findByIdAndUpdate(storeId, { status, isActive }, { new: true }).lean()
    if (!store) return null
    return {
        ...store,
        _id: store._id.toString(),
        id: store._id.toString(),
        createdAt: store.createdAt ? store.createdAt.toISOString() : null,
        updatedAt: store.updatedAt ? store.updatedAt.toISOString() : null
    }
}

export async function deleteStore(id) {
    await connectDB()
    await Store.findByIdAndDelete(id)
    return { success: true }
}

export async function updateStore(data) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    await connectDB()
    const store = await Store.findOneAndUpdate({ userId }, data, { new: true }).lean()
    if (!store) throw new Error('Store not found')

    return {
        ...store,
        _id: store._id.toString(),
        id: store._id.toString(),
        createdAt: store.createdAt ? store.createdAt.toISOString() : null,
        updatedAt: store.updatedAt ? store.updatedAt.toISOString() : null
    }
}
