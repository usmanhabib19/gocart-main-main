import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    _id: { type: String }, // Clerk user ID
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { _id: false, timestamps: true })

export default mongoose.models.User || mongoose.model('User', UserSchema)
