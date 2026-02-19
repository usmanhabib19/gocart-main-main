import mongoose from 'mongoose'

const StoreSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    status: { type: String, default: 'pending' },
    isActive: { type: Boolean, default: false },
    logo: { type: String, default: '' },
    email: { type: String, required: true },
    contact: { type: String, required: true },
}, { timestamps: true })

export default mongoose.models.Store || mongoose.model('Store', StoreSchema)
