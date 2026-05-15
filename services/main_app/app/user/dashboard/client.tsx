'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Props = {
    user: {
        firstname: string;
        lastname: string;
        email: string;
        badge: Array<{ number: string }>;
        orgs: Array<{ id: number; name: string }>;
    }
};

export default function UserDashboard({ user }: Props) {
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
                    <span className="text-white font-semibold text-lg">Dashboard</span>
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
                        Welcome, {user.firstname} {user.lastname}
                    </h1>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Your Badge</p>
                        <p className="text-4xl font-bold text-white">{user.badge.length > 0 ? user.badge[0].number : 'None'}</p>
                    </div>
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Organizations</p>
                        <p className="text-4xl font-bold text-white">{user.orgs.length}</p>
                    </div>
                </div>

                {/* Organizations */}
                {user.orgs.length > 0 && (
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 mb-8">
                        <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Your organizations</h2>
                        <div className="flex flex-col gap-3">
                            {user.orgs.map((org, idx) => (
                                <div key={org.id}>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm text-gray-300">{org.name}</span>
                                        <Link href={`/organizations/${org.id}`} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                            View →
                                        </Link>
                                    </div>
                                    {idx < user.orgs.length - 1 && <div className="h-px bg-[#1f1f1f]" />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                    <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Quick actions</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-300">View all badges</span>
                            <Link href="/badges" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                View all →
                            </Link>
                        </div>

                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-300">View badge records</span>
                            <Link href="/records" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                View all →
                            </Link>
                        </div>

                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-300">Notifications</span>
                            <Link href="/notifications" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                View all →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
