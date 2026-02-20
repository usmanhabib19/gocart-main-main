'use client'
import { XIcon, CreditCard } from "lucide-react"
import React from "react"

const ComingSoonModal = ({ setShowComingSoon }) => {
    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 text-slate-700 w-full max-w-sm mx-6 relative animate-in fade-in zoom-in duration-300">
                <div className="bg-slate-100 p-4 rounded-full">
                    <CreditCard size={40} className="text-slate-600" />
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">Stripe Payment</h2>
                    <p className="text-slate-500">We're working hard to bring you Stripe payments soon. Stay tuned!</p>
                </div>

                <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                    <span className="text-sm font-medium text-slate-600 uppercase tracking-wider">Coming Soon</span>
                </div>

                <button
                    onClick={() => setShowComingSoon(false)}
                    className="w-full bg-slate-800 text-white font-medium py-3 rounded-xl hover:bg-slate-900 active:scale-95 transition-all mt-2"
                >
                    Got it
                </button>

                <XIcon
                    size={24}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                    onClick={() => setShowComingSoon(false)}
                />
            </div>
        </div>
    )
}

export default ComingSoonModal
