'use server'
import { auth } from '@clerk/nextjs/server'
import connectDB from '../mongodb'
import Address from '../models/Address'

export async function createAddress(data) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    await connectDB()
    const address = await Address.create({ ...data, userId })
    return {
        ...address.toObject(),
        _id: address._id.toString(),
        id: address._id.toString(),
        createdAt: address.createdAt ? address.createdAt.toISOString() : null,
        updatedAt: address.updatedAt ? address.updatedAt.toISOString() : null
    }
}

export async function getAddressesByUserId() {
    const { userId } = await auth()
    if (!userId) return []

    await connectDB()
    const addresses = await Address.find({ userId }).sort({ createdAt: -1 }).lean()
    return addresses.map(a => ({
        ...a,
        _id: a._id.toString(),
        id: a._id.toString(),
        createdAt: a.createdAt ? a.createdAt.toISOString() : null,
        updatedAt: a.updatedAt ? a.updatedAt.toISOString() : null,
    }))
}

export async function updateAddress(id, data) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    await connectDB()
    const address = await Address.findOneAndUpdate({ _id: id, userId }, data, { new: true }).lean()
    if (!address) throw new Error('Address not found')

    return {
        ...address,
        _id: address._id.toString(),
        id: address._id.toString(),
        createdAt: address.createdAt ? address.createdAt.toISOString() : null,
        updatedAt: address.updatedAt ? address.updatedAt.toISOString() : null,
    }
}

export async function deleteAddress(id) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    await connectDB()
    const result = await Address.findOneAndDelete({ _id: id, userId })
    if (!result) throw new Error('Address not found')

    return { success: true }
}
