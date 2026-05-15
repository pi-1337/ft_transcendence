'use client'

import Link from 'next/link';
import { useState } from 'react';

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
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top bar */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
                        ← Dashboard
                    </Link>
                    <span className="text-[#333]">/</span>
                    <span className="text-white font-semibold">Badges</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-8 py-12">
                <h1 className="text-2xl font-semibold mb-8">Your Badges</h1>

                {/* Badge Selection */}
                <div className="grid grid-cols-2 gap-6 mb-10">
                    {mockBadges.map((badge) => (
                        <button
                            key={badge.number}
                            onClick={() => setSelectedBadge(badge)}
                            className={`text-left bg-[#111] border rounded-2xl p-6 transition-all ${
                                selectedBadge.number === badge.number
                                    ? 'border-blue-600 ring-1 ring-blue-600/50'
                                    : 'border-[#1f1f1f] hover:border-[#333]'
                            }`}
                        >
                            <div className="font-mono text-lg font-bold text-blue-400 mb-2">{badge.number}</div>
                            <div className="text-sm text-gray-400 mb-4">{badge.orgName}</div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">{badge.records} records</span>
                                <span className="text-xs text-gray-600">
                                    {badge.createdAt.toLocaleDateString()}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Badge Details */}
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 mb-10">
                    <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-6">Badge Information</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Badge Number</span>
                            <span className="text-white font-mono">{selectedBadge.number}</span>
                        </div>
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex justify-between">
                            <span className="text-gray-400">Organization</span>
                            <span className="text-white">{selectedBadge.orgName}</span>
                        </div>
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex justify-between">
                            <span className="text-gray-400">Created</span>
                            <span className="text-white">{selectedBadge.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Records</span>
                            <span className="text-white">{badgeRecords.length}</span>
                        </div>
                    </div>
                </div>

                {/* Recent Records */}
                <div>
                    <h2 className="text-xl font-semibold mb-6">Recent Records ({badgeRecords.length})</h2>
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#1f1f1f]">
                                    <th className="text-left text-gray-500 font-medium px-5 py-3">Timestamp</th>
                                    <th className="text-left text-gray-500 font-medium px-5 py-3">Action</th>
                                    <th className="px-5 py-3" />
                                </tr>
                            </thead>
                            <tbody>
                                {badgeRecords.map((record, i) => (
                                    <tr
                                        key={record.id}
                                        className={i !== badgeRecords.length - 1 ? 'border-b border-[#1a1a1a]' : ''}
                                    >
                                        <td className="px-5 py-3 text-white">
                                            {record.timestamp.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                                record.action === 'Entry'
                                                    ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                                                    : 'bg-orange-600/20 text-orange-400 border border-orange-600/30'
                                            }`}>
                                                {record.action}
                                            </span>
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
                </div>
            </main>
        </div>
    );
}
