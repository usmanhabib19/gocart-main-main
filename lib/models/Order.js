import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
}, { _id: false })

const OrderSchema = new mongoose.Schema({
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
        default: 'ORDER_PLACED',
    },
    trackingId: { type: String, default: '' },
    userId: { type: String, required: true },
    storeId: { type: String, required: true },
    addressId: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ['COD', 'STRIPE'], required: true },
    isCouponUsed: { type: Boolean, default: false },
    coupon: { type: mongoose.Schema.Types.Mixed, default: {} },
    orderItems: [OrderItemSchema],
}, { timestamps: true })


export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
