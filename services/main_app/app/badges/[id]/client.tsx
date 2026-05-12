'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, LogOut, Award, Building2 } from 'lucide-react';

interface BadgeTransaction {
  id: number;
  transactionHash: string;
  timestamp: string;
}

interface Badge {
  number: string;
  organizationName: string;
  organizationId: number;
  awardedDate: string;
  description: string;
  transactions: BadgeTransaction[];
}

export default function BadgeDetailClient({ badgeId, userId }: { badgeId: string; userId: string }) {
  const router = useRouter();

  const badge: Badge = {
    number: '#12',
    organizationName: 'Tech Startup',
    organizationId: 1,
    awardedDate: 'May 10, 2025',
    description: 'Outstanding contribution to the development team',
    transactions: [
      { id: 1, transactionHash: '0x1234...5678', timestamp: 'May 10, 2025 10:30 AM' },
      { id: 2, transactionHash: '0x9abc...def0', timestamp: 'May 10, 2025 10:31 AM' },
      { id: 3, transactionHash: '0x5678...9abc', timestamp: 'May 10, 2025 10:32 AM' },
    ],
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/badges" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
            <ArrowLeft size={20} />
            <span>Back to Badges</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Badge Display */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-12 mb-8 text-white text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Award size={80} className="text-slate-900" />
          </div>
          <h1 className="text-4xl font-bold mb-2">{badge.number}</h1>
          <p className="text-yellow-100 text-lg">Awarded on {badge.awardedDate}</p>
        </div>

        {/* Badge Info */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Badge Details</h2>

          <div className="space-y-6">
            <div>
              <p className="text-slate-400 text-sm font-semibold mb-2">Organization</p>
              <Link href={`/organizations/${badge.organizationId}`}>
                <div className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition cursor-pointer w-fit">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                    <Building2 size={20} className="text-slate-900" />
                  </div>
                  <p className="text-white font-semibold">{badge.organizationName}</p>
                </div>
              </Link>
            </div>

            <div>
              <p className="text-slate-400 text-sm font-semibold mb-2">Description</p>
              <p className="text-white text-lg">{badge.description}</p>
            </div>

            <div>
              <p className="text-slate-400 text-sm font-semibold mb-2">Awarded Date</p>
              <p className="text-white">{badge.awardedDate}</p>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Badge Transactions ({badge.transactions.length})</h2>

          <div className="space-y-3">
            {badge.transactions.map((tx) => (
              <Link key={tx.id} href={`/transactions/${tx.id}`}>
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition cursor-pointer">
                  <div>
                    <p className="text-white font-semibold font-mono text-sm">{tx.transactionHash}</p>
                    <p className="text-slate-400 text-sm">{tx.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 text-sm font-semibold">View →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
