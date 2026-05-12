'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, LogOut, Users, Trash2, Plus, Search, Award } from 'lucide-react';

interface Member {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: 'admin' | 'member';
}

interface Organization {
  id: string;
  name: string;
  type: string;
  service: string;
  memberCount: number;
  badgesAwarded: number;
  isAdmin: boolean;
}

export default function OrganizationDetailClient({ orgId, userId }: { orgId: string; userId: string }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const org: Organization = {
    id: orgId,
    name: 'Tech Startup',
    type: 'Company',
    service: 'Software Development',
    memberCount: 12,
    badgesAwarded: 45,
    isAdmin: true,
  };

  const members: Member[] = [
    { id: 1, firstname: 'John', lastname: 'Developer', email: 'john@example.com', role: 'admin' },
    { id: 2, firstname: 'Jane', lastname: 'Designer', email: 'jane@example.com', role: 'member' },
    { id: 3, firstname: 'Bob', lastname: 'Manager', email: 'bob@example.com', role: 'member' },
    { id: 4, firstname: 'Alice', lastname: 'Engineer', email: 'alice@example.com', role: 'member' },
  ];

  const filteredMembers = members.filter(m =>
    m.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAddMember = () => {
    if (newMemberEmail) {
      // API call would go here
      setNewMemberEmail('');
      setShowAddMember(false);
    }
  };

  const handleDeleteMember = (memberId: number) => {
    if (confirm('Remove this member from the organization?')) {
      // API call would go here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/organizations" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Organization Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 mb-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{org.name}</h1>
              <p className="text-blue-100">{org.type} • {org.service}</p>
            </div>
            {org.isAdmin && (
              <span className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg">Admin</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Members</p>
                <p className="text-3xl font-bold text-white mt-2">{org.memberCount}</p>
              </div>
              <Users size={40} className="text-blue-400 opacity-30" />
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Badges Awarded</p>
                <p className="text-3xl font-bold text-white mt-2">{org.badgesAwarded}</p>
              </div>
              <Award size={40} className="text-yellow-400 opacity-30" />
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Members</h2>
            {org.isAdmin && (
              <button
                onClick={() => setShowAddMember(!showAddMember)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition flex items-center gap-2"
              >
                <Plus size={18} />
                Add Member
              </button>
            )}
          </div>

          {/* Add Member Form */}
          {showAddMember && org.isAdmin && (
            <div className="mb-6 p-4 bg-slate-700 rounded-lg">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter member email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="flex-1 bg-slate-600 border border-slate-500 text-white px-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
                <button
                  onClick={handleAddMember}
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mb-6 relative">
            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white pl-10 pr-4 py-2 rounded-lg focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Members List */}
          <div className="space-y-3">
            {filteredMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition">
                <div className="flex-1">
                  <p className="text-white font-semibold">{member.firstname} {member.lastname}</p>
                  <p className="text-slate-400 text-sm">{member.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    member.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {member.role === 'admin' ? 'Admin' : 'Member'}
                  </span>
                  {org.isAdmin && member.id !== 1 && (
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-2 hover:bg-red-600/20 rounded-lg text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
