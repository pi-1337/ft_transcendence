'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Org = { id: number; name: string };

type Props = {
    organizations: Org[];
};

export default function CreateReaderForm({ organizations }: Props) {
    const router = useRouter();
    const [location, setLocation] = useState('');
    const [organizationId, setorganizationId] = useState<number | ''>(organizations[0]?.id ?? '');
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location.trim() || organizationId === '') return;

        setLoading(true);
        setServerError('');
        try {
            const res = await fetch('/api/admin/rfcReaders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ location, organizationId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setServerError(data.error || 'Something went wrong.');
                return;
            }
            router.push('/admin/rfcReaders');
        } catch {
            setServerError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center gap-4">
                <Link href="/admin/rfcReaders" className="text-gray-500 hover:text-white text-sm transition-colors">
                    ← RFC Readers
                </Link>
                <span className="text-[#333]">/</span>
                <span className="text-white font-semibold">Add reader</span>
            </header>

            <main className="max-w-lg mx-auto px-8 py-12">
                <h1 className="text-xl font-semibold mb-8">Create new RFC reader</h1>

                {serverError && (
                    <div className="mb-6 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-3">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Location</label>
                        <input
                            type="text"
                            placeholder="e.g. Main entrance"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Organization</label>
                        <select
                            value={organizationId}
                            onChange={(e) => setorganizationId(Number(e.target.value))}
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            {organizations.map((org) => (
                                <option key={org.id} value={org.id}>{org.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
                    >
                        {loading ? 'Creating...' : 'Create reader'}
                    </button>
                </form>
            </main>
        </div>
    );
}
