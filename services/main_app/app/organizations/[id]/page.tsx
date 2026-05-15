'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

// Mock data for organizations
const mockOrganizations: Record<string, any> = {
    '1': {
        id: 1,
        name: 'Acme Corporation',
        type: 'Enterprise',
        service: 'Badge Management',
        badgeTimes: 5,
        active: 'TRUE',
        createdAt: new Date('2024-01-15'),
        members: 24,
        badges: 5,
        description: 'A leading enterprise providing comprehensive badge management solutions.'
    },
    '2': {
        id: 2,
        name: 'Tech Startup Inc',
        type: 'Startup',
        service: 'Access Control',
        badgeTimes: 3,
        active: 'TRUE',
        createdAt: new Date('2024-02-20'),
        members: 12,
        badges: 3,
        description: 'Innovative startup focused on modern access control systems.'
    },
    '3': {
        id: 3,
        name: 'Global Services Ltd',
        type: 'Enterprise',
        service: 'Employee Tracking',
        badgeTimes: 8,
        active: 'TRUE',
        createdAt: new Date('2024-03-10'),
        members: 156,
        badges: 8,
        description: 'Global organization specializing in employee tracking and management.'
    }
};

export default function OrgDetails() {
    const params = useParams();
    const orgId = params.id as string;
    const org = mockOrganizations[orgId];

    if (!org) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-2">Organization not found</h1>
                    <Link href="/organizations" className="text-blue-400 hover:text-blue-300">
                        Back to Organizations
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top bar */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/organizations" className="text-gray-500 hover:text-white text-sm transition-colors">
                        ← Organizations
                    </Link>
                    <span className="text-[#333]">/</span>
                    <span className="text-white font-semibold">{org.name}</span>
                </div>
                <Link
                    href={`/organizations/${org.id}/badge`}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg px-4 py-1.5 transition-colors"
                >
                    + Create Badge
                </Link>
            </header>

            <main className="max-w-5xl mx-auto px-8 py-12">
                {/* Organization Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold mb-2">{org.name}</h1>
                    <p className="text-gray-400">{org.description}</p>
                </div>

                {/* Organization Info */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Type</p>
                        <p className="text-2xl font-bold text-white">{org.type}</p>
                    </div>
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Members</p>
                        <p className="text-2xl font-bold text-white">{org.members}</p>
                    </div>
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Badges</p>
                        <p className="text-2xl font-bold text-white">{org.badges}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 mb-10">
                    <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-6">Organization Details</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Service</span>
                            <span className="text-white">{org.service}</span>
                        </div>
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex justify-between">
                            <span className="text-gray-400">Badge Times</span>
                            <span className="text-white">{org.badgeTimes}</span>
                        </div>
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex justify-between">
                            <span className="text-gray-400">Status</span>
                            <span className="text-green-400">Active</span>
                        </div>
                        <div className="h-px bg-[#1f1f1f]" />
                        <div className="flex justify-between">
                            <span className="text-gray-400">Created</span>
                            <span className="text-white">{org.createdAt.toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        href={`/organizations/${org.id}/badge`}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-6 py-2.5 transition-colors"
                    >
                        Create Badge
                    </Link>
                    <Link
                        href="/organizations"
                        className="text-gray-400 hover:text-white border border-[#333] hover:border-gray-500 rounded-lg px-6 py-2.5 transition-colors"
                    >
                        Back
                    </Link>
                </div>
            </main>
        </div>
    );
}
