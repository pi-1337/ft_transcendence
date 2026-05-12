'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Award, CheckCircle, AlertCircle } from 'lucide-react';

interface BadgeRecordClientProps {
  organizationId: number;
  userId: string;
}

export default function BadgeRecordClient({ organizationId, userId }: BadgeRecordClientProps) {
  const router = useRouter();
  const [badgeNumber, setBadgeNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!badgeNumber.trim()) {
      setMessage({ type: 'error', text: 'Please enter a badge number' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Simulate API call to record badge usage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: `Badge ${badgeNumber} has been recorded successfully!`
      });
      
      setBadgeNumber('');
      
      // Redirect after success
      setTimeout(() => {
        router.push(`/organizations/${organizationId}`);
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to record badge. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href={`/organizations/${organizationId}`} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Organization</span>
          </Link>
          <h1 className="text-xl font-bold text-white">Record Badge Usage</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <Award size={40} className="text-slate-900" />
            </div>
          </div>

          {/* Title and Description */}
          <h2 className="text-2xl font-bold text-white text-center mb-2">Record Badge Usage</h2>
          <p className="text-slate-400 text-center mb-8">Enter your badge number to record that you've badged</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-3">Badge Number</label>
              <input
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                placeholder="e.g., #12"
                disabled={loading}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition disabled:opacity-50 text-lg"
              />
            </div>

            {/* Message */}
            {message && (
              <div className={`flex items-start gap-3 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                  {message.text}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Recording...' : 'Record Badge'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-8 p-4 bg-slate-700/50 rounded-lg">
            <p className="text-slate-300 text-sm">
              <span className="font-semibold">Note:</span> Recording a badge creates a permanent record on the blockchain that you have used this badge.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
