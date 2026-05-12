'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

interface Transaction {
  id: number;
  hash: string;
  badgeNumber: string;
  organizationName: string;
  timestamp: string;
  status: 'confirmed' | 'pending';
}

export default function TransactionsClient({ userId }: { userId: string }) {
  const router = useRouter();

  const transactions: Transaction[] = [
    { id: 1, hash: '0x1234567890abcdef1234567890abcdef12345678', badgeNumber: '#12', organizationName: 'Tech Startup', timestamp: 'May 10, 2025 10:30 AM', status: 'confirmed' },
    { id: 2, hash: '0x9abc def0123456789abcdef0123456789abcdef', badgeNumber: '#11', organizationName: 'Design Team', timestamp: 'May 8, 2025 2:15 PM', status: 'confirmed' },
    { id: 3, hash: '0x5678abcd1234567890abcdef1234567890abcd', badgeNumber: '#12', organizationName: 'Tech Startup', timestamp: 'May 7, 2025 9:45 AM', status: 'confirmed' },
    { id: 4, hash: '0xdef01234567890abcdef01234567890abcdef01', badgeNumber: '#10', organizationName: 'Tech Startup', timestamp: 'May 5, 2025 4:20 PM', status: 'pending' },
    { id: 5, hash: '0xabcd1234567890abcdef1234567890abcdef123', badgeNumber: '#8', organizationName: 'Marketing Guild', timestamp: 'April 20, 2025 11:10 AM', status: 'confirmed' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const confirmedCount = transactions.filter(t => t.status === 'confirmed').length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Transactions</h1>
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
            <p className="text-slate-400 text-sm font-semibold">Total Transactions</p>
            <p className="text-4xl font-bold text-white mt-2">{transactions.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold">Confirmed</p>
            <p className="text-4xl font-bold text-green-400 mt-2">{confirmedCount}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold">Pending</p>
            <p className="text-4xl font-bold text-yellow-400 mt-2">{pendingCount}</p>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Your Transactions</h2>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <Link key={tx.id} href={`/transactions/${tx.id}`}>
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition cursor-pointer">
                  <div className="flex-1">
                    <p className="text-white font-semibold font-mono text-sm mb-1">{tx.hash}</p>
                    <p className="text-slate-400 text-sm">{tx.organizationName} • {tx.badgeNumber}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-slate-300 text-sm mb-1">{tx.timestamp}</p>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      tx.status === 'confirmed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {tx.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </span>
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
