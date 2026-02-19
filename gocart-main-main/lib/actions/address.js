'use server'
import { auth } from '@clerk/nextjs/server'
import connectDB from '../mongodb'
import Address from '../models/Address'

export async function createAddress(data) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    await connectDB()
    const address = await Address.create({ ...data, userId })
    return { ...address.toObject(), _id: address._id.toString(), id: address._id.toString() }
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
    }))
}
