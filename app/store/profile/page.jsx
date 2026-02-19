'use client'
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { getStoreByUserId, updateStore } from "@/lib/actions/store"
import Loading from "@/components/Loading"
import Image from "next/image"
import { assets } from "@/assets/assets"

const StoreProfile = () => {

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [storeData, setStoreData] = useState({
        name: '',
        description: '',
        address: '',
        contact: '',
        logo: ''
    })
    const [newLogo, setNewLogo] = useState(null)

    const fetchStore = async () => {
        try {
            const data = await getStoreByUserId()
            if (data) {
                setStoreData({
                    name: data.name || '',
                    description: data.description || '',
                    address: data.address || '',
                    contact: data.contact || '',
                    logo: data.logo || ''
                })
            }
        } catch (error) {
            console.error("Failed to fetch store:", error)
            toast.error("Failed to load store data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStore()
    }, [])

    const uploadImage = async (file) => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            )
            const data = await response.json()
            return data.secure_url
        } catch (error) {
            console.error("Cloudinary Upload Error:", error)
            throw new Error("Failed to upload image")
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            let logoUrl = storeData.logo
            if (newLogo) {
                logoUrl = await uploadImage(newLogo)
            }

            await updateStore({
                ...storeData,
                logo: logoUrl
            })

            toast.success("Store profile updated successfully!")
            setNewLogo(null)
            fetchStore()
        } catch (error) {
            console.error("Failed to update store:", error)
            toast.error(error.message || "Failed to update profile")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <Loading />

    return (
        <div className="p-4 sm:p-10 flex flex-col items-center">
            <h1 className="text-2xl font-semibold text-slate-700 mb-8 self-start">Store Profile</h1>

            <form onSubmit={onSubmitHandler} className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-6">

                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="relative group">
                        <Image
                            className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 shadow-sm"
                            src={newLogo ? URL.createObjectURL(newLogo) : (storeData.logo || assets.upload_area)}
                            alt="Store Logo"
                            width={128}
                            height={128}
                        />
                        <label htmlFor="logo-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-xs font-medium">
                            Change Logo
                        </label>
                        <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setNewLogo(e.target.files[0])}
                        />
                    </div>
                    <p className="text-xs text-slate-500">Store Logo</p>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-600">Store Name</label>
                    <input
                        type="text"
                        className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-green-500 transition-colors"
                        value={storeData.name}
                        onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-600">Short Description</label>
                    <textarea
                        className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-green-500 transition-colors h-24 resize-none"
                        value={storeData.description}
                        onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-600">Contact Number</label>
                        <input
                            type="text"
                            className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-green-500 transition-colors"
                            value={storeData.contact}
                            onChange={(e) => setStoreData({ ...storeData, contact: e.target.value })}
                            placeholder="+1 234 567 890"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-600">Store Address</label>
                        <input
                            type="text"
                            className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-green-500 transition-colors"
                            value={storeData.address}
                            onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <button
                    disabled={saving}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? 'Updating Store...' : 'Save Changes'}
                </button>

            </form>
        </div>
    )
}

export default StoreProfile
