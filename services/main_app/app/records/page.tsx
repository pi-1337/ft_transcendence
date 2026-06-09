'use client'

import Link from 'next/link';
import { useState } from 'react';
import { Shield, ChevronLeft, ClipboardList, Filter, Calendar, Building2, Tag, ArrowRight, ExternalLink } from 'lucide-react';

// Mock data for records
const mockRecords = [
    {
        id: 1,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        action: 'Entry',
        timestamp: new Date('2024-01-20 10:30:00')
    },
    {
        id: 2,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        action: 'Exit',
        timestamp: new Date('2024-01-20 17:00:00')
    },
    {
        id: 3,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        action: 'Entry',
        timestamp: new Date('2024-01-21 09:15:00')
    },
    {
        id: 4,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        action: 'Exit',
        timestamp: new Date('2024-01-21 18:45:00')
    },
    {
        id: 5,
        badgeNumber: 'BADGE-002',
        orgName: 'Tech Startup Inc',
        action: 'Entry',
        timestamp: new Date('2024-01-22 08:00:00')
    },
    {
        id: 6,
        badgeNumber: 'BADGE-002',
        orgName: 'Tech Startup Inc',
        action: 'Exit',
        timestamp: new Date('2024-01-22 17:30:00')
    },
    {
        id: 7,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        action: 'Entry',
        timestamp: new Date('2024-01-22 09:00:00')
    },
    {
        id: 8,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        action: 'Exit',
        timestamp: new Date('2024-01-22 18:00:00')
    }
];

export default function Records() {
    const [records] = useState(mockRecords);
    const [filterBadge, setFilterBadge] = useState('');

    const filteredRecords = filterBadge
        ? records.filter(r => r.badgeNumber === filterBadge)
        : records;

    const uniqueBadges = Array.from(new Set(records.map(r => r.badgeNumber)));

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
                        <span className="text-white font-bold tracking-tight">Records</span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
                            <ClipboardList className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Your Records</h1>
                            <p className="text-gray-500 mt-1 flex items-center gap-2">
                                <Tag className="w-3.5 h-3.5" />
                                {filteredRecords.length} entries found
                            </p>
                        </div>
                    </div>

                    {/* Filter UI */}
                    <div className="flex flex-wrap gap-2 items-center bg-gray-900/30 p-1.5 rounded-2xl border border-gray-800/50">
                        <div className="px-3 text-gray-500 flex items-center gap-2">
                            <Filter className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Filter:</span>
                        </div>
                        <button
                            onClick={() => setFilterBadge('')}
                            className={`text-[12px] font-bold px-4 py-2 rounded-xl transition-all ${
                                filterBadge === ''
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                        >
                            All Badges
                        </button>
                        {uniqueBadges.map(badge => (
                            <button
                                key={badge}
                                onClick={() => setFilterBadge(badge)}
                                className={`text-[12px] font-mono font-bold px-4 py-2 rounded-xl transition-all ${
                                    filterBadge === badge
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                            >
                                {badge}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Records Table */}
                <div className="bg-[#0b1120]/50 border border-gray-800 rounded-[2rem] overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800 bg-gray-900/20">
                                    <th className="text-left text-gray-500 font-bold uppercase tracking-widest text-[10px] px-8 py-5">Badge ID</th>
                                    <th className="text-left text-gray-500 font-bold uppercase tracking-widest text-[10px] px-8 py-5">Organization</th>
                                    <th className="text-left text-gray-500 font-bold uppercase tracking-widest text-[10px] px-8 py-5">Action</th>
                                    <th className="text-left text-gray-500 font-bold uppercase tracking-widest text-[10px] px-8 py-5">Timestamp</th>
                                    <th className="px-8 py-5" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {filteredRecords.map((record) => (
                                    <tr
                                        key={record.id}
                                        className="hover:bg-white/5 transition-all group/row"
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                                                    <Tag className="w-4 h-4 text-indigo-400" />
                                                </div>
                                                <span className="text-white font-mono font-bold">{record.badgeNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Building2 className="w-4 h-4 text-gray-500" />
                                                {record.orgName}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                                                record.action === 'Entry'
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                    : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                            }`}>
                                                <span className={`w-1 h-1 rounded-full ${record.action === 'Entry' ? 'bg-green-400' : 'bg-orange-400'}`} />
                                                {record.action}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar className="w-4 h-4 text-gray-600" />
                                                {record.timestamp.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <Link
                                                href={`/records/${record.id}`}
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

                    {filteredRecords.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="bg-gray-800/50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-700">
                                <ClipboardList className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-white font-bold text-lg">No records found</h3>
                            <p className="text-gray-500">Try adjusting your filters to see more entries.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
