'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, LogOut, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface RecordDetail {
  id: number;
  badgeNumber: string;
  organizationName: string;
  organizationId: number;
  userId: number;
  userName: string;
  createdAt: string;
  status: 'confirmed' | 'pending';
  blockHash?: string;
  blockNumber?: string;
  gasUsed?: string;
  fromAddress?: string;
  toAddress?: string;
  transactionHash?: string;
}

export default function RecordDetailPage({
  recordId,
  userId,
}: {
  recordId: number;
  userId: number;
}) {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Mock data - replace with API call
  const record: RecordDetail = {
    id: recordId,
    badgeNumber: '#12',
    organizationName: 'Tech Startup',
    organizationId: 1,
    userId: userId,
    userName: 'John Developer',
    createdAt: 'May 10, 2025 - 14:32:45 UTC',
    status: 'confirmed',
    blockHash: '0x1234567890abcdef1234567890abcdef12345678',
    blockNumber: '18943521',
    gasUsed: '125000',
    fromAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f42bE2',
    toAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
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
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{record.badgeNumber}</h1>
          <p className="text-slate-400">{record.organizationName} • {record.createdAt}</p>
        </div>

        {/* Status Banner */}
        <div
          className={`rounded-lg p-6 mb-8 ${
            record.status === 'confirmed'
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-yellow-500/10 border border-yellow-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-bold ${record.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400'}`}>
                {record.status === 'confirmed' ? 'Record Confirmed' : 'Record Pending'}
              </h2>
              <p className={`${record.status === 'confirmed' ? 'text-green-300' : 'text-yellow-300'} text-sm mt-1`}>
                {record.status === 'confirmed'
                  ? 'This badge record has been confirmed on the blockchain'
                  : 'This badge record is pending confirmation'}
              </p>
            </div>
            <span
              className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                record.status === 'confirmed'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}
            >
              {record.status === 'confirmed' ? 'Confirmed' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Record Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-400 text-sm font-semibold">Badge Number</p>
              <p className="text-white text-lg font-bold mt-2">{record.badgeNumber}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-semibold">Organization</p>
              <Link href={`/organizations/${record.organizationId}`} className="text-blue-400 hover:text-blue-300 text-lg font-bold mt-2">
                {record.organizationName}
              </Link>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-semibold">Awarded To</p>
              <p className="text-white text-lg font-bold mt-2">{record.userName}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-semibold">Created At</p>
              <p className="text-white text-lg font-bold mt-2">{record.createdAt}</p>
            </div>
          </div>
        </div>

        {/* Blockchain Details */}
        {record.status === 'confirmed' && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Blockchain Details</h2>
            <div className="space-y-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm font-semibold mb-2">Transaction Hash</p>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-blue-400 text-sm break-all">{record.transactionHash}</code>
                  <button
                    onClick={() => copyToClipboard(record.transactionHash || '', 'tx')}
                    className="text-slate-400 hover:text-white transition flex-shrink-0"
                  >
                    {copiedField === 'tx' ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm font-semibold mb-2">Block Hash</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-slate-300 text-sm break-all">{record.blockHash}</code>
                    <button
                      onClick={() => copyToClipboard(record.blockHash || '', 'block')}
                      className="text-slate-400 hover:text-white transition flex-shrink-0"
                    >
                      {copiedField === 'block' ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm font-semibold mb-2">Block Number</p>
                  <p className="text-white font-mono">{record.blockNumber}</p>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm font-semibold mb-2">Gas Used</p>
                <p className="text-white font-mono">{record.gasUsed}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm font-semibold mb-2">From Address</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-cyan-400 text-sm break-all">{record.fromAddress}</code>
                    <button
                      onClick={() => copyToClipboard(record.fromAddress || '', 'from')}
                      className="text-slate-400 hover:text-white transition flex-shrink-0"
                    >
                      {copiedField === 'from' ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm font-semibold mb-2">To Address</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-cyan-400 text-sm break-all">{record.toAddress}</code>
                    <button
                      onClick={() => copyToClipboard(record.toAddress || '', 'to')}
                      className="text-slate-400 hover:text-white transition flex-shrink-0"
                    >
                      {copiedField === 'to' ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related Badges */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Related Badge</h2>
          <Link href={`/badges/${record.badgeNumber.slice(1)}`}>
            <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-semibold">Badge {record.badgeNumber}</p>
                  <p className="text-white text-xl font-bold mt-2">{record.organizationName}</p>
                  <p className="text-slate-400 text-sm mt-1">View full badge details</p>
                </div>
                <ArrowLeft size={24} className="text-slate-400 transform rotate-180" />
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
