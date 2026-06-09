'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserFrontend } from '@/lib/types';
import { Bell } from '@/components/notifications/bell';
import { Shield, LayoutDashboard, Award, Building2, LogOut, Settings, ExternalLink, Plus } from 'lucide-react';

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

    const stats = [
        { label: 'Organizations', value: totalOrganizations, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Badges', value: totalBadges, icon: Award, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { label: 'Total Records', value: totalRecords, icon: LayoutDashboard, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ];

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen bg-[#030712] text-white font-sans">
            {/* Top bar */}
            <header className="border-b border-gray-800 bg-[#030712]/80 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20">
                        <Shield className="w-5 h-5 text-indigo-500" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">BadgeHub</span>
                    <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full px-2 py-0.5 tracking-wider uppercase">
                        {user.role}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/settings"
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                        title="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </Link>
                    <div className="w-px h-4 bg-gray-800 mx-2" />
                    <Bell unreadCount={unreadCount} />
                    <button
                        onClick={handleLogout}
                        className="ml-2 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 px-3 py-2 rounded-lg transition-all border border-transparent hover:border-red-400/20"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-8 py-12">
                {/* Greeting */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">
                        Welcome back, <span className="text-indigo-400">{user.firstname}</span>!
                    </h1>
                    <p className="text-gray-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        {user.email}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-[#0b1120]/50 border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-all group relative overflow-hidden">
                            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-4xl font-black text-white">{stat.value}</p>
                            
                            {/* Decorative accent line */}
                            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-${stat.color.split('-')[1]}-500/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </div>
                    ))}
                </div>

                {/* Quick Actions & Activity */}
                <div className="grid md:grid-cols-1 gap-8">
                    <div className="bg-[#0b1120]/50 border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Plus className="w-3 h-3" />
                                Quick actions
                            </h2>
                        </div>
                        
                        <div className="grid gap-4">
                            {[
                                { title: 'View your organizations', link: '/organizations', action: 'View all' },
                                { title: 'Create a new badge', link: '/badge', action: 'Create' },
                                { title: 'View your records', link: '/records', action: 'View all' }
                            ].map((item, idx) => (
                                <div key={item.title} className="group">
                                    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-gray-800">
                                        <span className="text-gray-200 font-medium">{item.title}</span>
                                        <Link 
                                            href={item.link} 
                                            className="flex items-center gap-1.5 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            {item.action}
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                    {idx < 2 && <div className="h-px bg-gray-800/50 mx-4" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
