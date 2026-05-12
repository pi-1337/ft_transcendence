'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Award, Mail, CheckCircle } from 'lucide-react';

export default function AwardBadgeClient({ orgId }: { orgId: number }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [organization] = useState({
    id: orgId,
    name: 'Tech Startup',
    type: 'Company',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate email
    if (!email.trim()) {
      setError('Please enter an email address');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to award badge. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href={`/organizations/${orgId}`} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-xl font-bold text-white">Award Badge</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
                <Award size={32} className="text-slate-900" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{organization.name}</h2>
                <p className="text-slate-400">{organization.type}</p>
              </div>
            </div>
            <p className="text-slate-300 text-lg">
              Award a badge to a team member to recognize their achievements and contributions.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-slate-300 text-sm font-semibold mb-3">
                Member Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  disabled={isLoading}
                  className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 pl-12 rounded-lg focus:border-blue-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-green-400 font-semibold">Badge awarded successfully!</p>
                  <p className="text-green-300 text-sm">The member will receive a notification about their new badge.</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Awarding Badge...
                </>
              ) : (
                <>
                  <Award size={20} />
                  Award Badge
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-12 pt-8 border-t border-slate-700">
            <h3 className="text-slate-300 font-semibold mb-4">How it works:</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold flex-shrink-0">1.</span>
                <span>Enter the email address of the team member you want to recognize</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold flex-shrink-0">2.</span>
                <span>Click "Award Badge" to send them the recognition</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold flex-shrink-0">3.</span>
                <span>The member receives a notification and the badge appears in their profile</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
