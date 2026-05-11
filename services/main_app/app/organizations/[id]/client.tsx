'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Award, Settings, Plus, Trash2, Shield, Mail, Copy, Check } from 'lucide-react';

interface Member {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: 'admin' | 'member';
  joinedDate: string;
  badges: number;
}

interface Badge {
  number: string;
  username: string;
  awardedDate: string;
  txCount: number;
}

export default function OrganizationDetail({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      firstname: 'John',
      lastname: 'Developer',
      email: 'john@tech.com',
      role: 'admin',
      joinedDate: 'Jan 15, 2025',
      badges: 5
    },
    {
      id: 2,
      firstname: 'Sarah',
      lastname: 'Designer',
      email: 'sarah@tech.com',
      role: 'member',
      joinedDate: 'Feb 20, 2025',
      badges: 3
    },
    {
      id: 3,
      firstname: 'Mike',
      lastname: 'Developer',
      email: 'mike@tech.com',
      role: 'member',
      joinedDate: 'Mar 10, 2025',
      badges: 2
    },
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    { number: '#1', username: 'John Developer', awardedDate: 'May 10, 2025', txCount: 1 },
    { number: '#2', username: 'Sarah Designer', awardedDate: 'May 9, 2025', txCount: 2 },
    { number: '#3', username: 'John Developer', awardedDate: 'May 8, 2025', txCount: 3 },
    { number: '#4', username: 'Mike Developer', awardedDate: 'May 7, 2025', txCount: 1 },
  ]);

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(`tech-startup-invite-code-${orgId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Tech Startup</h1>
              <p className="text-slate-400 mt-1">Company • Software Development</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition flex items-center gap-2">
                <Settings size={20} />
                Settings
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                Delete Org
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'members', label: 'Members', icon: '👥' },
              { id: 'badges', label: 'Badges', icon: '🏆' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-4 font-semibold transition border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white border-blue-500'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Organization Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm">Status</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <p className="text-xl font-bold text-white">Active</p>
                </div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm">Total Members</p>
                <p className="text-3xl font-bold text-white mt-2">{members.length}</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm">Badges Awarded</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">{badges.length}</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm">Created</p>
                <p className="text-white font-semibold mt-2">Jan 15, 2025</p>
              </div>
            </div>

            {/* Organization Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Details */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Organization Details</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm font-semibold">Type</p>
                    <p className="text-white mt-1">Company</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-semibold">Service</p>
                    <p className="text-white mt-1">Software Development</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-semibold">Badge Award Frequency</p>
                    <p className="text-white mt-1">Every 7 days</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-semibold">Member Count</p>
                    <p className="text-white mt-1">{members.length} members</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    <Plus size={20} />
                    Add Member
                  </button>
                  <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2">
                    <Award size={20} />
                    Award Badge
                  </button>
                  <button
                    onClick={handleCopyInvite}
                    className="w-full bg-slate-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-600 transition flex items-center justify-center gap-2"
                  >
                    <Copy size={20} />
                    {copied ? 'Copied!' : 'Copy Invite Code'}
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { user: 'John Developer', action: 'awarded badge', target: 'Sarah Designer', time: '2 hours ago' },
                  { user: 'Admin', action: 'added member', target: 'Mike Developer', time: '1 day ago' },
                  { user: 'Sarah Designer', action: 'joined organization', target: '', time: '2 weeks ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-white">
                        <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                        {activity.target && <span className="font-semibold">{activity.target}</span>}
                      </p>
                    </div>
                    <p className="text-slate-400 text-sm">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Members ({members.length})</h2>
              <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                <Plus size={20} />
                Add Member
              </button>
            </div>

            {/* Members List */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 bg-slate-700 font-semibold text-slate-300">
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                <div>Badges</div>
                <div>Actions</div>
              </div>
              <div className="divide-y divide-slate-700">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 hover:bg-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                        <span className="text-slate-900 font-bold">{member.firstname[0]}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{member.firstname} {member.lastname}</p>
                        <p className="text-slate-400 text-sm">Joined {member.joinedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className="text-slate-300">{member.email}</p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          member.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {member.role === 'admin' ? (
                          <span className="flex items-center gap-1"><Shield size={14} /> Admin</span>
                        ) : (
                          'Member'
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <p className="text-yellow-400 font-semibold">{member.badges} badges</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition">
                        <Mail size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-600/20 rounded-lg text-red-400 hover:text-red-300 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invite Members Section */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Invite Members</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Email Addresses</label>
                  <textarea
                    placeholder="Enter email addresses separated by commas"
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition h-24"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Role</label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition">
                    <option>Member</option>
                    <option>Admin</option>
                  </select>
                </div>
                <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
                  Send Invites
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Badge System</h2>
              <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition flex items-center gap-2">
                <Plus size={20} />
                Award Badge
              </button>
            </div>

            {/* Badge Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm">Total Awarded</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">{badges.length}</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm">This Month</p>
                <p className="text-3xl font-bold text-cyan-400 mt-2">4</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 text-sm">Unique Recipients</p>
                <p className="text-3xl font-bold text-purple-400 mt-2">3</p>
              </div>
            </div>

            {/* Awarded Badges */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-700 font-semibold text-slate-300">
                <div>Badge</div>
                <div>Awarded To</div>
                <div>Date</div>
                <div>Transactions</div>
              </div>
              <div className="divide-y divide-slate-700">
                {badges.map((badge) => (
                  <div
                    key={badge.number}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 hover:bg-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award size={20} className="text-slate-900" />
                      </div>
                      <p className="text-white font-semibold">{badge.number}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-slate-300">{badge.username}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-slate-400">{badge.awardedDate}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-white font-semibold">{badge.txCount} tx</p>
                      <button className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Award Badge Form */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Award New Badge</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Select Member</label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition">
                    <option>Choose a member...</option>
                    {members.map((m) => (
                      <option key={m.id}>{m.firstname} {m.lastname}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Badge Name/Description</label>
                  <input
                    type="text"
                    placeholder="e.g., Exceptional Performance"
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Notes</label>
                  <textarea
                    placeholder="Optional notes about this badge"
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition h-20"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition"
                  >
                    Award Badge
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-slate-700 text-white font-semibold py-2 rounded-lg hover:bg-slate-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
