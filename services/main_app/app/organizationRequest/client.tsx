'use client'

import { Organization } from '@prisma/client';

type Props = {
    organizations: Organization[];
};

export default function Client({ organizations }: Props) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <main className="max-w-2xl mx-auto px-8 py-12">
                <h1 className="text-2xl font-semibold mb-6">Organizations</h1>
                <div className="flex flex-col gap-3">
                    {organizations.map(org => (
                        <div key={org.id} className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                            <p className="text-white font-medium">{org.name}</p>
                            <p className="text-gray-500 text-sm">{org.type} — {org.service}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}