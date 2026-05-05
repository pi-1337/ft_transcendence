'use client'

import { useRouter } from 'next/navigation';

type Props = {
    firstname: string;
    lastname: string;
    email: string;
};

export default function Client({ firstname, lastname, email }: Props) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top bar */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <span className="text-white font-semibold text-lg">Dashboard</span>
                <button
                    onClick={handleLogout}
                    className="text-sm text-gray-400 hover:text-red-400 border border-[#333] hover:border-red-600 rounded-lg px-4 py-1.5 transition-colors"
                >
                    Log out
                </button>
            </header>

            {/* Content */}
            <main className="max-w-2xl mx-auto px-8 py-12">
                <h1 className="text-2xl font-semibold mb-2">
                    Welcome, {firstname} {lastname}
                </h1>
                <p className="text-gray-500 text-sm mb-10">{email}</p>

                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                    <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Account info</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">First name</span>
                            <span className="text-white text-sm">{firstname}</span>
                        </div>
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Last name</span>
                            <span className="text-white text-sm">{lastname}</span>
                        </div>
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Email</span>
                            <span className="text-white text-sm">{email}</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

