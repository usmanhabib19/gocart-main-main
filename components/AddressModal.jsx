'use client'
import { XIcon, SaveIcon, Loader2Icon } from "lucide-react"
import React, { useState } from "react"
import { toast } from "react-hot-toast"
import { createAddress, updateAddress } from "@/lib/actions/address"
import { addAddress, updateAddress as updateAddressSlice } from "@/lib/features/address/addressSlice"
import { useDispatch } from "react-redux"

const EMPTY_FORM = {
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: ''
}

const AddressModal = ({ setShowAddressModal, initialData = null }) => {
    const dispatch = useDispatch()
    const isEditing = !!initialData

    const [form, setForm] = useState(initialData ? {
        name: initialData.name || '',
        email: initialData.email || '',
        street: initialData.street || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zip: initialData.zip || '',
        country: initialData.country || '',
        phone: initialData.phone || ''
    } : { ...EMPTY_FORM })

    const [saving, setSaving] = useState(false)

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (isEditing) {
                const updated = await updateAddress(initialData.id || initialData._id, form)
                dispatch(updateAddressSlice(updated))
                toast.success("Address updated successfully!")
            } else {
                const created = await createAddress(form)
                dispatch(addAddress(created))
                toast.success("Address added successfully!")
            }
            setShowAddressModal(false)
        } catch (error) {
            console.error("Failed to save address:", error)
            toast.error(error.message || "Failed to save address")
        } finally {
            setSaving(false)
        }
    }

    const inputClass = "w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100 transition-all text-sm text-slate-700 placeholder-slate-400"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowAddressModal(false) }}>
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            {isEditing ? 'Edit Address' : 'Add New Address'}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {isEditing ? 'Update your saved address details' : 'Fill in your shipping address details'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    >
                        <XIcon size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Full Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={inputClass}
                            type="text"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Email</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className={inputClass}
                            type="email"
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    {/* Street */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Street Address</label>
                        <input
                            name="street"
                            value={form.street}
                            onChange={handleChange}
                            className={inputClass}
                            type="text"
                            placeholder="123 Main Street"
                            required
                        />
                    </div>

                    {/* City & State */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">City</label>
                            <input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className={inputClass}
                                type="text"
                                placeholder="New York"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">State</label>
                            <input
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className={inputClass}
                                type="text"
                                placeholder="NY"
                                required
                            />
                        </div>
                    </div>

                    {/* Zip & Country */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Zip Code</label>
                            <input
                                name="zip"
                                value={form.zip}
                                onChange={handleChange}
                                className={inputClass}
                                type="text"
                                placeholder="10001"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Country</label>
                            <input
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                className={inputClass}
                                type="text"
                                placeholder="United States"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Phone Number</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className={inputClass}
                            type="tel"
                            placeholder="+1 234 567 8900"
                            required
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-2">
                        <button
                            type="button"
                            onClick={() => setShowAddressModal(false)}
                            className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <Loader2Icon size={16} className="animate-spin" />
                                    {isEditing ? 'Updating...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <SaveIcon size={16} />
                                    {isEditing ? 'Update Address' : 'Save Address'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddressModal