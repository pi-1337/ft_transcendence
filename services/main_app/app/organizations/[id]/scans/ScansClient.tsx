'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RequestPopup from './RequestPopup';
import Link from 'next/link';

type Scan = {
    id: number;
    createdAt: Date;
    status: string;
    badge: {
        user: {
            firstname: string;
            lastname: string;
            role: string;
        }
    }
};

type Props = {
    recentScans: Scan[];
    acceptedScanCount: number;
    orgName: string;
    orgId: number;
    pendingScan: Scan | null;
    activeMeal: { name: string; startTime: Date; endTime: Date } | null;
};


export default function ScansClient({ recentScans, acceptedScanCount, orgName, orgId, pendingScan, activeMeal }: Props) {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 1000);
        return () => clearInterval(interval);
    }, [router]);

    return (
        <main className="min-h-screen bg-zinc-950 p-10 text-white font-sans">
            {pendingScan && <RequestPopup scanData={pendingScan} />}
            
           <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-4">
                    <Link href={`/organizations/${orgId}`} className="text-zinc-500 hover:text-white text-sm transition-colors">
                        ← Back
                    </Link>
                </div>
                {activeMeal ? (
                    <div className="text-right">
                        <p className="text-emerald-400 font-semibold text-sm">{activeMeal.name}</p>
                        <p className="text-zinc-400 text-xs font-mono">
                            {new Date(activeMeal.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {' – '}
                            {new Date(activeMeal.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                ) : (
                    <span className="text-red-400 text-sm font-medium">No active meal</span>
                )}
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                    <h1 className="text-3xl font-bold text-emerald-400">{orgName}</h1>
                    <span className="text-sm text-zinc-400">
                        <span className="text-emerald-400 font-semibold">{acceptedScanCount}</span> accepted total
                    </span>
                </div>

                {recentScans.length === 0 ? (
                    <p className="text-zinc-500">No badge scans recorded yet.</p>
                ) : (
                    <div className="space-y-3">
                        {recentScans.map((scan) => (
                            <div
                                key={scan.id}
                                className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-5 rounded-lg shadow-md"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-white font-medium">
                                        {scan.badge.user.firstname} {scan.badge.user.lastname}
                                    </span>
                                    <span className="text-zinc-500 text-xs uppercase tracking-widest">
                                        {scan.badge.user.role}
                                    </span>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <span className={`px-3 py-1 text-xs rounded-full font-medium
                                        ${scan.status === 'ACCEPTED' ? 'bg-emerald-900/50 text-emerald-400' :
                                        scan.status === 'REJECTED' ? 'bg-red-900/50 text-red-400' :
                                        'bg-yellow-900/50 text-yellow-400'}`}>
                                        {scan.status}
                                    </span>
                                    <span className="text-zinc-500 text-xs font-mono">
                                        {new Date(scan.createdAt).toISOString().replace('T', ' ').slice(0, 19)}
                                    </span>
                                    <span className="text-zinc-600 text-xs">#{scan.id}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
