'use server'
import connectDB from '../mongodb'
import Contact from '../models/Contact'

export async function createContactMessage(data) {
    await connectDB()
    await Contact.create(data)
    return { success: true }
}

export async function getContactMessages() {
    await connectDB()
    const messages = await Contact.find().sort({ createdAt: -1 }).lean()
    return messages.map(m => ({
        ...m,
        _id: m._id.toString(),
        createdAt: m.createdAt.toISOString(),
    }))
}

export async function deleteContactMessage(id) {
    await connectDB()
    await Contact.findByIdAndDelete(id)
    return { success: true }
}
