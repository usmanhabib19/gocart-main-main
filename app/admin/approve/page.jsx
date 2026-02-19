'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Trash2 } from "lucide-react"
import { getAllStores, updateStoreStatus, deleteStore } from "@/lib/actions/store"

export default function AdminApprove() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        try {
            const data = await getAllStores()
            setStores(data.filter(s => s.status === 'pending'))
        } catch (error) {
            console.error("Failed to fetch stores:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async ({ storeId, status }) => {
        try {
            const updated = await updateStoreStatus(storeId, status)
            if (updated) {
                setStores(prev => prev.filter(s => s.id !== storeId))
                toast.success(`Store ${status}!`)
            }
        } catch (error) {
            toast.error("Failed to update store status")
        }
    }

    const handleDelete = async (storeId) => {
        const promise = deleteStore(storeId).then((res) => {
            if (res.success) {
                setStores(prev => prev.filter(s => s.id !== storeId))
                return "Store application deleted"
            }
            throw new Error("Failed to delete store")
        })

        toast.promise(promise, {
            loading: 'Deleting application...',
            success: (msg) => msg,
            error: (err) => err.message,
        })
    }

    useEffect(() => {
        fetchStores()
    }, [])

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Approve <span className="text-slate-800 font-medium">Stores</span></h1>

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div className="flex gap-3 pt-2 flex-wrap items-center">
                                <button onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'approved' }), { loading: "approving" })} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm" >
                                    Approve
                                </button>
                                <button onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'rejected' }), { loading: 'rejecting' })} className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm" >
                                    Reject
                                </button>
                                <button onClick={() => handleDelete(store.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2" title="Delete Application">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">No Application Pending</h1>
                </div>
            )}
        </div>
    ) : <Loading />
}