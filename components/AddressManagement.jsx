'use client'
import React, { useState, useEffect } from 'react'
import { PlusIcon, Edit3Icon, Trash2Icon, MapPinIcon, CheckIcon, XIcon } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { getAddressesByUserId, deleteAddress } from '@/lib/actions/address'
import { setAddresses, removeAddress } from '@/lib/features/address/addressSlice'
import AddressModal from './AddressModal'
import toast from 'react-hot-toast'

const AddressManagement = ({ compact = false }) => {
    const dispatch = useDispatch()
    const addressList = useSelector(state => state.address.list)
    const [showModal, setShowModal] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)   // address being confirmed for deletion
    const [deletingInProgress, setDeletingInProgress] = useState(null) // address delete in progress

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

    const handleDeleteConfirm = async (id) => {
        setDeletingInProgress(id)
        try {
            await deleteAddress(id)
            dispatch(removeAddress(id))
            toast.success("Address deleted")
        } catch (error) {
            console.error("Failed to delete address:", error)
            toast.error(error.message || "Failed to delete address")
        } finally {
            setDeletingInProgress(null)
            setDeletingId(null)
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

    return (
        <div className={`w-full max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-6 ${compact ? '' : 'mt-8'}`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-slate-700">Saved Addresses</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Manage your delivery addresses</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-1.5 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                    <PlusIcon size={15} />
                    Add New
                </button>
            </div>

            {/* Address List */}
            {loading ? (
                <div className="flex flex-col gap-3">
                    {[1, 2].map(i => (
                        <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                </div>
            ) : addressList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addressList.map((address) => {
                        const id = address.id || address._id
                        const isConfirming = deletingId === id
                        const isDeleting = deletingInProgress === id

                        return (
                            <div
                                key={id}
                                className={`relative border rounded-xl p-4 flex flex-col gap-2 transition-all ${isConfirming ? 'border-red-200 bg-red-50/40' : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'}`}
                            >
                                {/* Address Info */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100">
                                        <MapPinIcon size={14} className="text-slate-500" />
                                    </div>
                                    <div className="text-sm text-slate-600 flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 truncate">{address.name}</p>
                                        <p className="truncate">{address.street}</p>
                                        <p className="truncate">{address.city}, {address.state} {address.zip}</p>
                                        <p className="truncate">{address.country}</p>
                                        {address.phone && (
                                            <p className="text-xs text-slate-400 mt-1">{address.phone}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                {!isConfirming ? (
                                    <div className="flex gap-2 justify-end mt-1">
                                        <button
                                            onClick={() => handleEdit(address)}
                                            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
                                        >
                                            <Edit3Icon size={12} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeletingId(id)}
                                            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-red-500 hover:bg-white border border-transparent hover:border-red-100 rounded-lg transition-all"
                                        >
                                            <Trash2Icon size={12} />
                                            Delete
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 mt-1">
                                        <p className="text-xs text-red-500 font-medium text-center">Delete this address?</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setDeletingId(null)}
                                                disabled={isDeleting}
                                                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                <XIcon size={11} /> Cancel
                                            </button>
                                            <button
                                                onClick={() => handleDeleteConfirm(id)}
                                                disabled={isDeleting}
                                                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-60 transition-colors"
                                            >
                                                {isDeleting ? (
                                                    <span>Deleting...</span>
                                                ) : (
                                                    <><CheckIcon size={11} /> Confirm</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
                    <MapPinIcon size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-400 text-sm font-medium">No saved addresses yet</p>
                    <p className="text-slate-300 text-xs mt-1">Add an address to speed up checkout</p>
                    <button
                        onClick={handleAddNew}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                        <PlusIcon size={15} /> Add your first address
                    </button>
                </div>
            )}

            {/* Modal */}
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
