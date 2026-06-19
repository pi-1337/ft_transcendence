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

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top bar */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-white font-semibold text-lg">Admin Panel</span>
                    <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-2.5 py-0.5">
                        ADMIN
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="text-sm text-gray-400 hover:text-red-400 border border-[#333] hover:border-red-600 rounded-lg px-4 py-1.5 transition-colors"
                >
                    Log out
                </button>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-12">
                {/* Greeting */}
                <div className="mb-10">
                    <h1 className="text-2xl font-semibold mb-1">
                        Welcome, {firstname} {lastname}
                    </h1>
                    <p className="text-gray-500 text-sm">{email}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total users</p>
                        <p className="text-4xl font-bold text-white">{totalUsers}</p>
                    </div>
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total organizations</p>
                        <p className="text-4xl font-bold text-white">{totalOrgs}</p>
                    </div>
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Total RFC readers</p>
                        <p className="text-4xl font-bold text-white">{totalReaders}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                    <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Quick actions</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-300">Manage users</span>
                            <Link href="/admin/users" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                View all →
                            </Link>
                        </div>

<<<<<<< HEAD
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-300">Manage organizations</span>
                            <Link href="/admin/orgs" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                View all →
                            </Link>
                        </div>

                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-300">Manage RFC Readers</span>
                            <Link href="/admin/rfcReaders" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                View all →
                            </Link>
                        </div>
                        
=======
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
