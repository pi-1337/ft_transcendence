'use client'

import Link from 'next/link';

type Badge = {
    number: string;
    org: { id: number; name: string };
    createdAt: Date;
} | null;

type Props = {
    badge: Badge;
};

export default function BadgesClient({ badge }: Props) {
    if (!badge) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <header className="border-b border-[#1f1f1f] px-8 py-4">
                    <span className="text-white font-semibold text-lg">Your Badge</span>
                </header>
                
                <main className="max-w-4xl mx-auto px-8 py-12">
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-12 text-center">
                        <p className="text-gray-500 mb-4">You haven't earned any badges yet.</p>
                        <p className="text-sm text-gray-600">Keep contributing to your organizations to earn a badge!</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-[#1f1f1f] px-8 py-4">
                <Link href="/user/dashboard" className="text-sm text-blue-400 hover:text-blue-300">
                    ← Back
                </Link>
                <span className="text-white font-semibold text-lg block mt-2">Your Badge</span>
            </header>

            <main className="max-w-2xl mx-auto px-8 py-12">
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full w-24 h-24 flex items-center justify-center mb-6">
                            <span className="text-4xl font-bold text-black">{badge.number}</span>
                        </div>
                        <h2 className="text-2xl font-semibold text-white mb-2">Badge {badge.number}</h2>
                        <p className="text-gray-400">From <span className="text-blue-400">{badge.org.name}</span></p>
                    </div>

                    <div className="h-px bg-[#1f1f1f] my-6" />

                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Organization</p>
                            <p className="text-sm text-gray-300">{badge.org.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Awarded</p>
                            <p className="text-sm text-gray-300">{new Date(badge.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="h-px bg-[#1f1f1f] my-6" />

                    <div className="flex gap-3">
                        <Link href={`/badges/${badge.number}`} className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                            View Details
                        </Link>
                        <Link href="/records" className="flex-1 text-center bg-[#1f1f1f] hover:bg-[#2f2f2f] text-gray-300 py-2 rounded-lg text-sm font-semibold transition-colors">
                            View Records
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
