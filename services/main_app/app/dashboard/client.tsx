'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, Users, Award, Settings, LogOut, Menu, X, ChevronRight, TrendingUp } from 'lucide-react';

interface Organization {
  id: number;
  name: string;
  type: string;
  service: string;
  active: string;
  isAdmin: boolean;
}

interface Badge {
  number: string;
  organization: string;
  awardedDate: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with actual API calls
  const [organizations] = useState<Organization[]>([
    { id: 1, name: 'Tech Startup', type: 'Company', service: 'Development', active: 'TRUE', isAdmin: true },
    { id: 2, name: 'Design Team', type: 'Team', service: 'Design', active: 'TRUE', isAdmin: false },
    { id: 3, name: 'Marketing Guild', type: 'Guild', service: 'Marketing', active: 'FALSE', isAdmin: false },
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

  const handleCreateOrg = () => {
    // Show create org modal or navigate to form
    console.log('Create organization');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg lg:hidden text-white"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-slate-900">
                T
              </div>
              <h1 className="text-xl font-bold text-white hidden sm:block">Transcendence</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-slate-950 border-r border-slate-700 transition-all duration-300 overflow-hidden`}
        >
          <nav className="p-6 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Building2 size={20} />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('organizations')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'organizations'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users size={20} />
              <span>Organizations</span>
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'badges'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Award size={20} />
              <span>Badge History</span>
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'schema'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings size={20} />
              <span>Schema</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Welcome */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-2">Welcome to Transcendence</h2>
                <p className="text-blue-100">Create organizations, manage members, and earn badges through your contributions</p>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Member Organizations</p>
                      <p className="text-3xl font-bold text-white mt-2">{organizations.filter(o => !o.isAdmin).length}</p>
                    </div>
                    <Users size={40} className="text-blue-400 opacity-30" />
                  </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Admin Organizations</p>
                      <p className="text-3xl font-bold text-white mt-2">{organizations.filter(o => o.isAdmin).length}</p>
                    </div>
                    <Building2 size={40} className="text-purple-400 opacity-30" />
                  </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Badges Earned</p>
                      <p className="text-3xl font-bold text-white mt-2">{badges.length}</p>
                    </div>
                    <Award size={40} className="text-yellow-400 opacity-30" />
                  </div>
                </div>
              </div>

              {/* All Organizations */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-white mb-6">Your Organizations</h3>
                <div className="space-y-3">
                  {organizations.map((org) => (
                    <div
                      key={org.id}
                      className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                          <Building2 size={24} className="text-slate-900" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{org.name}</h4>
                          <p className="text-slate-400 text-sm">{org.type} • {org.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {org.isAdmin && (
                          <span className="bg-purple-500/20 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full">Admin</span>
                        )}
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            org.active === 'TRUE'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-slate-600 text-slate-300'
                          }`}
                        >
                          {org.active === 'TRUE' ? 'Active' : 'Inactive'}
                        </span>
                        <ChevronRight size={20} className="text-slate-400 group-hover:text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create Organization */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Create New Organization</h3>
                <p className="text-slate-400 mb-6">Start a new organization and invite members to your team</p>
                <button
                  onClick={handleCreateOrg}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create Organization
                </button>
              </div>
            </div>
          )}

          {activeTab === 'organizations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Organizations</h2>
                <button
                  onClick={handleCreateOrg}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create New
                </button>
              </div>

              {/* Admin Organizations */}
              {organizations.filter(o => o.isAdmin).length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Organizations You Admin</h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {organizations.filter(o => o.isAdmin).map((org) => (
                      <div
                        key={org.id}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                            <Building2 size={32} className="text-slate-900" />
                          </div>
                          <span className="bg-purple-500/20 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full">Admin</span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">{org.name}</h4>
                        <p className="text-slate-400 text-sm mb-4">{org.type} • {org.service}</p>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600 transition text-sm font-semibold">
                            Manage
                          </button>
                          <button className="flex-1 bg-blue-600/20 text-blue-400 py-2 rounded-lg hover:bg-blue-600/30 transition text-sm font-semibold">
                            Members
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Member Organizations */}
              {organizations.filter(o => !o.isAdmin).length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Organizations You're a Member Of</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {organizations.filter(o => !o.isAdmin).map((org) => (
                      <div
                        key={org.id}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500 transition"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                            <Users size={32} className="text-slate-900" />
                          </div>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              org.active === 'TRUE'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-slate-600 text-slate-300'
                            }`}
                          >
                            {org.active === 'TRUE' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">{org.name}</h4>
                        <p className="text-slate-400 text-sm mb-4">{org.type} • {org.service}</p>
                        <button className="w-full bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600 transition text-sm font-semibold">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Badge History</h2>
                <p className="text-slate-400">All badges you've earned across organizations</p>
              </div>

              {/* Badge Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Total Badges</p>
                  <p className="text-2xl font-bold text-white mt-2">{badges.length}</p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Organizations</p>
                  <p className="text-2xl font-bold text-cyan-400 mt-2">{new Set(badges.map(b => b.organization)).size}</p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Recent</p>
                  <p className="text-2xl font-bold text-yellow-400 mt-2">{badges[0]?.number || 'N/A'}</p>
                </div>
              </div>

              {/* Badge Timeline */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Badge Timeline</h3>
                <div className="space-y-3">
                  {badges.map((badge, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award size={24} className="text-slate-900" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{badge.number}</p>
                        <p className="text-slate-400 text-sm">{badge.organization}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-300 text-sm">{badge.awardedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">System Schema</h2>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Database Structure</h3>
                <div className="space-y-4">
                  {[
                    { name: 'User', color: 'from-blue-400 to-blue-600', fields: ['id', 'firstname', 'lastname', 'email', 'password', 'phoneNumber'] },
                    { name: 'Organization', color: 'from-cyan-400 to-cyan-600', fields: ['id', 'name', 'type', 'service', 'badgeTimes', 'active', 'adminId'] },
                    { name: 'Badge', color: 'from-yellow-400 to-yellow-600', fields: ['number', 'userId', 'orgId', 'createdAt'] },
                    { name: 'BadgeTX', color: 'from-orange-400 to-orange-600', fields: ['id', 'badgeNumber', 'createdAt'] },
                  ].map((table) => (
                    <div key={table.name} className="bg-slate-700 rounded-lg p-4">
                      <div className={`inline-block bg-gradient-to-r ${table.color} text-slate-900 font-bold px-4 py-2 rounded-lg mb-3`}>
                        {table.name}
                      </div>
                      <div className="ml-4 space-y-2">
                        {table.fields.map((field, i) => (
                          <p key={i} className="text-slate-300 text-sm">• {field}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Relationships</h3>
                <div className="space-y-3">
                  {[
                    { relation: 'Many-to-One', description: 'User has many Badges' },
                    { relation: 'One-to-One', description: 'Badge has one Organization' },
                    { relation: 'Many-to-Many', description: 'User and Organization (through UsersOnOrganizations)' },
                    { relation: 'One-to-Many', description: 'Badge has many BadgeTX' },
                  ].map((rel, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 bg-slate-700 rounded-lg">
                      <TrendingUp size={20} className="text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white font-semibold">{rel.relation}</p>
                        <p className="text-slate-400 text-sm">{rel.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
