'use client'

import Link from 'next/link';
import { useState } from 'react';
import { Shield, ChevronLeft, Award, Building2, Tag, Calendar, Activity, ArrowRight, ExternalLink, Info } from 'lucide-react';

// Mock data for badges
const mockBadges = [
    {
        number: 'BADGE-001',
        userId: 1,
        orgId: 1,
        orgName: 'Acme Corporation',
        createdAt: new Date('2024-01-15'),
        records: 12
    },
    {
        number: 'BADGE-002',
        userId: 1,
        orgId: 2,
        orgName: 'Tech Startup Inc',
        createdAt: new Date('2024-02-20'),
        records: 8
    }
];

const mockRecords = [
    {
        id: 1,
        badgeNumber: 'BADGE-001',
        timestamp: new Date('2024-01-20 10:30:00'),
        action: 'Entry'
    },
    {
        id: 2,
        badgeNumber: 'BADGE-001',
        timestamp: new Date('2024-01-20 17:00:00'),
        action: 'Exit'
    },
    {
        id: 3,
        badgeNumber: 'BADGE-001',
        timestamp: new Date('2024-01-21 09:15:00'),
        action: 'Entry'
    },
    {
        id: 4,
        badgeNumber: 'BADGE-001',
        timestamp: new Date('2024-01-21 18:45:00'),
        action: 'Exit'
    }
];

export default function BadgeDetails() {
    const [selectedBadge, setSelectedBadge] = useState(mockBadges[0]);
    const badgeRecords = mockRecords.filter(r => r.badgeNumber === selectedBadge.number);

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
                        <span className="text-white font-bold tracking-tight">Badges</span>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-8 py-12">
                <div className="flex items-center gap-4 mb-10">
                    <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
                        <Award className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Your Badges</h1>
                        <p className="text-gray-500 mt-1">Select a badge to view detailed access records</p>
                    </div>
                </div>

                {/* Badge Selection */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {mockBadges.map((badge) => (
                        <button
                            key={badge.number}
                            onClick={() => setSelectedBadge(badge)}
                            className={`group relative text-left bg-[#0b1120]/50 border rounded-3xl p-8 transition-all duration-300 overflow-hidden ${
                                selectedBadge.number === badge.number
                                    ? 'border-indigo-500 shadow-xl shadow-indigo-500/10'
                                    : 'border-gray-800 hover:border-gray-700'
                            }`}
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] rounded-full pointer-events-none transition-opacity ${
                                selectedBadge.number === badge.number ? 'opacity-100' : 'opacity-0'
                            }`} />
                            
                            <div className="flex items-center justify-between mb-4">
                                <div className={`font-mono text-xl font-black tracking-wider ${
                                    selectedBadge.number === badge.number ? 'text-indigo-400' : 'text-gray-400'
                                }`}>
                                    {badge.number}
                                </div>
                                <div className={`p-2 rounded-xl border transition-colors ${
                                    selectedBadge.number === badge.number 
                                        ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' 
                                        : 'bg-gray-800/50 border-gray-700 text-gray-500'
                                }`}>
                                    <Tag className="w-4 h-4" />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-300 mb-6">
                                <Building2 className="w-4 h-4 text-gray-500" />
                                <span className="font-bold">{badge.orgName}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Activity className="w-3 h-3" />
                                    <span>{badge.records} records</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    <span>{badge.createdAt.toLocaleDateString()}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Badge Details Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Badge Information Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#0b1120]/50 border border-gray-800 rounded-[2.5rem] p-8 relative overflow-hidden h-full">
                            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Info className="w-3.5 h-3.5" />
                                Badge Information
                            </h2>
                            
                            <div className="space-y-6">
                                {[
                                    { label: 'Badge Number', value: selectedBadge.number, font: 'font-mono text-indigo-400' },
                                    { label: 'Organization', value: selectedBadge.orgName, font: 'text-white font-bold' },
                                    { label: 'Date Issued', value: selectedBadge.createdAt.toLocaleDateString(), font: 'text-gray-300' },
                                    { label: 'Record Count', value: badgeRecords.length, font: 'text-white font-black' }
                                ].map((item, idx) => (
                                    <div key={item.label}>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-wider">{item.label}</span>
                                            <span className={item.font}>{item.value}</span>
                                        </div>
                                        {idx < 3 && <div className="h-px bg-gray-800/50 mt-4" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Records Table Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#0b1120]/50 border border-gray-800 rounded-[2.5rem] overflow-hidden h-full">
                            <div className="p-8 border-b border-gray-800 bg-gray-900/20 flex items-center justify-between">
                                <h2 className="text-white font-bold tracking-tight flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-indigo-500" />
                                    Recent Records
                                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full px-2 py-0.5 ml-2">
                                        {badgeRecords.length} entries
                                    </span>
                                </h2>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-800 bg-gray-900/10">
                                            <th className="text-left text-gray-500 font-bold uppercase tracking-widest text-[10px] px-8 py-5">Timestamp</th>
                                            <th className="text-left text-gray-500 font-bold uppercase tracking-widest text-[10px] px-8 py-5">Action</th>
                                            <th className="px-8 py-5" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/50">
                                        {badgeRecords.map((record) => (
                                            <tr key={record.id} className="hover:bg-white/5 transition-all group/row">
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-2 text-gray-300">
                                                        <Calendar className="w-4 h-4 text-gray-600" />
                                                        {record.timestamp.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                                                        record.action === 'Entry'
                                                            ? 'bg-green-500/10 text-green-400 border border-green-600/20'
                                                            : 'bg-orange-500/10 text-orange-400 border border-orange-600/20'
                                                    }`}>
                                                        <span className={`w-1 h-1 rounded-full ${record.action === 'Entry' ? 'bg-green-400' : 'bg-orange-400'}`} />
                                                        {record.action}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <Link
                                                        href={`/records/${record.id}`}
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors group/link"
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
                    </div>
                </div>
            </main>
        </div>
    );
}
