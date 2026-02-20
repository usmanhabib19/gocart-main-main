'use client'
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon, RefreshCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { getProducts } from "@/lib/actions/product"
import { getAllStores } from "@/lib/actions/store"
import { getAllOrders } from "@/lib/actions/order"

export default function AdminDashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })
    const [autoRefresh, setAutoRefresh] = useState(false)

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: 'Total Revenue', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon },
    ]

    const fetchDashboardData = async () => {
        try {
            const [products, stores, orders] = await Promise.all([
                getProducts(),
                getAllStores(),
                getAllOrders(),
            ])

            const revenue = orders.reduce((sum, o) => sum + o.total, 0)

            setDashboardData({
                products: products.length,
                stores: stores.length,
                orders: orders.length,
                revenue: revenue.toFixed(2),
                allOrders: orders.map(o => ({
                    createdAt: o.createdAt,
                    total: o.total,
                })),
            })
        } catch (error) {
            console.error("Failed to fetch admin dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    useEffect(() => {
        let interval;
        if (autoRefresh) {
            fetchDashboardData() // Refresh immediately when turned on
            interval = setInterval(() => {
                fetchDashboardData()
            }, 15000) // Refresh every 15 seconds
        }
        return () => clearInterval(interval)
    }, [autoRefresh])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-medium text-slate-800 tracking-tight">Admin <span className="text-slate-500 font-normal">Dashboard</span></h1>
                <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${autoRefresh ? 'bg-green-100 text-green-700 ring-2 ring-green-500 shadow-sm shadow-green-100' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <RefreshCcw size={14} className={`sm:w-4 sm:h-4 ${autoRefresh ? 'animate-spin-slow' : ''}`} />
                    <span className="hidden sm:inline">Auto Refresh: </span>
                    {autoRefresh ? 'ON' : 'OFF'}
                </button>
            </div>

            {/* Cards */}
            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {
                    dashboardCardsData.map((card, index) => (
                        <div key={index} className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg">
                            <div className="flex flex-col gap-3 text-xs">
                                <p>{card.title}</p>
                                <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                            </div>
                            <card.icon size={50} className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                        </div>
                    ))
                }
            </div>

            {/* Area Chart */}
            <OrdersAreaChart allOrders={dashboardData.allOrders} />
        </div>
    )
}