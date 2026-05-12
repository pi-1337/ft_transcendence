'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Award, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function BadgeClaimClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [badgeInput, setBadgeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!badgeInput.trim()) {
      setError('Please enter a badge number');
      return;
    }

    setLoading(true);

    try {
      // API call would go here
      // const response = await fetch('/api/badges/claim', {
      //   method: 'POST',
      //   body: JSON.stringify({ badgeNumber: badgeInput, userId })
      // });

      // Mock success for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setBadgeInput('');
      
      // Redirect to badge details after 2 seconds
      setTimeout(() => {
        router.push(`/badges/${badgeInput}`);
      }, 2000);
    } catch (err) {
      setError('Failed to claim badge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/user/dashboard" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <Award size={40} className="text-slate-900" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">Claim Your Badge</h1>
          <p className="text-slate-400 text-center mb-8">Enter the badge number you were awarded to record it in your profile</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-3">Badge Number</label>
              <input
                type="text"
                value={badgeInput}
                onChange={(e) => setBadgeInput(e.target.value)}
                placeholder="e.g., #12 or Badge-001"
                disabled={loading || success}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                <p className="text-green-400 text-sm">Badge claimed successfully! Redirecting...</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Claiming Badge...' : 'Claim Badge'}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">How it works</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">1.</span>
                <span>Receive a badge number from your organization admin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">2.</span>
                <span>Enter the badge number in the field above</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">3.</span>
                <span>Click "Claim Badge" to record it on your profile</span>
              </li>
            </ul>
          </div>

          {/* Link to View Badges */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <Link href="/badges" className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-2 transition">
              View all your badges →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
