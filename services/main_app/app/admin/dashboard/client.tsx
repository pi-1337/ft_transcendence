'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
                        
                    </div>
                </div>
            </main>
        </div>
    );
}
