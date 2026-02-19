'use client'
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { getCurrentUser, updateUser } from "@/lib/actions/user"
import Loading from "@/components/Loading"
import Image from "next/image"
import { assets } from "@/assets/assets"
import { useUser } from "@clerk/nextjs"

const AdminProfile = () => {

    const { user: clerkUser } = useUser()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        image: ''
    })

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getCurrentUser()
                if (data) {
                    setUserData({
                        name: data.name || '',
                        email: data.email || '',
                        image: data.image || ''
                    })
                }
            } catch (error) {
                console.error("Failed to fetch user:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            await updateUser({ name: userData.name })
            toast.success("Profile updated successfully!")
        } catch (error) {
            console.error("Failed to update user:", error)
            toast.error("Failed to update profile")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <Loading />

    return (
        <div className="p-4 sm:p-10 flex flex-col items-center">
            <h1 className="text-2xl font-semibold text-slate-700 mb-8 self-start">Admin Profile</h1>

            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-8">

                <div className="flex flex-col items-center gap-4 py-4 border-b border-slate-50">
                    <Image
                        className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm"
                        src={userData.image || assets.defaultAvatar}
                        alt="Profile"
                        width={96}
                        height={96}
                    />
                    <div className="text-center">
                        <p className="text-lg font-semibold text-slate-800">{userData.name}</p>
                        <p className="text-sm text-slate-500">{userData.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                            Administrator
                        </span>
                    </div>
                </div>

                <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-600">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 transition-colors"
                            value={userData.name}
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-600">Email Address</label>
                        <input
                            type="email"
                            className="w-full p-2.5 border border-slate-100 bg-slate-50 rounded-lg text-slate-400 outline-none cursor-not-allowed"
                            value={userData.email}
                            disabled
                        />
                        <p className="text-[10px] text-slate-400 italic">Email is managed by Clerk and cannot be changed here.</p>
                    </div>

                    <button
                        disabled={saving}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Update Details'}
                    </button>
                </form>

                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
                    <div className="size-5 bg-amber-200 rounded-full flex-shrink-0 flex items-center justify-center text-amber-700 font-bold text-xs">!</div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                        To change your password or security settings, please use the main <strong>User Button</strong> in the navigation bar.
                    </p>
                </div>

            </div>
        </div>
    )
}

export default AdminProfile
