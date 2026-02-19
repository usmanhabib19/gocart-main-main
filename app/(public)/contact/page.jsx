'use client'
import { useState } from "react"
import { Mail, MapPin, Phone, Send, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import toast from "react-hot-toast"
import { createContactMessage } from "@/lib/actions/contact"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createContactMessage(formData)
            toast.success("Thank you for reaching out! We will get back to you soon.")
            setFormData({ name: "", email: "", subject: "", message: "" })
        } catch (error) {
            console.error("Contact Form Error:", error)
            toast.error("Failed to send message. Please try again later.")
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <section className="bg-slate-900 py-20 px-6 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Connect With Our <span className="text-green-400 font-medium">Concierge</span></h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg">
                        Experience unparalleled support. Our team is here to ensure your journey with Nexu is nothing short of extraordinary.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto py-20 px-6">
                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-8">Direct Channels</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="p-4 rounded-xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Email Us</p>
                                        <p className="text-slate-800 font-semibold">concierge@nexuplus.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-4 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Call Us</p>
                                        <p className="text-slate-800 font-semibold">+1 (800) NEXU-PLUS</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-4 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Our Atelier</p>
                                        <p className="text-slate-800 font-semibold italic">7th Avenue, Luxury District, NY</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-8">Social Presence</h2>
                            <div className="flex gap-4">
                                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                    <a key={i} href="#" className="p-3 rounded-full border border-slate-200 text-slate-400 hover:text-green-600 hover:border-green-600 transition-all">
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100 italic relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                            <h2 className="text-3xl font-bold text-slate-800 mb-8 relative z-10">Send a Personalized Message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 not-italic">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-600 ml-1">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-600 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                                            placeholder="john@luxury.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-600 ml-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                                        placeholder="How can we assist you?"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-600 ml-1">Message</label>
                                    <textarea
                                        rows={5}
                                        required
                                        className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium resize-none"
                                        placeholder="Tell us about your requirements..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-12 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    Send Message <Send size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
