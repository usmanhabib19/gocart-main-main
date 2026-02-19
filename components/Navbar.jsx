'use client'
import { LayoutDashboard, Menu, PackageIcon, Search, ShoppingCart, Store, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { checkIsAdmin } from "@/lib/actions/user";
import { getStoreByUserId } from "@/lib/actions/store";

const Navbar = () => {

    const { user } = useUser()
    const { openSignIn } = useClerk()
    const router = useRouter()


    const [search, setSearch] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const cartCount = useSelector(state => state.cart.total)

    const fetchUserRole = async () => {
        try {
            const adminStatus = await checkIsAdmin()
            setIsAdmin(adminStatus)

            const store = await getStoreByUserId()
            if (store && store.status === 'approved') {
                setIsSeller(true)
            }
        } catch (error) {
            console.error("Error fetching user roles:", error)
        }
    }

    useEffect(() => {
        if (user) {
            fetchUserRole()
        }
    }, [user])

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
        setIsMobileMenuOpen(false)
    }

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">

                    <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                        <span className="text-green-600">ne</span>xu<span className="text-green-600 text-5xl leading-0">.</span>
                        <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
                        <Link href="/shop" className="hover:text-green-600 transition-colors">Shop</Link>
                        <Link href="/about" className="hover:text-green-600 transition-colors">About</Link>
                        <Link href="/contact" className="hover:text-green-600 transition-colors">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        {
                            !user ? (
                                <button onClick={() => openSignIn()} className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                    Login
                                </button>
                            ) : (
                                <UserButton>
                                    <UserButton.MenuItems>

                                        <UserButton.Action labelIcon={<PackageIcon size={16} />} label="My Orders" onClick={() => router.push('/orders')} />
                                        {isAdmin && (
                                            <UserButton.Action labelIcon={<LayoutDashboard size={16} />} label="Admin Panel" onClick={() => router.push('/admin')} />
                                        )}
                                        {isSeller && (
                                            <UserButton.Action labelIcon={<Store size={16} />} label="Seller Panel" onClick={() => router.push('/store')} />
                                        )}
                                    </UserButton.MenuItems>
                                </UserButton>
                            )
                        }

                    </div>

                    {/* Mobile Menu Button & User Button  */}
                    <div className="flex items-center gap-4 sm:hidden">
                        {user ? (
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action labelIcon={<ShoppingCart size={16} />} label="Cart" onClick={() => router.push('/cart')} />
                                    <UserButton.Action labelIcon={<PackageIcon size={16} />} label="My Orders" onClick={() => router.push('/orders')} />
                                    {isAdmin && (
                                        <UserButton.Action labelIcon={<LayoutDashboard size={16} />} label="Admin Panel" onClick={() => router.push('/admin')} />
                                    )}
                                    {isSeller && (
                                        <UserButton.Action labelIcon={<Store size={16} />} label="Seller Panel" onClick={() => router.push('/store')} />
                                    )}
                                </UserButton.MenuItems>
                            </UserButton>
                        ) : (
                            <button onClick={() => openSignIn()} className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                                Login
                            </button>
                        )}

                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 focus:outline-none">
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            <div className={`fixed inset-0 z-50 transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out sm:hidden bg-white shadow-xl`}>
                <div className="flex flex-col h-full bg-white">
                    <div className="flex items-center justify-between p-6 border-b">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-semibold text-slate-700">
                            <span className="text-green-600">ne</span>xu<span className="text-green-600 text-4xl leading-0">.</span>
                        </Link>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600">
                            <X size={28} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6 overflow-y-auto">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="flex items-center w-full text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        {/* Mobile Links */}
                        <div className="flex flex-col gap-4 text-lg text-slate-600 font-medium">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-green-600 transition-colors">Home</Link>
                            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-green-600 transition-colors">Shop</Link>
                            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-green-600 transition-colors">About</Link>
                            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-green-600 transition-colors">Contact</Link>
                            <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 hover:text-green-600 transition-colors">
                                <ShoppingCart size={20} />
                                Cart ({cartCount})
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar