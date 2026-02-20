'use client'
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { getOrdersByUserId } from "@/lib/actions/order";
import { getRatingsByUserId } from "@/lib/actions/rating";
import { setRatings } from "@/lib/features/rating/ratingSlice";
import { useDispatch } from "react-redux";
import { RefreshCcw } from "lucide-react";

export default function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const dispatch = useDispatch();

    const fetchOrders = async () => {
        try {
            const [ordersData, ratingsData] = await Promise.all([
                getOrdersByUserId(),
                getRatingsByUserId()
            ]);
            setOrders(ordersData);
            dispatch(setRatings(ratingsData));
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [dispatch]);

    useEffect(() => {
        let interval;
        if (autoRefresh) {
            fetchOrders() // Refresh immediately
            interval = setInterval(() => {
                fetchOrders()
            }, 15000) // 15 seconds
        }
        return () => clearInterval(interval)
    }, [autoRefresh])

    if (loading) {
        return (
            <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                <h1 className="text-2xl">Loading orders...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] mx-6">
            {orders.length > 0 ? (
                (
                    <div className="my-20 max-w-7xl mx-auto">
                        <div className="flex justify-between items-end mb-8">
                            <PageTitle heading="My Orders" text={`Showing total ${orders.length} orders`} linkText={'Go to home'} />
                            <button
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${autoRefresh ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                <RefreshCcw size={14} className={`sm:w-4 sm:h-4 ${autoRefresh ? 'animate-spin-slow' : ''}`} />
                                <span className="hidden sm:inline">Auto Refresh: </span>
                                {autoRefresh ? 'ON' : 'OFF'}
                            </button>
                        </div>

                        <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                            <thead>
                                <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                    <th className="text-left">Product</th>
                                    <th className="text-center">Total Price</th>
                                    <th className="text-left">Address</th>
                                    <th className="text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <OrderItem order={order} key={order.id} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">You have no orders</h1>
                </div>
            )}
        </div>
    )
}