'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Award } from 'lucide-react';

interface Badge {
  id: number;
  number: string;
  organizationName: string;
  awardedDate: string;
  transactionCount: number;
}

export default function BadgesClient({ userId }: { userId: number }) {
  const router = useRouter();

  const badges: Badge[] = [
    { id: 1, number: '#12', organizationName: 'Tech Startup', awardedDate: 'May 10, 2025', transactionCount: 3 },
    { id: 2, number: '#11', organizationName: 'Design Team', awardedDate: 'May 8, 2025', transactionCount: 1 },
    { id: 3, number: '#10', organizationName: 'Tech Startup', awardedDate: 'May 5, 2025', transactionCount: 2 },
    { id: 4, number: '#9', organizationName: 'Tech Startup', awardedDate: 'April 28, 2025', transactionCount: 1 },
    { id: 5, number: '#8', organizationName: 'Marketing Guild', awardedDate: 'April 20, 2025', transactionCount: 4 },
  ];

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
          <h1 className="text-xl font-bold text-white">Badges</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold">Total Badges</p>
            <p className="text-4xl font-bold text-yellow-400 mt-2">{badges.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold">Organizations</p>
            <p className="text-4xl font-bold text-blue-400 mt-2">{new Set(badges.map(b => b.organizationName)).size}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold">Total Transactions</p>
            <p className="text-4xl font-bold text-cyan-400 mt-2">{badges.reduce((sum, b) => sum + b.transactionCount, 0)}</p>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
          {badges.map((badge) => (
            <Link key={badge.id} href={`/badges/${badge.id}`}>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-yellow-400 transition cursor-pointer flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-3">
                  <Award size={32} className="text-slate-900" />
                </div>
                <p className="text-white text-sm font-bold text-center">{badge.number}</p>
                <p className="text-slate-400 text-xs text-center mt-2">{badge.organizationName}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Badge History */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Badge History</h2>
          <div className="space-y-3">
            {badges.map((badge) => (
              <Link key={badge.id} href={`/badges/${badge.id}`}>
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award size={24} className="text-slate-900" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{badge.number}</p>
                      <p className="text-slate-400 text-sm">{badge.organizationName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-300 text-sm">{badge.awardedDate}</p>
                    <p className="text-slate-400 text-xs">{badge.transactionCount} transaction{badge.transactionCount !== 1 ? 's' : ''}</p>
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
