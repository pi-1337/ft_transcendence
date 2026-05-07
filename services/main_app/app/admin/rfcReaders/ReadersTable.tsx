'use client'

import { useState } from 'react';
import Link from 'next/link';

type Reader = {
    id: number;
    location: string;
    organizationId: number;
    organization: { name: string };
};

type Props = {
    readers: Reader[];
};

export default function ReadersTable({ readers: initialReaders }: Props) {
    const [readers, setReaders] = useState(initialReaders);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this reader?')) return;

        setDeletingId(id);
        setError('');
        try {
            const res = await fetch(`/api/admin/rfcReaders/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to delete reader.');
                return;
            }
            setReaders((prev) => prev.filter((r) => r.id !== id));
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
                        ← Admin Panel
                    </Link>
                    <span className="text-[#333]">/</span>
                    <span className="text-white font-semibold">RFC Readers</span>
                </div>
                <Link
                    href="/admin/rfcReaders/create"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg px-4 py-1.5 transition-colors"
                >
                    + Add reader
                </Link>
            </header>

            <main className="max-w-5xl mx-auto px-8 py-10">
                <h1 className="text-xl font-semibold mb-6">All RFC readers ({readers.length})</h1>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-3">
                        {error}
                    </div>
                )}

                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#1f1f1f]">
                                <th className="text-left text-gray-500 font-medium px-5 py-3">ID</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Location</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Organization</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {readers.map((reader, i) => (
                                <tr key={reader.id} className={i !== readers.length - 1 ? 'border-b border-[#1a1a1a]' : ''}>
                                    <td className="px-5 py-3 text-gray-500">{reader.id}</td>
                                    <td className="px-5 py-3 text-white">{reader.location}</td>
                                    <td className="px-5 py-3 text-gray-400">{reader.organization.name}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDelete(reader.id)}
                                                disabled={deletingId === reader.id}
                                                className="text-xs text-red-500 hover:text-red-400 border border-[#333] hover:border-red-600 rounded-md px-3 py-1 transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === reader.id ? '...' : 'Delete'}
                                            </button>
                                        </div>
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
