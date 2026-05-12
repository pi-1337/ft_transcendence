'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, LogOut, Copy, Check, Award, Building2 } from 'lucide-react';
import { useState } from 'react';

interface TransactionDetail {
  hash: string;
  status: 'confirmed' | 'pending';
  timestamp: string;
  badgeNumber: string;
  badgeId: number;
  organizationName: string;
  organizationId: number;
  gasPrice: string;
  gasUsed: string;
  blockNumber: number;
  fromAddress: string;
  toAddress: string;
}

export default function TransactionDetailClient({ transactionId, userId }: { transactionId: string; userId: string }) {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const transaction: TransactionDetail = {
    hash: '0x1234567890abcdef1234567890abcdef12345678',
    status: 'confirmed',
    timestamp: 'May 10, 2025 10:30 AM',
    badgeNumber: '#12',
    badgeId: 1,
    organizationName: 'Tech Startup',
    organizationId: 1,
    gasPrice: '45 Gwei',
    gasUsed: '78,920',
    blockNumber: 18953021,
    fromAddress: '0xf39fd6e51aad88f6f4ce6ab8827279cffb92266',
    toAddress: '0x8ba1f109551bd432803012645ac136ddd64dba72',
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/transactions" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
            <ArrowLeft size={20} />
            <span>Back to Transactions</span>
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
        {/* Header */}
        <div className={`bg-gradient-to-r ${transaction.status === 'confirmed' ? 'from-green-600 to-emerald-600' : 'from-yellow-600 to-amber-600'} rounded-xl p-8 mb-8 text-white`}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Transaction {transaction.status === 'confirmed' ? 'Confirmed' : 'Pending'}</h1>
              <p className={transaction.status === 'confirmed' ? 'text-green-100' : 'text-yellow-100'}>{transaction.timestamp}</p>
            </div>
            <span className={`text-sm font-semibold px-4 py-2 rounded-lg ${
              transaction.status === 'confirmed'
                ? 'bg-green-400 text-green-900'
                : 'bg-yellow-400 text-yellow-900'
            }`}>
              {transaction.status === 'confirmed' ? 'Confirmed' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Transaction Details</h2>

          <div className="space-y-6">
            {/* Badge and Organization */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-400 text-sm font-semibold mb-2">Badge</p>
                <Link href={`/badges/${transaction.badgeId}`}>
                  <div className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Award size={20} className="text-slate-900" />
                    </div>
                    <p className="text-white font-semibold">{transaction.badgeNumber}</p>
                  </div>
                </Link>
              </div>

              <div>
                <p className="text-slate-400 text-sm font-semibold mb-2">Organization</p>
                <Link href={`/organizations/${transaction.organizationId}`}>
                  <div className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <Building2 size={20} className="text-slate-900" />
                    </div>
                    <p className="text-white font-semibold">{transaction.organizationName}</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Hash */}
            <div>
              <p className="text-slate-400 text-sm font-semibold mb-2">Transaction Hash</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={transaction.hash}
                  readOnly
                  className="flex-1 bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(transaction.hash, 'hash')}
                  className="p-3 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition"
                >
                  {copiedField === 'hash' ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {/* Gas Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm font-semibold mb-2">Gas Price</p>
                <p className="text-white text-lg font-semibold">{transaction.gasPrice}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-semibold mb-2">Gas Used</p>
                <p className="text-white text-lg font-semibold">{transaction.gasUsed}</p>
              </div>
            </div>

            {/* Block */}
            <div>
              <p className="text-slate-400 text-sm font-semibold mb-2">Block Number</p>
              <p className="text-white text-lg font-semibold">{transaction.blockNumber}</p>
            </div>

            {/* From/To Addresses */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-400 text-sm font-semibold mb-2">From Address</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={transaction.fromAddress}
                    readOnly
                    className="flex-1 bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg font-mono text-xs"
                  />
                  <button
                    onClick={() => copyToClipboard(transaction.fromAddress, 'from')}
                    className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition"
                  >
                    {copiedField === 'from' ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-sm font-semibold mb-2">To Address</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={transaction.toAddress}
                    readOnly
                    className="flex-1 bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg font-mono text-xs"
                  />
                  <button
                    onClick={() => copyToClipboard(transaction.toAddress, 'to')}
                    className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition"
                  >
                    {copiedField === 'to' ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
