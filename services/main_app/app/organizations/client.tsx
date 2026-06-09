'use client'

import { OrgsFrontend } from '@/lib/types';
import Link from 'next/link';
import { Shield, ChevronLeft, Building2, Tag, ArrowRight, ExternalLink, Activity, Layers } from 'lucide-react';

export default function Organizations({ orgs }: { orgs: OrgsFrontend[] }) {

    return (
        <div className="min-h-screen bg-[#030712] text-white font-sans">
            {/* Top bar */}
            <header className="border-b border-gray-800 bg-[#030712]/80 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-all group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </Link>
                    <div className="w-px h-4 bg-gray-800" />
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-500" />
                        <span className="text-white font-bold tracking-tight">Organizations</span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-8 py-12">
                <div className="flex items-center gap-4 mb-10">
                    <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
                        <Building2 className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Your Organizations</h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5" />
                            {orgs.length} active organizations
                        </p>
                    </div>
                </div>

                <div className="bg-[#0b1120]/50 border border-gray-800 rounded-[2rem] overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800 bg-gray-900/20">
                                    <th className="text-left text-gray-500 font-bold uppercase tracking-widest text-[10px] px-8 py-5">Organization Name</th>
                                    <th className="text-left text-gray-500 font-bold uppercase tracking-widest text-[10px] px-8 py-5">Type</th>
                                    <th className="text-left text-gray-500 font-bold uppercase tracking-widest text-[10px] px-8 py-5">Service</th>
                                    <th className="text-left text-gray-500 font-bold uppercase tracking-widest text-[10px] px-8 py-5">Badges</th>
                                    <th className="text-left text-gray-500 font-bold uppercase tracking-widest text-[10px] px-8 py-5">Status</th>
                                    <th className="px-8 py-5" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {orgs.map((org) => (
                                    <tr
                                        key={org.id}
                                        className="hover:bg-white/5 transition-all group/row"
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 group-hover/row:scale-110 transition-transform">
                                                    <Building2 className="w-5 h-5 text-indigo-400" />
                                                </div>
                                                <span className="text-white font-bold text-base">{org.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-gray-400 font-medium bg-gray-800/30 px-3 py-1 rounded-lg border border-gray-700/50">
                                                {org.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Layers className="w-4 h-4 text-gray-500" />
                                                {org.service}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-indigo-400" />
                                                <span className="text-white font-black">{org.badgeTimes}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 uppercase tracking-wider">
                                                <span className="w-1 h-1 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <Link
                                                href={`/organizations/${org.id}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors group/link"
                                            >
                                                Details
                                                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
