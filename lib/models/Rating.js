import mongoose from 'mongoose'

const RatingSchema = new mongoose.Schema({
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    orderId: { type: String, required: true },
}, { timestamps: true })

// Unique constraint matching the Prisma @@unique([userId, productId, orderId])
RatingSchema.index({ userId: 1, productId: 1, orderId: 1 }, { unique: true })

export default mongoose.models.Rating || mongoose.model('Rating', RatingSchema)
