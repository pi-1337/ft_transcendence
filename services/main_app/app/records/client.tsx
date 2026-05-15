'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, ArrowRight, Search, Filter } from 'lucide-react';

interface BadgeRecord {
  id: number;
  badgeNumber: string;
  organizationName: string;
  createdAt: string;
  status: 'confirmed' | 'pending';
}

export default function RecordsPage({ userId }: { userId: number }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending'>('all');

  const [records] = useState<BadgeRecord[]>([
    {
      id: 1,
      badgeNumber: '#12',
      organizationName: 'Tech Startup',
      createdAt: 'May 10, 2025 - 14:32 UTC',
      status: 'confirmed',
    },
    {
      id: 2,
      badgeNumber: '#11',
      organizationName: 'Design Team',
      createdAt: 'May 8, 2025 - 10:15 UTC',
      status: 'confirmed',
    },
    {
      id: 3,
      badgeNumber: '#10',
      organizationName: 'Tech Startup',
      createdAt: 'May 5, 2025 - 09:47 UTC',
      status: 'pending',
    },
    {
      id: 4,
      badgeNumber: '#9',
      organizationName: 'Tech Startup',
      createdAt: 'April 28, 2025 - 16:22 UTC',
      status: 'confirmed',
    },
    {
      id: 5,
      badgeNumber: '#8',
      organizationName: 'Marketing Guild',
      createdAt: 'April 20, 2025 - 11:05 UTC',
      status: 'confirmed',
    },
  ]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.organizationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Badge Records</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Badge Records</h2>
          <p className="text-slate-400">History of all badge records and their confirmation status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold">Total Records</p>
            <p className="text-4xl font-bold text-white mt-2">{records.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold">Confirmed</p>
            <p className="text-4xl font-bold text-green-400 mt-2">{records.filter(r => r.status === 'confirmed').length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold">Pending</p>
            <p className="text-4xl font-bold text-yellow-400 mt-2">{records.filter(r => r.status === 'pending').length}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by badge or organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 pl-10 rounded-lg focus:border-blue-500 focus:outline-none transition"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'confirmed', 'pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Badge</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Organization</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-700 transition">
                    <td className="px-6 py-4 text-white font-semibold">{record.badgeNumber}</td>
                    <td className="px-6 py-4 text-slate-300">{record.organizationName}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{record.createdAt}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          record.status === 'confirmed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {record.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/records/${record.id}`}
                        className="text-blue-400 hover:text-blue-300 font-semibold flex items-center justify-end gap-1"
                      >
                        View <ArrowRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRecords.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              <p>No records found matching your criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
