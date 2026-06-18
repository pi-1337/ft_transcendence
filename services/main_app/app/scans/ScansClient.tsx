'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RequestPopup from './RequestPopup';

type Scan = {
    id: number;
    timestampUtc: Date;
    status: string;
    badgeId: string;
};

type Props = {
    recentScans: Scan[];
    pendingScanId: number | null;
};

export default function ScansClient({ recentScans, pendingScanId }: Props) {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 1000);
        return () => clearInterval(interval);
    }, [router]);

    return (
        <main className="min-h-screen bg-zinc-950 p-10 text-white font-sans">
            {pendingScanId && <RequestPopup requestId={pendingScanId} />}

            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 border-b border-zinc-800 pb-4 text-emerald-400">
                    Live Gate Activity
                </h1>
                {recentScans.length === 0 ? (
                    <p className="text-zinc-500">No badge scans recorded yet.</p>
                ) : (
                    <div className="space-y-4">
                        {recentScans.map((scan) => (
                            <div
                                key={scan.id}
                                className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-5 rounded-lg shadow-md"
                            >
                                <div className="text-right">
                                    <span className="inline-block px-3 py-1 bg-emerald-900/50 text-emerald-400 text-xs rounded-full mb-2">
                                        {scan.status}
                                    </span>
                                    <span className="inline-block px-3 py-1 bg-emerald-900/50 text-emerald-400 text-xs rounded-full mb-2">
                                        {scan.badgeId}
                                    </span>
                                    <p className="text-xs text-zinc-400 font-mono">
                                        {new Date(scan.timestampUtc).toISOString().replace('T', ' ').slice(0, 19)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
