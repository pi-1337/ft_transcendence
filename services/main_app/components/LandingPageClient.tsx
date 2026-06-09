'use client'

import Link from 'next/link';
import { Shield, ArrowRight, LayoutDashboard, Award, Building2, Sparkles } from 'lucide-react';

export default function LandingPageClient({ isLoggedIn, role }: { isLoggedIn: boolean, role?: string }) {
    const dashboardLink = role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

    return (
        <div className="min-h-screen bg-[#030712] text-white font-sans">
            {/* Navigation */}
            <header className="px-8 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
                        <Shield className="w-5 h-5 text-indigo-500" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">BadgeHub</span>
                </div>
                
                <div className="flex items-center gap-6">
                    <Link
                        href="/auth/login"
                        className="text-xs font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        Log in
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8">
                {/* Hero Section */}
                <div className="flex flex-col items-center text-center pt-24 pb-28">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-10">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[10px] font-bold text-indigo-300 tracking-widest uppercase">Badge management made simple</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight">
                        Track & manage <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-500 to-blue-500">
                            badges at scale
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
                        Monitor user badges across your organizations with ease. Create, track, and manage credentials in real-time.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Link
                            href="/auth/register"
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl px-8 py-4 transition-all shadow-xl shadow-indigo-500/25 group"
                        >
                            Get started
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/auth/login"
                            className="bg-gray-800/50 hover:bg-gray-800 text-white font-semibold rounded-2xl px-8 py-4 border border-gray-700 transition-all"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>

                {/* Features Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Everything you need</h2>
                    <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
                        A complete platform for badge management, tracking, and organizational control.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-32">
                    <div className="group bg-[#0b1120]/50 border border-gray-800 hover:border-indigo-500/50 rounded-3xl p-8 transition-all duration-300">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-indigo-500/20">
                            <LayoutDashboard className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">User Dashboard</h3>
                        <p className="text-gray-400 leading-relaxed">
                            View your profile, manage organizations, and track all your activities in one place.
                        </p>
                    </div>
                    
                    <div className="group bg-[#0b1120]/50 border border-gray-800 hover:border-indigo-500/50 rounded-3xl p-8 transition-all duration-300">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-indigo-500/20">
                            <Award className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">Badge Tracking</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Create badges for your organizations and track all records in real-time.
                        </p>
                    </div>
                    
                    <div className="group bg-[#0b1120]/50 border border-gray-800 hover:border-indigo-500/50 rounded-3xl p-8 transition-all duration-300">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-indigo-500/20">
                            <Building2 className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">Organization Management</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Manage multiple organizations and their associated badges with ease.
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="relative overflow-hidden bg-gradient-to-b from-indigo-500/5 to-transparent border border-gray-800 rounded-[3rem] p-16 md:p-24 text-center mb-24">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to get started?</h2>
                        <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
                            Sign in to access your dashboard and manage your badges.
                        </p>
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl px-10 py-5 transition-all shadow-2xl shadow-indigo-500/40 group text-lg"
                        >
                            Log in to Dashboard
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    
                    {/* Decorative background blur */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
                </div>
            </main>
            
            {/* Footer space */}
            <footer className="py-12 border-t border-gray-800 text-center">
                <p className="text-gray-500 text-sm">© 2024 BadgeHub. All rights reserved.</p>
            </footer>
        </div>
    );
}
