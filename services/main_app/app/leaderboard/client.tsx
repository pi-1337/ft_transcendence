'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, TrendingUp, Users, Zap, Star, Crown } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  badges: number;
  organizations: number;
  joinedDate: string;
  streak: number;
}

interface OrganizationStats {
  name: string;
  memberCount: number;
  badgesAwarded: number;
  topMember: string;
  active: boolean;
}

export default function LeaderboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'global' | 'organization'>('global');
  const [selectedOrg, setSelectedOrg] = useState('all');

  const [leaderboardData] = useState<LeaderboardUser[]>([
    {
      rank: 1,
      name: 'Alice Chen',
      avatar: 'AC',
      badges: 24,
      organizations: 4,
      joinedDate: 'Jan 2025',
      streak: 18
    },
    {
      rank: 2,
      name: 'Bob Developer',
      avatar: 'BD',
      badges: 22,
      organizations: 3,
      joinedDate: 'Feb 2025',
      streak: 15
    },
    {
      rank: 3,
      name: 'Carol Designer',
      avatar: 'CD',
      badges: 20,
      organizations: 3,
      joinedDate: 'Jan 2025',
      streak: 12
    },
    {
      rank: 4,
      name: 'David Engineer',
      avatar: 'DE',
      badges: 18,
      organizations: 2,
      joinedDate: 'Mar 2025',
      streak: 10
    },
    {
      rank: 5,
      name: 'Eve Manager',
      avatar: 'EM',
      badges: 16,
      organizations: 5,
      joinedDate: 'Jan 2025',
      streak: 8
    },
    {
      rank: 6,
      name: 'Frank Analyst',
      avatar: 'FA',
      badges: 14,
      organizations: 2,
      joinedDate: 'Apr 2025',
      streak: 6
    },
    {
      rank: 7,
      name: 'Grace Specialist',
      avatar: 'GS',
      badges: 12,
      organizations: 3,
      joinedDate: 'Feb 2025',
      streak: 9
    },
    {
      rank: 8,
      name: 'Henry Lead',
      avatar: 'HL',
      badges: 11,
      organizations: 2,
      joinedDate: 'Mar 2025',
      streak: 5
    },
    {
      rank: 9,
      name: 'Ivy Coordinator',
      avatar: 'IC',
      badges: 10,
      organizations: 4,
      joinedDate: 'Apr 2025',
      streak: 3
    },
    {
      rank: 10,
      name: 'Jack Contributor',
      avatar: 'JC',
      badges: 8,
      organizations: 2,
      joinedDate: 'May 2025',
      streak: 1
    },
  ]);

  const [organizationStats] = useState<OrganizationStats[]>([
    { name: 'Tech Startup', memberCount: 12, badgesAwarded: 45, topMember: 'Alice Chen', active: true },
    { name: 'Design Team', memberCount: 8, badgesAwarded: 32, topMember: 'Carol Designer', active: true },
    { name: 'Marketing Guild', memberCount: 15, badgesAwarded: 28, topMember: 'Eve Manager', active: false },
  ]);

  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank.toString();
  };

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
              <Trophy size={32} className="text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold text-white">Leaderboards</h1>
          </div>
          <p className="text-slate-400">See top performers across organizations</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 border-b border-slate-700">
            <button
              onClick={() => setActiveTab('global')}
              className={`px-4 py-4 font-semibold transition border-b-2 ${
                activeTab === 'global'
                  ? 'text-white border-blue-500'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              🌍 Global Rankings
            </button>
            <button
              onClick={() => setActiveTab('organization')}
              className={`px-4 py-4 font-semibold transition border-b-2 ${
                activeTab === 'organization'
                  ? 'text-white border-blue-500'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              🏢 Organizations
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'global' && (
          <div className="space-y-8">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {leaderboardData.slice(0, 3).map((user, idx) => (
                <div
                  key={user.rank}
                  className={`rounded-lg p-8 text-center transition hover:shadow-xl ${
                    idx === 0
                      ? 'bg-gradient-to-b from-yellow-500/20 to-orange-500/10 border border-yellow-500/30 md:col-span-1 md:row-start-1'
                      : idx === 1
                      ? 'bg-gradient-to-b from-slate-400/20 to-slate-500/10 border border-slate-400/30 md:col-span-1 md:order-3'
                      : 'bg-gradient-to-b from-orange-500/20 to-amber-500/10 border border-orange-500/30 md:col-span-1 md:order-2'
                  }`}
                >
                  <div className="text-5xl mb-4">{getRankMedal(user.rank)}</div>
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-slate-900 mx-auto mb-4 ${
                    idx === 0
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-400'
                      : idx === 1
                      ? 'bg-gradient-to-br from-slate-300 to-slate-400'
                      : 'bg-gradient-to-br from-orange-400 to-amber-400'
                  }`}>
                    {user.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">#{user.rank}</p>
                  <div className="space-y-2 text-sm">
                    <p className="text-yellow-400 font-bold">{user.badges} badges</p>
                    <p className="text-cyan-400">{user.streak} day streak</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Full Leaderboard Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-6 bg-slate-700 font-semibold text-slate-300">
                <div>Rank</div>
                <div className="md:col-span-2">Name</div>
                <div>Badges</div>
                <div>Orgs</div>
                <div>Streak</div>
              </div>
              <div className="divide-y divide-slate-700">
                {leaderboardData.map((user) => (
                  <div
                    key={user.rank}
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 p-6 hover:bg-slate-700/50 transition items-center cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      {user.rank <= 3 ? (
                        <span className="text-3xl">{getRankMedal(user.rank)}</span>
                      ) : (
                        <span className="text-lg font-bold text-slate-400 w-8">#{user.rank}</span>
                      )}
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-slate-900 font-bold group-hover:scale-110 transition">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{user.name}</p>
                        <p className="text-slate-400 text-xs">Joined {user.joinedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy size={18} className="text-yellow-400" />
                      <span className="text-white font-bold">{user.badges}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={18} className="text-purple-400" />
                      <span className="text-white font-bold">{user.organizations}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-cyan-400" />
                      <span className="text-white font-bold">{user.streak}d</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Crown size={24} className="text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">Top Performer</h3>
                </div>
                <p className="text-2xl font-bold text-white">{leaderboardData[0].name}</p>
                <p className="text-slate-400 text-sm mt-2">{leaderboardData[0].badges} badges earned</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp size={24} className="text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Highest Streak</h3>
                </div>
                <p className="text-2xl font-bold text-white">{Math.max(...leaderboardData.map(u => u.streak))} days</p>
                <p className="text-slate-400 text-sm mt-2">Current active streak</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users size={24} className="text-purple-400" />
                  <h3 className="text-lg font-bold text-white">Total Members</h3>
                </div>
                <p className="text-2xl font-bold text-white">{leaderboardData.length}</p>
                <p className="text-slate-400 text-sm mt-2">Ranked participants</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'organization' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Organization Performance</h2>

            {/* Organization Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {organizationStats.map((org) => (
                <div
                  key={org.name}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-blue-500 transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{org.name}</h3>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          org.active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-600 text-slate-300'
                        }`}
                      >
                        {org.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-4xl opacity-20 group-hover:opacity-40 transition">
                      {org.active ? '⭐' : '🔘'}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-700 rounded-lg p-4 text-center">
                      <p className="text-slate-400 text-sm mb-1">Members</p>
                      <p className="text-2xl font-bold text-white">{org.memberCount}</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4 text-center">
                      <p className="text-slate-400 text-sm mb-1">Badges</p>
                      <p className="text-2xl font-bold text-yellow-400">{org.badgesAwarded}</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4 text-center">
                      <p className="text-slate-400 text-sm mb-1">Avg/Member</p>
                      <p className="text-2xl font-bold text-cyan-400">{(org.badgesAwarded / org.memberCount).toFixed(1)}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-600 pt-4">
                    <p className="text-slate-400 text-sm mb-2">Top Member</p>
                    <p className="text-lg font-bold text-white">{org.topMember}</p>
                  </div>

                  <button className="w-full mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
                    View Organization
                  </button>
                </div>
              ))}
            </div>

            {/* Organization Comparison */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
              <h3 className="text-xl font-bold text-white mb-6">Badges Awarded Comparison</h3>
              <div className="space-y-6">
                {organizationStats.map((org) => (
                  <div key={org.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white font-semibold">{org.name}</span>
                      <span className="text-yellow-400 font-bold">{org.badgesAwarded}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                        style={{ width: `${(org.badgesAwarded / 45) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
