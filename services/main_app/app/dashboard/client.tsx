'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit2, Building2, Award, LogOut, ArrowRight } from 'lucide-react';

interface Organization {
  id: number;
  name: string;
  isAdmin: boolean;
  type: string;
  service: string;
}

interface Badge {
  id: number;
  number: string;
  organizationName: string;
  awardedDate: string;
}

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber?: string;
}

export default function UserDashboard({ userId }: { userId: number }) {
  const router = useRouter();

  const user: User = {
    id: userId,
    firstname: 'John',
    lastname: 'Developer',
    email: 'john@example.com',
    phoneNumber: '+1 234 567 8900',
  };

  const organizations: Organization[] = [
    { id: 1, name: 'Tech Startup', isAdmin: true, type: 'Company', service: 'Development' },
    { id: 2, name: 'Design Team', isAdmin: false, type: 'Team', service: 'Design' },
    { id: 3, name: 'Marketing Guild', isAdmin: false, type: 'Guild', service: 'Marketing' },
  ];

  const badges: Badge[] = [
    { id: 1, number: '#12', organizationName: 'Tech Startup', awardedDate: 'May 10, 2025' },
    { id: 2, number: '#11', organizationName: 'Design Team', awardedDate: 'May 8, 2025' },
    { id: 3, number: '#10', organizationName: 'Tech Startup', awardedDate: 'May 5, 2025' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Transcendence</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 mb-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600">
                {user.firstname[0]}{user.lastname[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.firstname} {user.lastname}</h1>
                <p className="text-blue-100 mt-1">{user.email}</p>
              </div>
            </div>
            <Link href="/user/edit" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition flex items-center gap-2">
              <Edit2 size={18} />
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold">Organizations</p>
            <p className="text-4xl font-bold text-white mt-2">{organizations.length}</p>
            <p className="text-slate-400 text-xs mt-2">{organizations.filter(o => o.isAdmin).length} as admin</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold">Badges Earned</p>
            <p className="text-4xl font-bold text-yellow-400 mt-2">{badges.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold">Member Since</p>
            <p className="text-xl font-bold text-white mt-2">Jan 2025</p>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Organizations</h2>
            <Link href="/organizations" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {organizations.slice(0, 4).map((org) => (
              <Link key={org.id} href={`/organizations/${org.id}`}>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                      <Building2 size={24} className="text-slate-900" />
                    </div>
                    {org.isAdmin && (
                      <span className="bg-purple-500/20 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full">Admin</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{org.name}</h3>
                  <p className="text-slate-400 text-sm">{org.type} • {org.service}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Badges</h2>
            <Link href="/badges" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {badges.map((badge) => (
              <Link key={badge.id} href={`/badges/${badge.id}`}>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-yellow-400 transition cursor-pointer flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-3">
                    <Award size={32} className="text-slate-900" />
                  </div>
                  <p className="text-white text-sm font-bold text-center">{badge.number}</p>
                  <p className="text-slate-400 text-xs text-center mt-2">{badge.organizationName}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}