'use client'

import { OrgsFrontend } from '@/lib/types';
import Link from 'next/link';

export default function Organizations({ orgs }: { orgs: OrgsFrontend[] }) {

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top bar */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
                        ← Dashboard
                    </Link>
                    <span className="text-[#333]">/</span>
                    <span className="text-white font-semibold">Organizations</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-8 py-10">
                <h1 className="text-xl font-semibold mb-6">Your Organizations ({orgs.length})</h1>

                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#1f1f1f]">
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Name</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Type</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Service</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Badges</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Status</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {orgs.map((org, i) => (
                                <tr
                                    key={org.id}
                                    className={i !== orgs.length - 1 ? 'border-b border-[#1a1a1a]' : ''}
                                >
                                    <td className="px-5 py-3 text-white font-medium">{org.name}</td>
                                    <td className="px-5 py-3 text-gray-400">{org.type}</td>
                                    <td className="px-5 py-3 text-gray-400">{org.service}</td>
                                    <td className="px-5 py-3 text-gray-400">{org.badgeTimes}</td>
                                    <td className="px-5 py-3">
                                        <span className="text-xs bg-green-600/20 text-green-400 border border-green-600/30 rounded-full px-2.5 py-1">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <Link
                                            href={`/organizations/${org.id}`}
                                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            View →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
