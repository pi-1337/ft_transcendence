'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserFrontend } from '@/lib/types';
import { Bell } from '@/components/notifications/bell';

export default function Dashboard(
    { user,
        totalOrganizations,
        totalBadges,
        totalRecords,
        unreadCount
    }: {
        user: UserFrontend,
        totalOrganizations: number,
        totalBadges: number,
        totalRecords: number,
        unreadCount: number
    }) {
    const router = useRouter();

    const stats = {
        totalOrganizations,
        totalBadges,
        totalRecords
    };

    const handleLogout = async () => {
        cookieStore.delete("session");
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top bar */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-white font-semibold text-lg">BadgeHub</span>
                    <span className="text-xs bg-green-600/20 text-green-400 border border-green-600/30 rounded-full px-2.5 py-0.5">
                        USER
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/settings"
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Settings
                    </Link>
                    <Bell unreadCount={unreadCount} />
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-400 hover:text-red-400 border border-[#333] hover:border-red-600 rounded-lg px-4 py-1.5 transition-colors"
                    >
                        Log out
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-12">
                {/* Greeting */}
                <div className="mb-10">
                    <h1 className="text-2xl font-semibold mb-1">
                        Welcome back, {user.firstname}!
                    </h1>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Organizations</p>
                        <p className="text-4xl font-bold text-white">{stats.totalOrganizations}</p>
                    </div>
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Badges</p>
                        <p className="text-4xl font-bold text-white">{stats.totalBadges}</p>
                    </div>
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total Records</p>
                        <p className="text-4xl font-bold text-white">{stats.totalRecords}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 mb-10">
                    <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Quick actions</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-300">View your organizations</span>
                            <Link href="/organizations" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                View all →
                            </Link>
                        </div>

                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-300">Create a new badge</span>
                            <Link href="/badge" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                Create →
                            </Link>
                        </div>

                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-300">View your records</span>
                            <Link href="/records" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                View all →
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
