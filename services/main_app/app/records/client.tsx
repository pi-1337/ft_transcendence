'use client'

import Link from 'next/link';

type Record = {
    id: number;
    badge: { number: string; org: { name: string } };
    createdAt: Date;
};

type Props = {
    records: Record[];
};

export default function RecordsClient({ records }: Props) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-[#1f1f1f] px-8 py-4">
                <Link href="/user/dashboard" className="text-sm text-blue-400 hover:text-blue-300">
                    ← Back
                </Link>
                <span className="text-white font-semibold text-lg block mt-2">Badge Records</span>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-12">
                {records.length === 0 ? (
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-12 text-center">
                        <p className="text-gray-500">No records yet.</p>
                    </div>
                ) : (
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <div className="space-y-3">
                            {records.map((record, idx) => (
                                <div key={record.id}>
                                    <Link href={`/records/${record.id}`}>
                                        <div className="flex items-center justify-between py-3 px-3 hover:bg-[#1f1f1f] rounded-lg transition-colors cursor-pointer">
                                            <div>
                                                <p className="text-sm text-gray-300">Badge {record.badge.number}</p>
                                                <p className="text-xs text-gray-500">{record.badge.org.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">{new Date(record.createdAt).toLocaleDateString()}</p>
                                                <p className="text-xs text-blue-400">View →</p>
                                            </div>
                                        </div>
                                    </Link>
                                    {idx < records.length - 1 && <div className="h-px bg-[#1f1f1f]" />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
