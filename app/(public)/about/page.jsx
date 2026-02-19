'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { Award, ShieldCheck, Target, Users } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-white z-0" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

                <div className="relative z-10 text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 tracking-tight">
                        Our Story. <span className="text-green-600">Your Style.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Redefining the multi-vendor e-commerce experience with luxury, transparency, and a passion for quality.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-7xl mx-auto py-20 px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white">
                            <Image
                                src={assets.hero_model_img}
                                alt="About Nexu"
                                fill
                                className="object-cover transform group-hover:scale-105 transition duration-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">The Nexu Vision</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Founded with a simple yet ambitious goal: to bridge the gap between premium vendors and discerning customers. Nexu isn't just a marketplace; it's a curated ecosystem where quality meets convenience.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                                <Target className="text-green-600 mb-4" size={32} />
                                <h3 className="font-bold text-slate-800 mb-2">Our Mission</h3>
                                <p className="text-sm text-slate-600">Empowering local vendors while delivering global quality standards to your doorstep.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                                <ShieldCheck className="text-blue-600 mb-4" size={32} />
                                <h3 className="font-bold text-slate-800 mb-2">Quality Trust</h3>
                                <p className="text-sm text-slate-600">Every vendor is vetted, and every product is verified to ensure excellence.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-slate-900 py-24 px-6 text-white text-center">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold mb-16">Why Discerning Shoppers Choose Us</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400">
                                <Award size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Curated Selection</h3>
                            <p className="text-slate-400 text-sm">We handpick vendors who share our commitment to style, durability, and innovation.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto text-blue-400">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Vendor Diversity</h3>
                            <p className="text-slate-400 text-sm">A rich tapestry of multi-vendor offerings, from artisanal crafts to high-tech gadgets.</p>
                        </div>
                        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto text-purple-400">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Seamless Support</h3>
                            <p className="text-slate-400 text-sm">Our 24/7 concierge support ensures your shopping journey is as smooth as your luxury items.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
