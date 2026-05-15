'use client'

import Link from 'next/link';
import { useState } from 'react';

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
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top bar */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
                        ← Dashboard
                    </Link>
                    <span className="text-[#333]">/</span>
                    <span className="text-white font-semibold">Records</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-8 py-12">
                <h1 className="text-2xl font-semibold mb-8">Your Records ({filteredRecords.length})</h1>

                {/* Filter */}
                <div className="mb-6 flex gap-3">
                    <button
                        onClick={() => setFilterBadge('')}
                        className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                            filterBadge === ''
                                ? 'bg-blue-600 text-white'
                                : 'bg-[#111] text-gray-400 border border-[#1f1f1f] hover:border-[#333]'
                        }`}
                    >
                        All Badges
                    </button>
                    {uniqueBadges.map(badge => (
                        <button
                            key={badge}
                            onClick={() => setFilterBadge(badge)}
                            className={`text-sm px-4 py-2 rounded-lg transition-colors font-mono ${
                                filterBadge === badge
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-[#111] text-gray-400 border border-[#1f1f1f] hover:border-[#333]'
                            }`}
                        >
                            {badge}
                        </button>
                    ))}
                </div>

                {/* Records Table */}
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#1f1f1f]">
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Badge</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Organization</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Action</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Timestamp</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((record, i) => (
                                <tr
                                    key={record.id}
                                    className={i !== filteredRecords.length - 1 ? 'border-b border-[#1a1a1a]' : ''}
                                >
                                    <td className="px-5 py-3 text-white font-mono text-sm">{record.badgeNumber}</td>
                                    <td className="px-5 py-3 text-gray-400">{record.orgName}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                            record.action === 'Entry'
                                                ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                                                : 'bg-orange-600/20 text-orange-400 border border-orange-600/30'
                                        }`}>
                                            {record.action}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-gray-400 text-sm">
                                        {record.timestamp.toLocaleString()}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <Link
                                            href={`/records/${record.id}`}
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
