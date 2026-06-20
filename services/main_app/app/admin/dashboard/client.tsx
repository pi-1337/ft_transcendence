'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Users, Building2, Radio, LogOut, ArrowRight, Activity, LayoutGrid, Megaphone } from 'lucide-react';

type Props = {
    firstname: string;
    lastname: string;
    email: string;
    totalUsers: number;
    totalOrgs: number;
    totalReaders: number;
};

export default function AdminDashboard({ firstname, lastname, email, totalUsers, totalOrgs, totalReaders }: Props) {
    const router = useRouter();

    const stats = [
        { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Total Organizations', value: totalOrgs, icon: Building2, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { label: 'RFC Readers', value: totalReaders, icon: Radio, color: 'text-purple-400', bg: 'bg-purple-500/10' },
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
                    <span className="text-white font-bold text-lg tracking-tight">Admin Panel</span>
                    <span className="text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5 tracking-wider uppercase">
                        System Admin
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 px-3 py-2 rounded-lg transition-all border border-transparent hover:border-red-400/20"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                </button>
            </header>

            <main className="max-w-5xl mx-auto px-8 py-12">
                {/* Greeting */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">
                        Welcome, <span className="text-indigo-400">{firstname} {lastname}</span>
                    </h1>
                    <p className="text-gray-500 flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5" />
                        Administrator Access • {email}
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
                            
                            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-${stat.color.split('-')[1]}-500/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </div>
                    ))}
                </div>

                {/* Management Sections */}
                <div className="bg-[#0b1120]/50 border border-gray-800 rounded-[2rem] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
                    
                    <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                        <LayoutGrid className="w-3.5 h-3.5" />
                        System Management
                    </h2>
                    
                    <div className="grid gap-4">
                        {[
                            { title: 'Manage user accounts', link: '/admin/users', icon: Users, action: 'Manage Users' },
                            { title: 'Organizations', link: '/organizations', icon: Building2, action: 'See Orgs' },
                            { title: 'System organizations', link: '/admin/orgs', icon: Building2, action: 'Manage Orgs' },
                            { title: 'RFC Reader hardware', link: '/admin/rfcReaders', icon: Radio, action: 'Manage Readers' },
                            { title: 'Announcements', link: '/admin/announcements', icon: Megaphone, action: 'Manage Announcements' }
                        ].map((item, idx) => (
                            <div key={item.title} className="group">
                                <div className="flex items-center justify-between p-5 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-gray-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-800/50 rounded-xl flex items-center justify-center border border-gray-700 group-hover:border-indigo-500/50 transition-colors">
                                            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                                        </div>
                                        <span className="text-gray-200 font-bold">{item.title}</span>
                                    </div>
                                    <Link 
                                        href={item.link} 
                                        className="flex items-center gap-2 text-sm font-black text-indigo-400 hover:text-indigo-300 transition-colors group/link"
                                    >
                                        {item.action}
                                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                                {idx < 3 && <div className="h-px bg-gray-800/50 mx-6" />}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
