'use client'

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock data for organizations
const mockOrganizations: Record<string, any> = {
    '1': { id: 1, name: 'Acme Corporation' },
    '2': { id: 2, name: 'Tech Startup Inc' },
    '3': { id: 3, name: 'Global Services Ltd' }
};

export default function CreateBadge() {
    const params = useParams();
    const router = useRouter();
    const orgId = params.id as string;
    const org = mockOrganizations[orgId];

    const [badgeNumber, setBadgeNumber] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!badgeNumber.trim()) {
            setError('Badge number is required');
            return;
        }

        setSubmitted(true);
        setTimeout(() => {
            router.push(`/badge`);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top bar */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/organizations/${org.id}`} className="text-gray-500 hover:text-white text-sm transition-colors">
                        ← {org.name}
                    </Link>
                    <span className="text-[#333]">/</span>
                    <span className="text-white font-semibold">Create Badge</span>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-8 py-12">
                <div className="mb-10">
                    <h1 className="text-2xl font-semibold mb-2">Create Badge</h1>
                    <p className="text-gray-400">Create a new badge for {org.name}</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-3">
                        {error}
                    </div>
                )}

                {submitted && (
                    <div className="mb-6 rounded-lg bg-green-900/40 border border-green-600 text-green-400 text-sm px-4 py-3">
                        Badge created successfully! Redirecting...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-3">Badge Number</label>
                            <input
                                type="text"
                                value={badgeNumber}
                                onChange={(e) => setBadgeNumber(e.target.value)}
                                placeholder="Enter badge number (e.g., BADGE-001)"
                                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition-colors"
                            />
                            <p className="text-xs text-gray-600 mt-2">
                                The badge number will be associated with your account and this organization.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-6 py-2.5 transition-colors flex-1"
                        >
                            Create Badge
                        </button>
                        <Link
                            href={`/organizations/${org.id}`}
                            className="text-gray-400 hover:text-white border border-[#333] hover:border-gray-500 rounded-lg px-6 py-2.5 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    );
}
