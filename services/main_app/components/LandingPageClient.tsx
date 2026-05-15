'use client'

import Link from 'next/link';

export default function LandingPageClient() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Navigation */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-white font-semibold text-lg">BadgeHub</span>
                </div>
                <Link
                    href="/auth/login"
                    className="text-sm text-gray-400 hover:text-blue-400 border border-[#333] hover:border-blue-600 rounded-lg px-4 py-1.5 transition-colors"
                >
                    Log in
                </Link>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-20">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4">Badge Management System</h1>
                    <p className="text-xl text-gray-400 mb-8">
                        Track, manage, and monitor user badges across your organizations with ease.
                    </p>
                    <Link
                        href="/auth/login"
                        className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-8 py-3 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-6 mb-16">
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-3">User Dashboard</h3>
                        <p className="text-gray-400 text-sm">
                            View your profile, manage your organizations, and track your activities.
                        </p>
                    </div>
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-3">Badge Tracking</h3>
                        <p className="text-gray-400 text-sm">
                            Create badges for your organizations and track all records in real-time.
                        </p>
                    </div>
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-3">Organization Management</h3>
                        <p className="text-gray-400 text-sm">
                            Manage multiple organizations and their associated badges with ease.
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-12 text-center">
                    <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
                    <p className="text-gray-400 mb-6">Sign in to your account to access your dashboard and manage your badges.</p>
                    <Link
                        href="/auth/login"
                        className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-6 py-2.5 transition-colors"
                    >
                        Log in to Dashboard
                    </Link>
                </div>
            </main>
        </div>
    );
}
