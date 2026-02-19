'use server'
import { auth, currentUser } from '@clerk/nextjs/server'
import connectDB from '../mongodb'
import User from '../models/User'

export async function getCurrentUser() {
    const { userId } = await auth()
    if (!userId) return null

    await connectDB()
    const user = await User.findById(userId).lean()
    if (!user) return null
    return {
        ...user,
        _id: user._id.toString(),
        id: user._id.toString(),
        createdAt: user.createdAt ? user.createdAt.toISOString() : null,
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null
    }
}

export async function updateCart(cartData) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    await connectDB()
    await User.findByIdAndUpdate(userId, { cart: cartData })
    return { success: true }
}

export async function checkIsAdmin() {
    const user = await currentUser()
    if (!user) return false

    const adminEmails = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.split(',').map(email => email.trim().toLowerCase()) : []
    const userEmail = user.emailAddresses[0].emailAddress.toLowerCase()

    return adminEmails.includes(userEmail)
}

export async function updateUser(data) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    await connectDB()
    const user = await User.findByIdAndUpdate(userId, data, { new: true }).lean()
    if (!user) throw new Error('User not found')

    return {
        ...user,
        _id: user._id.toString(),
        id: user._id.toString(),
        createdAt: user.createdAt ? user.createdAt.toISOString() : null,
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null
    }
}
