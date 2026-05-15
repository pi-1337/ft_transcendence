'use client'

import { useState } from 'react';
import Link from 'next/link';

type Org = {
    id: number;
    name: string;
    type: string;
    service: string;
    active: 'TRUE' | 'FALSE';
    admins: { id: number; firstname: string; lastname: string }[];
    _count: { users: number };
    createdAt: Date;
};

type Props = {
    orgs: Org[];
};

export default function OrgsTable({ orgs: initialOrgs }: Props) {
    const [orgs] = useState(initialOrgs);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
                        ← Admin Panel
                    </Link>
                    <span className="text-[#333]">/</span>
                    <span className="text-white font-semibold">Organizations</span>
                </div>
                <Link
                    href="/admin/orgs/create"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg px-4 py-1.5 transition-colors"
                >
                    + Create org
                </Link>
            </header>

            <main className="max-w-6xl mx-auto px-8 py-10">
                <h1 className="text-xl font-semibold mb-6">All organizations ({orgs.length})</h1>

                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#1f1f1f]">
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Name</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Type</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Service</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Status</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Members</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Admins</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Created</th>
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
                                    <td className="px-5 py-3">
                                        {org.active === 'TRUE' ? (
                                            <span className="text-xs bg-green-600/20 text-green-400 border border-green-600/30 rounded-full px-2.5 py-0.5">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-[#1a1a1a] text-gray-500 border border-[#2a2a2a] rounded-full px-2.5 py-0.5">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-gray-400">{org._count.users}</td>
                                    <td className="px-5 py-3 text-gray-400">
                                        {org.admins.length === 0
                                            ? <span className="text-gray-600 italic">none</span>
                                            : org.admins.map(a => `${a.firstname} ${a.lastname}`).join(', ')
                                        }
                                    </td>
                                    <td className="px-5 py-3 text-gray-500">
                                        {new Date(org.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3">
                                        <Link
                                            href={`/admin/orgs/${org.id}`}
                                            className="text-xs text-gray-400 hover:text-white border border-[#333] hover:border-[#555] rounded-md px-3 py-1 transition-colors"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {orgs.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-8 text-center text-gray-600">
                                        No organizations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
