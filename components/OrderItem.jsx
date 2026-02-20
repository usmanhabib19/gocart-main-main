'use client'
import Image from "next/image";
import { DotIcon, MapPinIcon, PackageSearchIcon } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";
import OrderTracking from "./OrderTracking";

const OrderItem = ({ order }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [ratingModal, setRatingModal] = useState(null);
    const [showTracking, setShowTracking] = useState(false);

    const { ratings } = useSelector(state => state.rating);

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                    <Image
                                        className="h-14 w-auto"
                                        src={item.product.images[0]}
                                        alt="product_img"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 text-base">{item.product.name}</p>
                                    <p>{currency}{item.price} Qty : {item.quantity} </p>
                                    <p className="mb-1">{new Date(order.createdAt).toDateString()}</p>
                                    <div>
                                        {ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId)
                                            ? <Rating value={ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId).rating} />
                                            : <button onClick={() => setRatingModal({ orderId: order.id, productId: item.product.id })} className={`text-green-500 hover:bg-green-50 transition ${order.status !== "DELIVERED" && 'hidden'}`}>Rate Product</button>
                                        }</div>
                                    {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                <td className="text-center max-md:hidden">{currency}{order.total}</td>

                <td className="text-left max-md:hidden">
                    <p>{order.address.name}, {order.address.street},</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country},</p>
                    <p>{order.address.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div
                        className={`flex items-center justify-center gap-1 rounded-full p-1 ${order.status === 'SHIPPED'
                            ? 'text-yellow-500 bg-yellow-100'
                            : order.status === 'DELIVERED'
                                ? 'text-green-500 bg-green-100'
                                : 'text-slate-500 bg-slate-100'
                            }`}
                    >
                        <DotIcon size={10} className="scale-250" />
                        {order.status.split('_').join(' ').toLowerCase()}
                    </div>
                    {/* Track Order Button */}
                    <button
                        onClick={() => setShowTracking(prev => !prev)}
                        className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium mt-1 transition-colors w-full justify-center"
                    >
                        <PackageSearchIcon size={13} />
                        {showTracking ? 'Hide Tracking' : 'Track Order'}
                    </button>
                </td>
            </tr>

            {/* Mobile layout */}
            <tr className="md:hidden">
                <td colSpan={5}>
                    <p>{order.address.name}, {order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                    <p>{order.address.phone}</p>
                    <br />
                    <div className="flex items-center gap-3 justify-center">
                        <span className='text-center px-6 py-1.5 rounded bg-green-100 text-green-700'>
                            {order.status.replace(/_/g, ' ').toLowerCase()}
                        </span>
                        <button
                            onClick={() => setShowTracking(prev => !prev)}
                            className="flex items-center gap-1 text-xs text-green-600 font-medium"
                        >
                            <PackageSearchIcon size={13} />
                            {showTracking ? 'Hide' : 'Track'}
                        </button>
                    </div>
                </td>
            </tr>

            {/* Tracking Timeline */}
            {showTracking && (
                <tr>
                    <td colSpan={4} className="pb-2">
                        <OrderTracking status={order.status} createdAt={order.createdAt} trackingId={order.trackingId} />
                    </td>
                </tr>
            )}

            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-300 w-6/7 mx-auto" />
                </td>
            </tr>
        </>
    )
}

export default OrderItem