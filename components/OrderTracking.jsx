'use client'
import { PackageIcon, SettingsIcon, TruckIcon, CheckCircleIcon } from 'lucide-react'

const STEPS = [
    {
        key: 'ORDER_PLACED',
        label: 'Order Placed',
        desc: 'Your order has been received',
        icon: PackageIcon,
    },
    {
        key: 'PROCESSING',
        label: 'Processing',
        desc: 'Seller is preparing your items',
        icon: SettingsIcon,
    },
    {
        key: 'SHIPPED',
        label: 'Shipped',
        desc: 'Your order is on its way',
        icon: TruckIcon,
    },
    {
        key: 'DELIVERED',
        label: 'Delivered',
        desc: 'Package delivered successfully',
        icon: CheckCircleIcon,
    },
]

const ORDER_INDEX = {
    ORDER_PLACED: 0,
    PROCESSING: 1,
    SHIPPED: 2,
    DELIVERED: 3,
}

const OrderTracking = ({ status, createdAt, trackingId }) => {
    const currentIndex = ORDER_INDEX[status] ?? 0

    return (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mt-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <p className="text-sm font-semibold text-slate-700">Order Tracking</p>
                <div className="flex items-center gap-3">
                    {trackingId && (
                        <span className="text-xs bg-slate-800 text-white font-mono px-2.5 py-1 rounded-full">
                            🚚 {trackingId}
                        </span>
                    )}
                    <p className="text-xs text-slate-400">Ordered on {new Date(createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="flex items-start gap-0">
                {STEPS.map((step, index) => {
                    const isDone = index <= currentIndex
                    const isActive = index === currentIndex
                    const Icon = step.icon
                    const isLast = index === STEPS.length - 1

                    return (
                        <div key={step.key} className="flex flex-1 flex-col items-center">
                            {/* Icon + connector row */}
                            <div className="flex items-center w-full">
                                {/* Left connector */}
                                {index > 0 && (
                                    <div className={`flex-1 h-0.5 transition-colors duration-500 ${index <= currentIndex ? 'bg-green-500' : 'bg-slate-200'}`} />
                                )}
                                {/* Circle */}
                                <div className={`relative flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-500 flex-shrink-0
                                    ${isDone
                                        ? 'bg-green-500 border-green-500 text-white shadow-md shadow-green-200'
                                        : 'bg-white border-slate-200 text-slate-400'
                                    }
                                    ${isActive ? 'ring-4 ring-green-100' : ''}
                                `}>
                                    <Icon size={16} className={isActive ? 'animate-pulse' : ''} />
                                </div>
                                {/* Right connector */}
                                {!isLast && (
                                    <div className={`flex-1 h-0.5 transition-colors duration-500 ${index < currentIndex ? 'bg-green-500' : 'bg-slate-200'}`} />
                                )}
                            </div>

                            {/* Label below icon */}
                            <div className="mt-2 text-center px-1">
                                <p className={`text-[11px] font-semibold leading-tight ${isDone ? 'text-green-600' : 'text-slate-400'}`}>
                                    {step.label}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight max-sm:hidden">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default OrderTracking
