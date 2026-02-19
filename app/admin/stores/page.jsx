'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Trash2 } from "lucide-react"
import { getAllStores, updateStoreStatus, deleteStore } from "@/lib/actions/store"

export default function AdminStores() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        try {
            const data = await getAllStores()
            setStores(data.filter(s => s.status === 'approved'))
        } catch (error) {
            console.error("Failed to fetch stores:", error)
        } finally {
            setLoading(false)
        }
    }

    const toggleIsActive = async (storeId) => {
        const store = stores.find(s => s.id === storeId)
        if (!store) return
        const newStatus = store.isActive ? 'approved' : 'approved'
        try {
            const updated = await updateStoreStatus(storeId, newStatus)
            if (updated) {
                setStores(prev => prev.map(s =>
                    s.id === storeId ? { ...s, isActive: !s.isActive } : s
                ))
                toast.success(`Store ${!store.isActive ? 'activated' : 'deactivated'}`)
            }
        } catch (error) {
            toast.error("Failed to update store")
        }
    }

    const handleDelete = async (storeId) => {
        const promise = deleteStore(storeId).then((res) => {
            if (res.success) {
                setStores(prev => prev.filter(s => s.id !== storeId))
                return "Store deleted successfully"
            }
            throw new Error("Failed to delete store")
        })

        toast.promise(promise, {
            loading: 'Deleting store...',
            success: (msg) => msg,
            error: (err) => err.message,
        })
    }

    useEffect(() => {
        fetchStores()
    }, [])

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Live <span className="text-slate-800 font-medium">Stores</span></h1>

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div className="flex items-center gap-6 pt-2 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <p>Active</p>
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                        <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleIsActive(store.id), { loading: "Updating data..." })} checked={store.isActive} />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                </div>
                                <button onClick={() => handleDelete(store.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete Store">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">No stores Available</h1>
                </div>
            )
            }
        </div>
    ) : <Loading />
}