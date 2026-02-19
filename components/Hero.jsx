'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import Link from 'next/link'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const carouselData = [
        {
            title: "Gadgets you'll love. Prices you'll trust.",
            subtitle: "Free Shipping on Orders Above $50!",
            price: "4.90",
            image: assets.hero_model_img,
            bgColor: "bg-green-200",
            badgeColor: "bg-green-300",
            badgeTextColor: "text-green-600",
            btnColor: "bg-slate-800",
            textColor: "text-slate-800",
            link: "/shop"
        },
        {
            title: "Smart Living. Intelligent Choice.",
            subtitle: "Up to 30% Off on Smart Home!",
            price: "19.99",
            image: assets.product_img1,
            bgColor: "bg-blue-200",
            badgeColor: "bg-blue-300",
            badgeTextColor: "text-blue-600",
            btnColor: "bg-blue-800",
            textColor: "text-slate-800",
            link: "/shop"
        },
        {
            title: "Sound that moves you. Style that stays.",
            subtitle: "Exclusive Premium Audio Collection",
            price: "24.50",
            image: assets.product_img4,
            bgColor: "bg-orange-200",
            badgeColor: "bg-orange-300",
            badgeTextColor: "text-orange-600",
            btnColor: "bg-orange-800",
            textColor: "text-slate-800",
            link: "/shop"
        },
        {
            title: "Precision in every tick. Elegance in every bit.",
            subtitle: "New Arrival: Smart Watch Series",
            price: "49.00",
            image: assets.product_img10,
            bgColor: "bg-purple-200",
            badgeColor: "bg-purple-300",
            badgeTextColor: "text-purple-600",
            btnColor: "bg-purple-800",
            textColor: "text-slate-800",
            link: "/shop"
        },
        {
            title: "Power your play. Dominate the game.",
            subtitle: "Gaming Gear Flash Sale Live!",
            price: "15.00",
            image: assets.product_img11,
            bgColor: "bg-red-200",
            badgeColor: "bg-red-300",
            badgeTextColor: "text-red-600",
            btnColor: "bg-red-800",
            textColor: "text-slate-800",
            link: "/shop"
        }
    ]

    return (
        <div className='mx-6'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
                <div className='flex-1 rounded-3xl overflow-hidden' style={{ minHeight: '400px' }}>
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        loop={true}
                        className='h-full w-full'
                    >
                        {carouselData.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <div className={`relative flex flex-col ${slide.bgColor} min-h-[400px] xl:min-h-[480px] group h-full w-full`}>
                                    <div className='p-5 sm:p-16'>
                                        <div className={`inline-flex items-center gap-3 ${slide.badgeColor} ${slide.badgeTextColor} pr-4 p-1 rounded-full text-xs sm:text-sm`}>
                                            <span className={`${slide.badgeTextColor.replace('text', 'bg')} px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs`}>NEWS</span> {slide.subtitle} <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                                        </div>
                                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-gradient-to-r from-slate-600 to-[#A0FF74] bg-clip-text text-transparent max-w-xs sm:max-w-md'>
                                            {slide.title}
                                        </h2>
                                        <div className={`${slide.textColor} text-sm font-medium mt-4 sm:mt-8`}>
                                            <p>Starts from</p>
                                            <p className='text-3xl'>{currency}{slide.price}</p>
                                        </div>
                                        <Link href={slide.link}>
                                            <button className={`${slide.btnColor} text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:scale-103 active:scale-95 transition`}>LEARN MORE</button>
                                        </Link>
                                    </div>
                                    <div className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm flex justify-center items-end p-5'>
                                        <Image className='w-full max-w-[200px] sm:max-w-sm object-contain' src={slide.image} alt={slide.title} />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <div className='flex-1 flex items-center justify-between w-full bg-orange-200 rounded-3xl p-6 px-8 group'>
                        <div className='flex flex-col items-start'>
                            <span className='text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mb-2 uppercase tracking-wider'>Electronics</span>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40'>Best products</p>
                            <Link href='/shop?search=Electronics'>
                                <button className='flex items-center gap-2 mt-4 bg-slate-800 text-white px-4 py-2 rounded-lg text-xs hover:bg-slate-900 transition-all active:scale-95 group/btn'>
                                    Explore Now <ArrowRightIcon size={14} className='group-hover/btn:translate-x-1 transition-transform' />
                                </button>
                            </Link>
                        </div>
                        <Image className='w-35' src={assets.hero_product_img1} alt="" />
                    </div>
                    <div className='flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group'>
                        <div className='flex flex-col items-start'>
                            <span className='text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full mb-2 uppercase tracking-wider'>Accessories</span>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>20% discounts</p>
                            <Link href='/shop?search=Accessories'>
                                <button className='flex items-center gap-2 mt-4 bg-slate-800 text-white px-4 py-2 rounded-lg text-xs hover:bg-slate-900 transition-all active:scale-95 group/btn'>
                                    Explore Now <ArrowRightIcon size={14} className='group-hover/btn:translate-x-1 transition-transform' />
                                </button>
                            </Link>
                        </div>
                        <Image className='w-35' src={assets.hero_product_img2} alt="" />
                    </div>
                </div>

            </div>
            <CategoriesMarquee />
        </div>

    )
}

export default Hero