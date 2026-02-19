'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { updateProduct } from "@/lib/actions/product"
import { XIcon } from "lucide-react"

const EditProductModal = ({ product, setShowEditModal, onUpdate }) => {
    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Health', 'Toys & Games', 'Sports & Outdoors', 'Books & Media', 'Food & Drink', 'Hobbies & Crafts', 'Others']

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: product.name,
        description: product.description,
        mrp: product.mrp,
        price: product.price,
        category: product.category,
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Initialize images from product data if available
        if (product.images) {
            const initialImages = { 1: null, 2: null, 3: null, 4: null }
            product.images.forEach((img, index) => {
                if (index < 4) initialImages[index + 1] = img
            })
            setImages(initialImages)
        }
    }, [product])

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const uploadImage = async (image) => {
        if (typeof image === 'string') return image; // Already uploaded URL

        try {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: "POST", body: formData }
            );

            const data = await response.json();
            if (data.secure_url) {
                return data.secure_url;
            } else {
                throw new Error("Image upload failed");
            }
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            throw error;
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            // Upload new images to Cloudinary, keep existing URLs
            const imageFiles = Object.values(images).filter(Boolean)

            const uploadedImages = await Promise.all(
                imageFiles.map(img => uploadImage(img))
            )

            const updatedProduct = await updateProduct(product.id, {
                ...productInfo,
                mrp: Number(productInfo.mrp),
                price: Number(productInfo.price),
                images: uploadedImages,
            })

            if (updatedProduct) {
                toast.success("Product updated successfully!")
                onUpdate(updatedProduct)
                setShowEditModal(false)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message || "Failed to update product")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
                <button
                    onClick={() => setShowEditModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <XIcon size={24} />
                </button>

                <h2 className="text-2xl text-slate-800 font-semibold mb-6">Edit <span className="text-slate-500">Product</span></h2>

                <form onSubmit={e => onSubmitHandler(e)} className="space-y-6">
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Product Images</p>
                        <div className="flex gap-3">
                            {Object.keys(images).map((key) => (
                                <label key={key} htmlFor={`edit-images${key}`} className="relative group">
                                    <div className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:border-slate-300 transition-colors">
                                        <Image
                                            width={80}
                                            height={80}
                                            className='object-cover'
                                            src={images[key] ? (typeof images[key] === 'string' ? images[key] : URL.createObjectURL(images[key])) : assets.upload_area}
                                            alt=""
                                        />
                                    </div>
                                    <input
                                        type="file"
                                        accept='image/*'
                                        id={`edit-images${key}`}
                                        onChange={e => setImages({ ...images, [key]: e.target.files[0] })}
                                        hidden
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                onChange={onChangeHandler}
                                value={productInfo.name}
                                placeholder="Product name"
                                className="w-full p-2 px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Category</label>
                            <select
                                onChange={e => setProductInfo({ ...productInfo, category: e.target.value })}
                                value={productInfo.category}
                                className="w-full p-2 px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Description</label>
                        <textarea
                            name="description"
                            onChange={onChangeHandler}
                            value={productInfo.description}
                            placeholder="Product description"
                            rows={4}
                            className="w-full p-2 px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 outline-none transition-all resize-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">MRP ($)</label>
                            <input
                                type="number"
                                name="mrp"
                                onChange={onChangeHandler}
                                value={productInfo.mrp}
                                placeholder="0"
                                className="w-full p-2 px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                onChange={onChangeHandler}
                                value={productInfo.price}
                                placeholder="0"
                                className="w-full p-2 px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowEditModal(false)}
                            className="px-6 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            className="bg-slate-800 text-white px-8 py-2 rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProductModal
