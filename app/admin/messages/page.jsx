'use client'
import { useEffect, useState } from "react"
import { getContactMessages, deleteContactMessage } from "@/lib/actions/contact"
import { Trash2, Mail, User, Calendar, MessageSquare } from "lucide-react"
import toast from "react-hot-toast"
import { format } from "date-fns"

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMessages = async () => {
        try {
            const data = await getContactMessages()
            setMessages(data)
        } catch (error) {
            console.error("Fetch Messages Error:", error)
            toast.error("Failed to load messages")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this message?")) return
        try {
            await deleteContactMessage(id)
            setMessages(messages.filter(m => m._id !== id))
            toast.success("Message deleted")
        } catch (error) {
            console.error("Delete Message Error:", error)
            toast.error("Failed to delete message")
        }
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Contact Messages</h1>
                    <p className="text-slate-500 mt-1">Manage inquiries from your customers</p>
                </div>
                <div className="bg-green-100 text-green-700 font-bold px-4 py-2 rounded-full text-sm">
                    {messages.length} Messages
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
            ) : messages.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-slate-100">
                    <MessageSquare size={64} className="mx-auto text-slate-200 mb-4" />
                    <h2 className="text-xl font-semibold text-slate-800">No messages yet</h2>
                    <p className="text-slate-400">All customer inquiries will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {messages.map((msg) => (
                        <div key={msg._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                        <User size={14} className="text-green-600" />
                                        {msg.name}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                        <Mail size={14} className="text-blue-600" />
                                        {msg.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <Calendar size={14} />
                                        {format(new Date(msg.createdAt), "MMM d, yyyy • p")}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(msg._id)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                                >
                                    <Trash2 size={16} />
                                    <span className="text-xs font-medium uppercase tracking-wider">Delete</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                                    {msg.subject}
                                </h3>
                                <div className="bg-slate-50 rounded-xl p-5 text-slate-600 leading-relaxed border-l-4 border-green-500 shadow-inner">
                                    {msg.message}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
