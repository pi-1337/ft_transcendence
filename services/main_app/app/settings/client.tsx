'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, LogOut } from 'lucide-react';

interface User {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
}

export default function UserEditClient({ userId }: { userId: number }) {
  const router = useRouter();
  const [formData, setFormData] = useState<User>({
    firstname: 'John',
    lastname: 'Developer',
    email: 'john@example.com',
    phoneNumber: '+1 234 567 8900',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // API call would go here
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

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
          <Link href="/user/dashboard" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Edit Profile</h1>

          {saved && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg">
              Profile updated successfully!
            </div>
          )}

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstname}
                  onChange={(e) => handleChange('firstname', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastname}
                  onChange={(e) => handleChange('lastname', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full bg-slate-700 border border-slate-600 text-slate-400 px-4 py-3 rounded-lg opacity-50"
              />
              <p className="text-slate-400 text-xs mt-2">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
              >
                Save Changes
              </button>
              <Link href="/user/dashboard" className="flex-1 bg-slate-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-600 transition text-center">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
