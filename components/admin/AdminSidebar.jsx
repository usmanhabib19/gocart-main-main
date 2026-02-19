'use client'

import { usePathname } from "next/navigation"
import { HomeIcon, ShieldCheckIcon, StoreIcon, TicketPercentIcon, SettingsIcon, MessageSquareIcon } from "lucide-react"
import Link from "next/link"
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"

const AdminSidebar = () => {

    const pathname = usePathname()
    const { user } = useUser()

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Stores', href: '/admin/stores', icon: StoreIcon },
        { name: 'Approve Store', href: '/admin/approve', icon: ShieldCheckIcon },
        { name: 'Messages', href: '/admin/messages', icon: MessageSquareIcon },
        { name: 'Coupons', href: '/admin/coupons', icon: TicketPercentIcon },
        { name: 'Profile', href: '/admin/profile', icon: SettingsIcon },
    ]

    return (
        <div className="inline-flex h-full flex-col gap-5 border-r border-slate-200 sm:min-w-60">
            <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
                <Link href="/" className="relative text-2xl font-semibold text-slate-700">
                    <span className="text-green-600">ne</span>xu<span className="text-green-600 text-3xl leading-0">.</span>
                </Link>
                <div className="flex items-center gap-2 mt-2">
                    <Image className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" src={user?.imageUrl || assets.defaultAvatar} alt="" width={40} height={40} />
                    <p className="text-slate-700 font-medium">Hi, {user?.firstName || 'Admin'}</p>
                </div>
            </div>

            <div className="max-sm:mt-6">
                {
                    sidebarLinks.map((link, index) => (
                        <Link key={index} href={link.href} className={`relative flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-2.5 transition ${pathname === link.href && 'bg-slate-100 sm:text-slate-600'}`}>
                            <link.icon size={18} className="sm:ml-5" />
                            <p className="max-sm:hidden">{link.name}</p>
                            {pathname === link.href && <span className="absolute bg-green-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>}
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default AdminSidebar