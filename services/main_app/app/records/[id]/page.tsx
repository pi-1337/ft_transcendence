'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

// Mock data for records
const mockRecordsData: Record<string, any> = {
    '1': {
        id: 1,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        orgId: 1,
        action: 'Entry',
        timestamp: new Date('2024-01-20 10:30:00'),
        location: 'Main Entrance',
        reader: 'RFID-Reader-001',
        status: 'Success'
    },
    '2': {
        id: 2,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        orgId: 1,
        action: 'Exit',
        timestamp: new Date('2024-01-20 17:00:00'),
        location: 'Main Entrance',
        reader: 'RFID-Reader-001',
        status: 'Success'
    },
    '3': {
        id: 3,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        orgId: 1,
        action: 'Entry',
        timestamp: new Date('2024-01-21 09:15:00'),
        location: 'Side Entrance',
        reader: 'RFID-Reader-002',
        status: 'Success'
    },
    '4': {
        id: 4,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        orgId: 1,
        action: 'Exit',
        timestamp: new Date('2024-01-21 18:45:00'),
        location: 'Main Entrance',
        reader: 'RFID-Reader-001',
        status: 'Success'
    },
    '5': {
        id: 5,
        badgeNumber: 'BADGE-002',
        orgName: 'Tech Startup Inc',
        orgId: 2,
        action: 'Entry',
        timestamp: new Date('2024-01-22 08:00:00'),
        location: 'Front Desk',
        reader: 'RFID-Reader-003',
        status: 'Success'
    },
    '6': {
        id: 6,
        badgeNumber: 'BADGE-002',
        orgName: 'Tech Startup Inc',
        orgId: 2,
        action: 'Exit',
        timestamp: new Date('2024-01-22 17:30:00'),
        location: 'Front Desk',
        reader: 'RFID-Reader-003',
        status: 'Success'
    },
    '7': {
        id: 7,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        orgId: 1,
        action: 'Entry',
        timestamp: new Date('2024-01-22 09:00:00'),
        location: 'Main Entrance',
        reader: 'RFID-Reader-001',
        status: 'Success'
    },
    '8': {
        id: 8,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        orgId: 1,
        action: 'Exit',
        timestamp: new Date('2024-01-22 18:00:00'),
        location: 'Main Entrance',
        reader: 'RFID-Reader-001',
        status: 'Success'
    }
};

export default function RecordDetails() {
    const params = useParams();
    const recordId = params.id as string;
    const record = mockRecordsData[recordId];

    if (!record) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                {/* Top bar */}
                <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/records" className="text-gray-500 hover:text-white text-sm transition-colors">
                            ← Records
                        </Link>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-8 py-12 flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold mb-2">Record not found</h1>
                        <Link href="/records" className="text-blue-400 hover:text-blue-300">
                            Back to Records
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top bar */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/records" className="text-gray-500 hover:text-white text-sm transition-colors">
                        ← Records
                    </Link>
                    <span className="text-[#333]">/</span>
                    <span className="text-white font-semibold">Record #{record.id}</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-12">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-4">
                        <h1 className="text-3xl font-bold">Record #{record.id}</h1>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            record.action === 'Entry'
                                ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                                : 'bg-orange-600/20 text-orange-400 border border-orange-600/30'
                        }`}>
                            {record.action}
                        </span>
                    </div>
                    <p className="text-gray-400">{record.badgeNumber} • {record.orgName}</p>
                </div>

                {/* Status */}
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 mb-8">
                    <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-6">Status</h2>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-lg font-semibold">{record.status}</span>
                    </div>
                </div>

                {/* Details */}
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 mb-8">
                    <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-6">Record Details</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Record ID</span>
                            <span className="text-white font-mono">#{record.id}</span>
                        </div>
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex justify-between">
                            <span className="text-gray-400">Badge Number</span>
                            <span className="text-white font-mono">{record.badgeNumber}</span>
                        </div>
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex justify-between">
                            <span className="text-gray-400">Organization</span>
                            <span className="text-white">
                                <Link href={`/organizations/${record.orgId}`} className="hover:text-blue-400 transition-colors">
                                    {record.orgName} →
                                </Link>
                            </span>
                        </div>
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex justify-between">
                            <span className="text-gray-400">Action Type</span>
                            <span className="text-white">{record.action}</span>
                        </div>
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex justify-between">
                            <span className="text-gray-400">Timestamp</span>
                            <span className="text-white">{record.timestamp.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Location & Device Info */}
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                    <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-6">Access Point Information</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Location</span>
                            <span className="text-white">{record.location}</span>
                        </div>
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex justify-between">
                            <span className="text-gray-400">RFID Reader</span>
                            <span className="text-white font-mono">{record.reader}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-10">
                    <Link
                        href="/records"
                        className="text-gray-400 hover:text-white border border-[#333] hover:border-gray-500 rounded-lg px-6 py-2.5 transition-colors"
                    >
                        Back to Records
                    </Link>
                    <Link
                        href={`/badge`}
                        className="text-gray-400 hover:text-white border border-[#333] hover:border-gray-500 rounded-lg px-6 py-2.5 transition-colors"
                    >
                        View Badge
                    </Link>
                </div>
            </main>
        </div>
    );
}
