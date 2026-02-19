'use server'
import { auth } from '@clerk/nextjs/server'
import connectDB from '../mongodb'
import Order from '../models/Order'
import Product from '../models/Product'
import Address from '../models/Address'
import User from '../models/User'

export async function createOrder(data) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    await connectDB()
    const order = await Order.create({
        ...data,
        userId,
    })

    return { ...order.toObject(), _id: order._id.toString(), id: order._id.toString() }
}

export async function getOrdersByUserId() {
    const { userId } = await auth()
    if (!userId) return []

    await connectDB()
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean()
    return await populateOrders(orders)
}

export async function getOrdersByStoreId(storeId) {
    await connectDB()
    const orders = await Order.find({ storeId }).sort({ createdAt: -1 }).lean()
    return await populateOrders(orders)
}

export async function updateOrderStatus(orderId, status) {
    await connectDB()
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).lean()
    if (!order) return null
    return { ...order, _id: order._id.toString(), id: order._id.toString() }
}

export async function getAllOrders() {
    await connectDB()
    const orders = await Order.find().sort({ createdAt: -1 }).lean()
    return await populateOrders(orders)
}

async function populateOrders(orders) {
    if (!orders.length) return []

    // Collect all referenced IDs
    const productIds = new Set()
    const addressIds = new Set()
    const userIds = new Set()

    orders.forEach(o => {
        o.orderItems?.forEach(item => productIds.add(item.productId))
        addressIds.add(o.addressId)
        userIds.add(o.userId)
    })

    const [products, addresses, users] = await Promise.all([
        Product.find({ _id: { $in: [...productIds] } }).lean(),
        Address.find({ _id: { $in: [...addressIds] } }).lean(),
        User.find({ _id: { $in: [...userIds] } }).lean(),
    ])

    const productMap = {}
    products.forEach(p => { productMap[p._id.toString()] = { ...p, _id: p._id.toString(), id: p._id.toString() } })
    const addressMap = {}
    addresses.forEach(a => { addressMap[a._id.toString()] = { ...a, _id: a._id.toString(), id: a._id.toString() } })
    const userMap = {}
    users.forEach(u => { userMap[u._id.toString()] = { ...u, _id: u._id.toString(), id: u._id.toString() } })

    return orders.map(o => ({
        ...o,
        _id: o._id.toString(),
        id: o._id.toString(),
        orderItems: (o.orderItems || []).map(item => ({
            ...item,
            product: productMap[item.productId] || null,
        })),
        address: addressMap[o.addressId] || null,
        user: userMap[o.userId] || null,
    }))
}
