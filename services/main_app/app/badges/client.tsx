'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Award, TrendingUp, Calendar, Users, Filter, Search } from 'lucide-react';

interface BadgeData {
  number: string;
  organization: string;
  recipient: string;
  awardedDate: string;
  txCount: number;
  category: 'performance' | 'achievement' | 'participation' | 'leadership';
}

interface Stats {
  totalEarned: number;
  thisMonth: number;
  thisYear: number;
  topOrganization: string;
}

export default function BadgesClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterOrg, setFilterOrg] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [badges] = useState<BadgeData[]>([
    { number: '#12', organization: 'Tech Startup', recipient: 'You', awardedDate: 'May 10, 2025', txCount: 1, category: 'performance' },
    { number: '#11', organization: 'Design Team', recipient: 'You', awardedDate: 'May 8, 2025', txCount: 2, category: 'achievement' },
    { number: '#10', organization: 'Tech Startup', recipient: 'You', awardedDate: 'May 5, 2025', txCount: 3, category: 'performance' },
    { number: '#9', organization: 'Tech Startup', recipient: 'You', awardedDate: 'April 28, 2025', txCount: 1, category: 'achievement' },
    { number: '#8', organization: 'Marketing Guild', recipient: 'You', awardedDate: 'April 20, 2025', txCount: 2, category: 'leadership' },
    { number: '#7', organization: 'Design Team', recipient: 'You', awardedDate: 'April 15, 2025', txCount: 1, category: 'participation' },
    { number: '#6', organization: 'Tech Startup', recipient: 'You', awardedDate: 'April 5, 2025', txCount: 4, category: 'performance' },
    { number: '#5', organization: 'Tech Startup', recipient: 'You', awardedDate: 'March 28, 2025', txCount: 2, category: 'achievement' },
    { number: '#4', organization: 'Design Team', recipient: 'You', awardedDate: 'March 15, 2025', txCount: 1, category: 'leadership' },
    { number: '#3', organization: 'Marketing Guild', recipient: 'You', awardedDate: 'March 8, 2025', txCount: 3, category: 'participation' },
    { number: '#2', organization: 'Tech Startup', recipient: 'You', awardedDate: 'February 20, 2025', txCount: 2, category: 'performance' },
    { number: '#1', organization: 'Tech Startup', recipient: 'You', awardedDate: 'January 15, 2025', txCount: 1, category: 'achievement' },
  ]);

  const stats: Stats = {
    totalEarned: 12,
    thisMonth: 3,
    thisYear: 12,
    topOrganization: 'Tech Startup'
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'performance': return 'from-yellow-400 to-orange-400';
      case 'achievement': return 'from-blue-400 to-cyan-400';
      case 'participation': return 'from-green-400 to-emerald-400';
      case 'leadership': return 'from-purple-400 to-pink-400';
      default: return 'from-gray-400 to-slate-400';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const filteredBadges = badges.filter(badge => {
    const matchesSearch = badge.organization.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          badge.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || badge.category === filterCategory;
    const matchesOrg = filterOrg === 'all' || badge.organization === filterOrg;
    return matchesSearch && matchesCategory && matchesOrg;
  });

  const uniqueOrgs = ['all', ...new Set(badges.map(b => b.organization))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <Award size={32} className="text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold text-white">Badge Collection</h1>
          </div>
          <p className="text-slate-400">View and explore all your earned badges and achievements</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Total Earned</p>
            <p className="text-3xl font-bold text-white mt-2">{stats.totalEarned}</p>
            <p className="text-slate-500 text-xs mt-2">All badges</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm">This Month</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">{stats.thisMonth}</p>
            <p className="text-slate-500 text-xs mt-2">May 2025</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm">This Year</p>
            <p className="text-3xl font-bold text-purple-400 mt-2">{stats.thisYear}</p>
            <p className="text-slate-500 text-xs mt-2">2025</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Top Organization</p>
            <p className="text-white font-semibold mt-2">{stats.topOrganization}</p>
            <p className="text-slate-500 text-xs mt-2">5 badges earned</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search size={20} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search badges by organization or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Filter size={20} className="text-slate-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="flex-1 bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
                >
                  <option value="all">All Categories</option>
                  <option value="performance">Performance</option>
                  <option value="achievement">Achievement</option>
                  <option value="participation">Participation</option>
                  <option value="leadership">Leadership</option>
                </select>
              </div>
              <select
                value={filterOrg}
                onChange={(e) => setFilterOrg(e.target.value)}
                className="flex-1 bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
              >
                {uniqueOrgs.map((org) => (
                  <option key={org} value={org}>
                    {org === 'all' ? 'All Organizations' : org}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                List View
              </button>
            </div>
          </div>
        </div>

        {/* Badges Display */}
        {filteredBadges.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {filteredBadges.map((badge) => (
                  <div
                    key={badge.number}
                    className="flex flex-col items-center p-4 bg-slate-800 rounded-lg hover:border-blue-500 border border-slate-700 transition cursor-pointer group"
                  >
                    <div className={`w-20 h-20 bg-gradient-to-br ${getCategoryColor(badge.category)} rounded-full flex items-center justify-center group-hover:scale-110 transition mb-3 shadow-lg`}>
                      <Award size={40} className="text-slate-900" />
                    </div>
                    <p className="text-white text-sm font-bold text-center">{badge.number}</p>
                    <p className="text-slate-400 text-xs text-center mt-1">{badge.organization}</p>
                    <div className="mt-2 text-center">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(badge.category)} text-slate-900`}>
                        {getCategoryLabel(badge.category)}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs text-center mt-2">{badge.awardedDate.split(',')[0]}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBadges.map((badge) => (
                  <div
                    key={badge.number}
                    className="flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(badge.category)} rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition`}>
                        <Award size={24} className="text-slate-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold">{badge.number} - {badge.organization}</p>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(badge.category)} text-slate-900`}>
                            {getCategoryLabel(badge.category)}
                          </span>
                          <span className="text-xs text-slate-400">{badge.awardedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-slate-300 text-sm font-semibold">{badge.txCount} tx</p>
                      <p className="text-slate-500 text-xs">transactions</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Award size={48} className="mx-auto text-slate-500 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">No badges found</h3>
            <p className="text-slate-400">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Badge Insights */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Badge Insights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* By Category */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                By Category
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Performance', count: 4, color: 'from-yellow-400 to-orange-400' },
                  { name: 'Achievement', count: 3, color: 'from-blue-400 to-cyan-400' },
                  { name: 'Leadership', count: 2, color: 'from-purple-400 to-pink-400' },
                  { name: 'Participation', count: 3, color: 'from-green-400 to-emerald-400' },
                ].map((cat) => (
                  <div key={cat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">{cat.name}</span>
                      <span className="text-white font-semibold">{cat.count}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${cat.color}`}
                        style={{ width: `${(cat.count / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Organization */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users size={20} />
                By Organization
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Tech Startup', count: 5 },
                  { name: 'Design Team', count: 3 },
                  { name: 'Marketing Guild', count: 2 },
                ].map((org) => (
                  <div key={org.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">{org.name}</span>
                      <span className="text-white font-semibold">{org.count}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                        style={{ width: `${(org.count / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar size={24} />
            Timeline
          </h2>
          <div className="space-y-4">
            {[
              { month: 'May 2025', count: 3, badges: [12, 11, 10] },
              { month: 'April 2025', count: 3, badges: [9, 8, 7] },
              { month: 'March 2025', count: 3, badges: [6, 5, 4] },
            ].map((period) => (
              <div key={period.month} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{period.month}</h3>
                  <span className="text-cyan-400 font-semibold">{period.count} badges</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {period.badges.map((num) => (
                    <div
                      key={num}
                      className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center font-bold text-slate-900 cursor-pointer hover:scale-110 transition"
                    >
                      #{num}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
