'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Plus, Building2, Users, ArrowRight } from 'lucide-react';

interface Organization {
  id: number;
  name: string;
  type: string;
  service: string;
  memberCount: number;
  isAdmin: boolean;
}

export default function OrganizationsClient({ userId }: { userId: string }) {
  const router = useRouter();

  const organizations: Organization[] = [
    { id: 1, name: 'Tech Startup', type: 'Company', service: 'Development', memberCount: 12, isAdmin: true },
    { id: 2, name: 'Design Team', type: 'Team', service: 'Design', memberCount: 5, isAdmin: false },
    { id: 3, name: 'Marketing Guild', type: 'Guild', service: 'Marketing', memberCount: 8, isAdmin: false },
    { id: 4, name: 'Dev Community', type: 'Community', service: 'Education', memberCount: 25, isAdmin: false },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const adminOrgs = organizations.filter(o => o.isAdmin);
  const memberOrgs = organizations.filter(o => !o.isAdmin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Organizations</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Organizations */}
        {adminOrgs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Organizations You Admin</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {adminOrgs.map((org) => (
                <Link key={org.id} href={`/organizations/${org.id}`}>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                        <Building2 size={24} className="text-slate-900" />
                      </div>
                      <span className="bg-purple-500/20 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full">Admin</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{org.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{org.type} • {org.service}</p>
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Users size={16} />
                      <span>{org.memberCount} members</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Member Organizations */}
        {memberOrgs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Organizations You're a Member Of</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {memberOrgs.map((org) => (
                <Link key={org.id} href={`/organizations/${org.id}`}>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                        <Building2 size={24} className="text-slate-900" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{org.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{org.type} • {org.service}</p>
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Users size={16} />
                      <span>{org.memberCount} members</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Create Organization */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Create New Organization</h2>
          <p className="text-slate-400 mb-6">Start your own organization and manage members</p>
          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-8 py-3 rounded-lg hover:shadow-lg transition flex items-center gap-2">
            <Plus size={20} />
            Create Organization
          </button>
        </div>
      </main>
    </div>
  );
}
