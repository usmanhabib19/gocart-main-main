'use client'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AddressManagement from '@/components/AddressManagement'
import Loading from '@/components/Loading'
import { MapPinIcon } from 'lucide-react'

const ProfilePage = () => {
    const { user, isLoaded } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/')
        }
    }, [isLoaded, user, router])

    if (!isLoaded) return <Loading />
    if (!user) return null

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-green-50 border border-green-100">
                        <MapPinIcon size={22} className="text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">My Profile</h1>
                        <p className="text-sm text-slate-400">Manage your saved addresses</p>
                    </div>
                </div>

                {/* Address Management */}
                <AddressManagement compact />
            </div>
        </div>
    )
}

export default ProfilePage
