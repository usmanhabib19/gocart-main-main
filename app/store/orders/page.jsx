'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import toast from "react-hot-toast"
import { getOrdersByStoreId, updateOrderStatus as updateOrderStatusAction, setTrackingId as setTrackingIdAction } from "@/lib/actions/order"
import { getStoreByUserId } from "@/lib/actions/store"
import { SendIcon } from "lucide-react"

export default function StoreOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [trackingInput, setTrackingInput] = useState('')
    const [savingTracking, setSavingTracking] = useState(false)

    const fetchOrders = async () => {
        try {
            const store = await getStoreByUserId()
            if (!store) {
                setLoading(false)
                return
            }
            const data = await getOrdersByStoreId(store.id)
            setOrders(data)
        } catch (error) {
            console.error("Failed to fetch orders:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            const updated = await updateOrderStatusAction(orderId, status)
            if (updated) {
                setOrders(prev => prev.map(o =>
                    o.id === orderId ? { ...o, status } : o
                ))
                toast.success(`Order status updated to ${status}`)
            }
        } catch (error) {
            toast.error("Failed to update order status")
        }
    }

    const openModal = (order) => {
        setSelectedOrder(order)
        setTrackingInput(order.trackingId || '')
        setIsModalOpen(true)
    }

    const handleSaveTrackingId = async () => {
        if (!selectedOrder) return
        setSavingTracking(true)
        try {
            await setTrackingIdAction(selectedOrder.id, trackingInput)
            setOrders(prev => prev.map(o =>
                o.id === selectedOrder.id ? { ...o, trackingId: trackingInput } : o
            ))
            setSelectedOrder(prev => ({ ...prev, trackingId: trackingInput }))
            toast.success('Tracking ID saved!')
        } catch (error) {
            toast.error('Failed to save tracking ID')
        } finally {
            setSavingTracking(false)
        }
    }

    const closeModal = () => {
        setSelectedOrder(null)
        setIsModalOpen(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Store <span className="text-slate-800 font-medium">Orders</span></h1>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className="overflow-x-auto max-w-4xl rounded-md shadow border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
                            <tr>
                                {["Sr. No.", "Customer", "Total", "Payment", "Coupon", "Status", "Date"].map((heading, i) => (
                                    <th key={i} className="px-4 py-3">{heading}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                    onClick={() => openModal(order)}
                                >
                                    <td className="pl-6 text-green-600" >
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3">{order.user?.name}</td>
                                    <td className="px-4 py-3 font-medium text-slate-800">${order.total}</td>
                                    <td className="px-4 py-3">{order.paymentMethod}</td>
                                    <td className="px-4 py-3">
                                        {order.isCouponUsed ? (
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                                {order.coupon?.code}
                                            </span>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td className="px-4 py-3" onClick={(e) => { e.stopPropagation() }}>
                                        <select
                                            value={order.status}
                                            onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                                            className="border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200"
                                        >
                                            <option value="ORDER_PLACED">ORDER_PLACED</option>
                                            <option value="PROCESSING">PROCESSING</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && selectedOrder && (
                <div onClick={closeModal} className="fixed inset-0 flex items-center justify-center bg-black/50 text-slate-700 text-sm backdrop-blur-xs z-50" >
                    <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                            Order Details
                        </h2>

                        {/* Customer Details */}
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Customer Details</h3>
                            <p><span className="text-green-700">Name:</span> {selectedOrder.user?.name}</p>
                            <p><span className="text-green-700">Email:</span> {selectedOrder.user?.email}</p>
                            <p><span className="text-green-700">Phone:</span> {selectedOrder.address?.phone}</p>
                            <p><span className="text-green-700">Address:</span> {`${selectedOrder.address?.street}, ${selectedOrder.address?.city}, ${selectedOrder.address?.state}, ${selectedOrder.address?.zip}, ${selectedOrder.address?.country}`}</p>
                        </div>

                        {/* Products */}
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Products</h3>
                            <div className="space-y-2">
                                {selectedOrder.orderItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 border border-slate-100 shadow rounded p-2">
                                        {item.product?.images?.[0] && (
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product?.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-slate-800">{item.product?.name}</p>
                                            <p>Qty: {item.quantity}</p>
                                            <p>Price: ${item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment & Status */}
                        <div className="mb-4">
                            <p><span className="text-green-700">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                            <p><span className="text-green-700">Paid:</span> {selectedOrder.isPaid ? "Yes" : "No"}</p>
                            {selectedOrder.isCouponUsed && (
                                <p><span className="text-green-700">Coupon:</span> {selectedOrder.coupon?.code} ({selectedOrder.coupon?.discount}% off)</p>
                            )}
                            <p><span className="text-green-700">Status:</span> {selectedOrder.status}</p>
                            <p><span className="text-green-700">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        </div>

                        {/* Tracking ID */}
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Tracking ID</h3>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={trackingInput}
                                    onChange={e => setTrackingInput(e.target.value)}
                                    placeholder="Enter courier tracking number..."
                                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100 transition-all"
                                />
                                <button
                                    onClick={handleSaveTrackingId}
                                    disabled={savingTracking}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors"
                                >
                                    <SendIcon size={14} />
                                    {savingTracking ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                            {selectedOrder.trackingId && (
                                <p className="text-xs text-slate-400 mt-1.5">Current: <span className="font-mono text-slate-600">{selectedOrder.trackingId}</span></p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end">
                            <button onClick={closeModal} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300" >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
