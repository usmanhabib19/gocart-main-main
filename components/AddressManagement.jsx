'use client'
import React, { useState, useEffect } from 'react'
import { PlusIcon, Edit3Icon, Trash2Icon } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { getAddressesByUserId, deleteAddress } from '@/lib/actions/address'
import { setAddresses, removeAddress } from '@/lib/features/address/addressSlice'
import AddressModal from './AddressModal'
import toast from 'react-hot-toast'

const AddressManagement = () => {
    const dispatch = useDispatch()
    const addressList = useSelector(state => state.address.list)
    const [showModal, setShowModal] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchAddresses = async () => {
        try {
            const data = await getAddressesByUserId()
            dispatch(setAddresses(data))
        } catch (error) {
            console.error("Failed to fetch addresses:", error)
            toast.error("Failed to load addresses")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAddresses()
    }, [dispatch])

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this address?")) return

        try {
            await deleteAddress(id)
            dispatch(removeAddress(id))
            toast.success("Address deleted successfully")
        } catch (error) {
            console.error("Failed to delete address:", error)
            toast.error(error.message || "Failed to delete address")
        }
    }

    const handleEdit = (address) => {
        setEditingAddress(address)
        setShowModal(true)
    }

    const handleAddNew = () => {
        setEditingAddress(null)
        setShowModal(true)
    }

    if (loading) {
        return <div className="text-slate-400 text-sm">Loading addresses...</div>
    }

    return (
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-6 mt-8">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-700">Saved Addresses</h2>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-1 text-sm bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors"
                >
                    <PlusIcon size={16} /> Add New
                </button>
            </div>

            {addressList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addressList.map((address) => (
                        <div key={address.id || address._id} className="border border-slate-100 p-4 rounded-lg bg-slate-50/30 flex justify-between items-start group hover:border-slate-200 transition-colors">
                            <div className="text-sm text-slate-600">
                                <p className="font-medium text-slate-800">{address.name}</p>
                                <p>{address.street}</p>
                                <p>{address.city}, {address.state}, {address.zip}</p>
                                <p>{address.country}</p>
                                <p className="text-xs text-slate-400 mt-1">{address.phone}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(address)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded transition-all"
                                >
                                    <Edit3Icon size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(address.id || address._id)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded transition-all"
                                >
                                    <Trash2Icon size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                    <p className="text-slate-400 text-sm">No saved addresses yet.</p>
                </div>
            )}

            {showModal && (
                <AddressModal
                    setShowAddressModal={setShowModal}
                    initialData={editingAddress}
                />
            )}
        </div>
    )
}

export default AddressManagement
