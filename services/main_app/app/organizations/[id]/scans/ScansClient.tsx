'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Activity, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ── Types ──
type Scan = {
    id: number;
    createdAt: Date;
    status: string;
    badge: { user: { firstname: string; lastname: string; role: string; } }
};

type Props = {
    recentScans: Scan[];
    acceptedScanCount: number;
    orgName: string;
    orgId: number;
    pendingScan: Scan | null;
    activeMeal: { name: string; startTime: Date; endTime: Date } | null;
};

// ── Request Popup Component ──
function RequestPopup({ scanData }: { scanData: Scan }) {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDecision = async (decision: 'ACCEPTED' | 'REJECTED') => {
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/scans/decide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId: scanData.id, decision }),
            });
            
            const data = await res.json();
            const success = data.success || null;

            if (!res.ok || !success) {
                setError(data.error || 'Failed to process decision.');
                return;
            }

            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-900 border-gray-800 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-950/50 border border-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
                    </div>
                    
                    <h2 className="text-white text-xl font-bold mb-1">Incoming Scan</h2>
                    <p className="text-green-400 text-lg font-medium mb-1">
                        {scanData.badge.user.firstname} {scanData.badge.user.lastname}
                    </p>
                    <p className="text-gray-500 text-sm mb-6 font-mono">Request #{scanData.id}</p>

                    {error && (
                        <div className="mb-6 rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm px-4 py-3 font-medium flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button
                            onClick={() => handleDecision('REJECTED')}
                            disabled={loading}
                            variant="destructive"
                            className="flex-1 bg-red-900/80 hover:bg-red-900 text-red-100 border border-red-800 h-12"
                        >
                            Decline
                        </Button>
                        <Button
                            onClick={() => handleDecision('ACCEPTED')}
                            disabled={loading}
                            className="flex-1 bg-green-700 hover:bg-green-800 text-white h-12"
                        >
                            Accept
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// ── Main Client Page ──
export default function ScansClient({ recentScans, acceptedScanCount, orgName, orgId, pendingScan, activeMeal }: Props) {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 1000);
        return () => clearInterval(interval);
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-12">
            {pendingScan && <RequestPopup scanData={pendingScan} />}
            
            <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Link href={`/organizations/${orgId}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Back to Org
                    </Link>
                </div>
                
                {activeMeal ? (
                    <div className="text-right">
                        <p className="text-green-400 font-bold text-sm flex items-center justify-end gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {activeMeal.name}
                        </p>
                        <p className="text-gray-400 text-xs font-mono mt-0.5">
                            {new Date(activeMeal.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {' – '}
                            {new Date(activeMeal.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-red-950/40 text-red-400 border border-red-800/50 rounded-full px-3 py-1 font-medium">
                        <XCircle className="w-3.5 h-3.5" /> No active meal
                    </span>
                )}
            </header>

            <main className="max-w-4xl mx-auto px-6 mt-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{orgName}</h1>
                        <p className="text-gray-400 text-sm">Live scanner monitor</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 text-center min-w-[120px]">
                        <p className="text-2xl font-bold text-green-500">{acceptedScanCount}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Accepted</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-200">Recent Scans</h2>
                    
                    {recentScans.length === 0 ? (
                        <Card className="bg-gray-900 border-gray-800 border-dashed">
                            <CardContent className="p-12 text-center text-gray-500">
                                <Activity className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                No badge scans recorded yet today.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-3">
                            {recentScans.map((scan) => (
                                <Card key={scan.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white font-medium">
                                                {scan.badge.user.firstname} {scan.badge.user.lastname}
                                            </span>
                                            <span className="text-gray-500 text-xs font-mono">
                                                ID: #{scan.id} • {scan.badge.user.role}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            {scan.status === 'ACCEPTED' ? (
                                                <span className="inline-flex items-center gap-1 text-xs bg-green-950/40 text-green-400 border border-green-800/50 rounded-full px-2.5 py-0.5 font-medium">
                                                    <CheckCircle2 className="w-3 h-3" /> ACCEPTED
                                                </span>
                                            ) : scan.status === 'REJECTED' ? (
                                                <span className="inline-flex items-center gap-1 text-xs bg-red-950/40 text-red-400 border border-red-800/50 rounded-full px-2.5 py-0.5 font-medium">
                                                    <XCircle className="w-3 h-3" /> REJECTED
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs bg-yellow-950/40 text-yellow-400 border border-yellow-800/50 rounded-full px-2.5 py-0.5 font-medium">
                                                    <Clock className="w-3 h-3" /> PENDING
                                                </span>
                                            )}
                                            <span className="text-gray-500 text-xs font-mono">
                                                {new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}