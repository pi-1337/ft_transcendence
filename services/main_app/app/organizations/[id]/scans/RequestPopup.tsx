'use client'
import { useRouter } from 'next/navigation';

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
    scanData: Scan;
};


export default function RequestPopup({ scanData }: Props) {
    const router = useRouter();

    const handleDecision = async (decision: 'ACCEPTED' | 'REJECTED') => {
        const res = await fetch('/api/scans/decide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId: scanData.id, decision }),
        });
        const data = await res.json();
        console.log('status:', res.status, 'data:', data);
        if (!res.ok) {
            console.error(data.error);
            return;
        }
        console.log('done:', data);
        router.refresh();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-sm shadow-xl">
            <h2 className="text-white text-lg font-semibold mb-1">Badge Request</h2>
            <p className="text-white text-base font-medium">{scanData.badge.user.firstname} {scanData.badge.user.lastname}</p>
            <p className="text-zinc-400 text-sm mb-6">Request #{scanData.id}</p>

                <div className="flex gap-3">
                    <button
                        onClick={() => handleDecision('ACCEPTED')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => handleDecision('REJECTED')}
                        className="flex-1 bg-red-700 hover:bg-red-600 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
}