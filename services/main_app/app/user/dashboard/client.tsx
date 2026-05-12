'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit2, Mail, Phone, Award, Building2, LogOut, Copy, Check, Calendar } from 'lucide-react';

interface Organization {
  id: number;
  name: string;
  isAdmin: boolean;
  status: 'active' | 'inactive';
  joinedDate: string;
  badgeCount: number;
}

interface Badge {
  number: string;
  organization: string;
  awardedDate: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  const [userInfo, setUserInfo] = useState({
    firstname: 'John',
    lastname: 'Developer',
    email: 'john@example.com',
    phoneNumber: '+1 234 567 8900',
    joinedDate: 'January 15, 2025'
  });

  const [organizations] = useState<Organization[]>([
    {
      id: 1,
      name: 'Tech Startup',
      isAdmin: true,
      status: 'active',
      joinedDate: 'Jan 15, 2025',
      badgeCount: 5
    },
    {
      id: 2,
      name: 'Design Team',
      isAdmin: false,
      status: 'active',
      joinedDate: 'Feb 20, 2025',
      badgeCount: 3
    },
    {
      id: 3,
      name: 'Marketing Guild',
      isAdmin: false,
      status: 'inactive',
      joinedDate: 'Mar 10, 2025',
      badgeCount: 2
    },
  ]);

  const [badges] = useState<Badge[]>([
    { number: '#12', organization: 'Tech Startup', awardedDate: 'May 10, 2025' },
    { number: '#11', organization: 'Design Team', awardedDate: 'May 8, 2025' },
    { number: '#10', organization: 'Tech Startup', awardedDate: 'May 5, 2025' },
    { number: '#9', organization: 'Tech Startup', awardedDate: 'April 28, 2025' },
    { number: '#8', organization: 'Marketing Guild', awardedDate: 'April 20, 2025' },
  ]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(userInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600">
                  {userInfo.firstname[0]}{userInfo.lastname[0]}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{userInfo.firstname} {userInfo.lastname}</h1>
                  <p className="text-blue-100 mt-1">Member since {userInfo.joinedDate}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center gap-2"
              >
                <Edit2 size={18} />
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Badges</p>
                <p className="text-3xl font-bold text-white mt-2">{badges.length}</p>
              </div>
              <Award size={40} className="text-yellow-400 opacity-30" />
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Organizations</p>
                <p className="text-3xl font-bold text-white mt-2">{organizations.length}</p>
              </div>
              <Building2 size={40} className="text-blue-400 opacity-30" />
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Admin Of</p>
                <p className="text-3xl font-bold text-white mt-2">{organizations.filter(o => o.isAdmin).length}</p>
              </div>
              <Building2 size={40} className="text-purple-400 opacity-30" />
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-slate-950 border border-slate-700 rounded-t-lg sticky top-16 z-30">
          <div className="flex gap-8 px-6 border-b border-slate-700">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'badges', label: 'Badges', icon: '🏆' },
              { id: 'organizations', label: 'Organizations', icon: '🏢' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
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

        {/* Tab Content */}
        <div className="bg-slate-800 border border-t-0 border-slate-700 rounded-b-lg p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-700 rounded-lg p-6">
                    <p className="text-slate-400 text-sm font-semibold flex items-center gap-2 mb-2">
                      <Mail size={16} />
                      Email Address
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-white text-lg font-semibold">{userInfo.email}</p>
                      <button
                        onClick={handleCopyEmail}
                        className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition"
                      >
                        {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-6">
                    <p className="text-slate-400 text-sm font-semibold flex items-center gap-2 mb-2">
                      <Phone size={16} />
                      Phone Number
                    </p>
                    <p className="text-white text-lg font-semibold">{userInfo.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Recent Badges */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                  Recent Badges
                  <button
                    onClick={() => setActiveTab('badges')}
                    className="text-sm text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    View All →
                  </button>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {badges.slice(0, 4).map((badge) => (
                    <div
                      key={badge.number}
                      className="flex flex-col items-center p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition cursor-pointer group"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center group-hover:scale-110 transition mb-3 shadow-lg">
                        <Award size={32} className="text-slate-900" />
                      </div>
                      <p className="text-white text-sm font-bold text-center">{badge.number}</p>
                      <p className="text-slate-400 text-xs text-center mt-1">{badge.organization}</p>
                      <p className="text-slate-500 text-xs text-center mt-2">{badge.awardedDate}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organization Memberships */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                  Your Organizations
                  <button
                    onClick={() => setActiveTab('organizations')}
                    className="text-sm text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    View All →
                  </button>
                </h2>
                <div className="space-y-3">
                  {organizations.map((org) => (
                    <div
                      key={org.id}
                      className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center group-hover:scale-105 transition">
                          <Building2 size={24} className="text-slate-900" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{org.name}</p>
                          <p className="text-slate-400 text-sm">
                            {org.isAdmin ? 'Administrator' : 'Member'} • Joined {org.joinedDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-400 text-sm font-semibold">{org.badgeCount} badges</span>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            org.status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-slate-600 text-slate-300'
                          }`}
                        >
                          {org.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">All Badges ({badges.length})</h2>

              {/* Badge Timeline */}
              <div className="space-y-2">
                {badges.map((badge) => (
                  <div
                    key={badge.number}
                    className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award size={20} className="text-slate-900" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{badge.number} - {badge.organization}</p>
                        <p className="text-slate-400 text-sm">{badge.awardedDate}</p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-white text-sm font-semibold">View</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'organizations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Your Organizations ({organizations.length})</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className="bg-slate-700 rounded-lg p-6 hover:border-blue-500 border border-slate-600 transition cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center group-hover:scale-105 transition">
                        <Building2 size={32} className="text-slate-900" />
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          org.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-600 text-slate-300'
                        }`}
                      >
                        {org.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{org.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Role</span>
                        <span className={`font-semibold ${org.isAdmin ? 'text-purple-400' : 'text-blue-400'}`}>
                          {org.isAdmin ? 'Administrator' : 'Member'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Joined</span>
                        <span className="text-white font-semibold flex items-center gap-1">
                          <Calendar size={14} />
                          {org.joinedDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Badges</span>
                        <span className="text-yellow-400 font-bold">{org.badgeCount} earned</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
                      View Organization
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Profile Settings</h2>

              {/* Edit Profile Form */}
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">First Name</label>
                      <input
                        type="text"
                        defaultValue={userInfo.firstname}
                        className="w-full bg-slate-600 border border-slate-500 text-white px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">Last Name</label>
                      <input
                        type="text"
                        defaultValue={userInfo.lastname}
                        className="w-full bg-slate-600 border border-slate-500 text-white px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue={userInfo.email}
                      disabled
                      className="w-full bg-slate-600 border border-slate-500 text-slate-400 px-4 py-2 rounded-lg opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue={userInfo.phoneNumber}
                      className="w-full bg-slate-600 border border-slate-500 text-white px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
                      Save Changes
                    </button>
                    <button className="flex-1 bg-slate-600 text-white font-semibold py-2 rounded-lg hover:bg-slate-500 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Badge Awards', description: 'Get notified when you earn a new badge' },
                    { label: 'Organization Updates', description: 'Receive updates about your organizations' },
                    { label: 'Member Activity', description: 'Get notified when members join your org' },
                  ].map((notif, i) => (
                    <label key={i} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked={i < 2}
                        className="w-5 h-5 rounded bg-slate-600 border border-slate-500 accent-blue-500"
                      />
                      <span className="ml-4">
                        <p className="text-white font-semibold group-hover:text-blue-400 transition">{notif.label}</p>
                        <p className="text-slate-400 text-sm">{notif.description}</p>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
