'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function LandingPageClient() {
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-xl tracking-tight">
                        Badge<span className="text-green-700">Hub</span>
                    </span>
                </div>
                <Link href="/auth/login">
                    <Button 
                        variant="outline" 
                        className="bg-transparent border-gray-800 text-gray-300 hover:text-white hover:bg-green-950 hover:border-green-800 h-9 px-5 transition-all"
                    >
                        Log in
                    </Button>
                </Link>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-20">
                <div className="text-center mb-24 mt-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-white">
                        Badge Management <span className="text-green-600">System</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Track, manage, and monitor user badges across your organizations with ease.
                    </p>
                    <Link href="/auth/login">
                        <Button className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-lg rounded-lg transition-colors shadow-lg shadow-green-900/20">
                            Get Started
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-white">User Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                View your profile, manage your organizations, and track your activities.
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-white">Badge Tracking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Create badges for your organizations and track all records in real-time.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-white">Organization Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Manage multiple organizations and their associated badges with ease.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-gray-900 border-gray-800 text-center py-16 px-6">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">
                        Sign in to your account to access your dashboard and manage your badges.
                    </p>
                    <Link href="/auth/login">
                        <Button className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-md rounded-lg transition-colors">
                            Log in to Dashboard
                        </Button>
                    </Link>
                </Card>
            </main>
        </div>
    );
}