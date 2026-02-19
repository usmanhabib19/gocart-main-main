'use server'
import connectDB from '../mongodb'
import Product from '../models/Product'
import Store from '../models/Store'
import Rating from '../models/Rating'

export async function getProducts() {
    await connectDB()
    const products = await Product.find().sort({ createdAt: -1 }).lean()

    // For each product, fetch its store and ratings
    const storeIds = [...new Set(products.map(p => p.storeId))]
    const stores = await Store.find({ _id: { $in: storeIds } }).lean()
    const storeMap = {}
    stores.forEach(s => { storeMap[s._id.toString()] = s })

    const productIds = products.map(p => p._id.toString())
    const ratings = await Rating.find({ productId: { $in: productIds } }).lean()
    const ratingMap = {}
    ratings.forEach(r => {
        const pid = r.productId.toString()
        if (!ratingMap[pid]) ratingMap[pid] = []
        ratingMap[pid].push(r)
    })

    return products.map(p => {
        const id = p._id.toString()
        const store = storeMap[p.storeId]
        return {
            ...p,
            _id: id,
            id,
            createdAt: p.createdAt ? p.createdAt.toISOString() : null,
            updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
            store: store ? {
                ...store,
                _id: store._id.toString(),
                id: store._id.toString(),
                createdAt: store.createdAt ? store.createdAt.toISOString() : null,
                updatedAt: store.updatedAt ? store.updatedAt.toISOString() : null
            } : null,
            rating: (ratingMap[id] || []).map(r => ({
                ...r,
                _id: r._id.toString(),
                id: r._id.toString(),
                createdAt: r.createdAt ? r.createdAt.toISOString() : null,
                updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null
            })),
        }
    })
}

export async function getProductById(id) {
    await connectDB()
    const product = await Product.findById(id).lean()
    if (!product) return null

    const store = await Store.findById(product.storeId).lean()
    const ratings = await Rating.find({ productId: id }).lean()

    return {
        ...product,
        _id: product._id.toString(),
        id: product._id.toString(),
        createdAt: product.createdAt ? product.createdAt.toISOString() : null,
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
        store: store ? {
            ...store,
            _id: store._id.toString(),
            id: store._id.toString(),
            createdAt: store.createdAt ? store.createdAt.toISOString() : null,
            updatedAt: store.updatedAt ? store.updatedAt.toISOString() : null
        } : null,
        rating: ratings.map(r => ({
            ...r,
            _id: r._id.toString(),
            id: r._id.toString(),
            createdAt: r.createdAt ? r.createdAt.toISOString() : null,
            updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null
        })),
    }
}

export async function getProductsByStoreId(storeId) {
    await connectDB()
    const products = await Product.find({ storeId }).sort({ createdAt: -1 }).lean()
    return products.map(p => ({
        ...p,
        _id: p._id.toString(),
        id: p._id.toString(),
        createdAt: p.createdAt ? p.createdAt.toISOString() : null,
        updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
    }))
}

export async function createProduct(data) {
    await connectDB()
    const product = await Product.create(data)
    return { ...product.toObject(), _id: product._id.toString(), id: product._id.toString() }
}

export async function updateProduct(id, data) {
    await connectDB()
    const product = await Product.findByIdAndUpdate(id, data, { new: true }).lean()
    if (!product) return null
    return {
        ...product,
        _id: product._id.toString(),
        id: product._id.toString(),
        createdAt: product.createdAt ? product.createdAt.toISOString() : null,
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
    }
}

export async function deleteProduct(id) {
    await connectDB()
    await Product.findByIdAndDelete(id)
    return { success: true }
}
