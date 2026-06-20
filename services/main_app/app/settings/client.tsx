

'use client'

import { changeAvatar } from '@/lib/changeAvatar';
import { UserFrontend } from '@/lib/types';
import Link from 'next/link';
import { useState } from 'react';
import { Shield, ChevronLeft, User, Mail, Phone, Camera, Save, X, KeyRound } from 'lucide-react';

export default function Settings({ user }: { user: UserFrontend }) {
    const firstname =  user.firstname;
    const lastname =  user.lastname;
    const email =  user.email;
    const phoneNumber = user.phoneNumber || "";
    const avatar = user.avatar || '/avatars/default-avatar.png';

    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(Boolean(user.twoFactorEnabled));
    const [twoFactorPassword, setTwoFactorPassword] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [twoFactorStatus, setTwoFactorStatus] = useState('');
    const [twoFactorError, setTwoFactorError] = useState('');
    const [twoFactorPendingAction, setTwoFactorPendingAction] = useState<'enable' | 'disable' | null>(null);
    const [twoFactorLoading, setTwoFactorLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // /api/user/edit
        // req.body = { firstname, lastname, email, phoneNumber }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const changeAvatarWrapper = async (formdata: FormData) => {
        const {success, error}: {
            success: boolean,
            error: string,
            avatarLink: string | null
        } = await changeAvatar(formdata);

        setSaved(success);
        setError(error);
    }

    const requestTwoFactorChange = async (target: 'enable' | 'disable') => {
        setTwoFactorLoading(true);
        setTwoFactorError('');
        setTwoFactorStatus('');

        try {
            const action = target === 'enable' ? 'request_enable' : 'request_disable';
            const res = await fetch('/api/auth/2fa/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, password: twoFactorPassword }),
            });

            const data = await res.json();
            if (!res.ok) {
                setTwoFactorError(data.error || 'Failed to send verification code.');
                return;
            }

            setTwoFactorPendingAction(target);
            setTwoFactorStatus(`Code sent to ${data.maskedEmail}. Enter it below to confirm.`);
        } catch {
            setTwoFactorError('Network error. Please try again.');
        } finally {
            setTwoFactorLoading(false);
        }
    };

    const confirmTwoFactorChange = async () => {
        if (!twoFactorPendingAction)
            return;

        setTwoFactorLoading(true);
        setTwoFactorError('');
        setTwoFactorStatus('');

        try {
            const action = twoFactorPendingAction === 'enable' ? 'confirm_enable' : 'confirm_disable';
            const res = await fetch('/api/auth/2fa/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, code: twoFactorCode }),
            });

            const data = await res.json();
            if (!res.ok) {
                setTwoFactorError(data.error || 'Verification failed.');
                return;
            }

            setTwoFactorEnabled(Boolean(data.twoFactorEnabled));
            setTwoFactorPendingAction(null);
            setTwoFactorCode('');
            setTwoFactorPassword('');
            setTwoFactorStatus(data.twoFactorEnabled ? 'Two-factor authentication is enabled.' : 'Two-factor authentication is disabled.');
        } catch {
            setTwoFactorError('Network error. Please try again.');
        } finally {
            setTwoFactorLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top bar */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
                        ← Dashboard
                    </Link>
                    <span className="text-[#333]">/</span>
                    <span className="text-white font-semibold">Settings</span>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-8 py-12">
                <h1 className="text-2xl font-semibold mb-8">Account Settings</h1>

                {saved && (
                    <div className="mb-6 rounded-lg bg-green-900/40 border border-green-600 text-green-400 text-sm px-4 py-3">
                        Settings saved successfully!
                    </div>
                )}
                {error !== "" && (
                    <div className="mb-6 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-6">Personal information</h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={firstname}
                                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={lastname}
                                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition-colors"
                            />
                    {/* Avatar Upload */}
                    <form action={changeAvatarWrapper} className="space-y-6">
                        <div className="bg-[#0b1120]/50 border border-gray-800 rounded-[2rem] p-8 relative overflow-hidden group">
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />

                            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                                <span className="w-1 h-4 bg-blue-500 rounded-full" />
                                Profile picture
                            </h2>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-10">
                                <div className="relative group">
                                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-800 shadow-2xl relative">
                                        <img
                                            src={avatar}
                                            alt='avatar'
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 w-full">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Upload new avatar</label>
                                        <input
                                            type="file"
                                            name="file"
                                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-400 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 transition-all cursor-pointer"
                                        />
                                    </div>
                                    
                                    <div className="flex gap-4 pt-2">
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-8 py-3.5 transition-all shadow-xl shadow-indigo-500/20"
                                        >
                                            <Camera className="w-4 h-4" />
                                            Update Photo
                                        </button>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800 text-white font-bold rounded-xl px-8 py-3.5 border border-gray-700 transition-all"
                                        >
                                            Cancel
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
<<<<<<< HEAD

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={phoneNumber}
                                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-6 py-2.5 transition-colors"
                        >
                            Save Changes
                        </button>
                        <Link
                            href="/dashboard"
                            className="text-gray-400 hover:text-white border border-[#333] hover:border-gray-500 rounded-lg px-6 py-2.5 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
                <form action={changeAvatarWrapper} className="space-y-6">
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-6">Avatar</h2>
                        <Image
                            src={user.avatar}
                            alt='avatar'
                        />
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                            <input
                                type="file"
                                name="file"
                                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-6 py-2.5 transition-colors"
                        >
                            Change Avatar
                        </button>
                        <Link
                            href="/dashboard"
                            className="text-gray-400 hover:text-white border border-[#333] hover:border-gray-500 rounded-lg px-6 py-2.5 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>

=======
                    </form>

                    <section className="bg-[#0b1120]/50 border border-gray-800 rounded-[2rem] p-8 relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

                        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                            <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                            Two-factor authentication
                        </h2>

                        <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-5 mb-6">
                            <p className="text-white font-semibold flex items-center gap-2">
                                <KeyRound className="w-4 h-4 text-emerald-400" />
                                Status: {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                                {twoFactorEnabled
                                    ? 'You will be asked for an email verification code when signing in.'
                                    : 'Enable 2FA to add an email verification step to your login.'}
                            </p>
                        </div>

                        {twoFactorStatus && (
                            <div className="mb-4 rounded-lg bg-green-900/30 border border-green-700/60 text-green-300 text-sm px-4 py-3">
                                {twoFactorStatus}
                            </div>
                        )}

                        {twoFactorError && (
                            <div className="mb-4 rounded-lg bg-red-900/30 border border-red-700/60 text-red-300 text-sm px-4 py-3">
                                {twoFactorError}
                            </div>
                        )}

                        <div className="grid gap-3 mb-4">
                            <label className="text-sm text-gray-400">Current password (required for password-based accounts)</label>
                            <input
                                type="password"
                                value={twoFactorPassword}
                                onChange={(e) => setTwoFactorPassword(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 mb-6">
                            <button
                                type="button"
                                onClick={() => requestTwoFactorChange('enable')}
                                disabled={twoFactorLoading || twoFactorEnabled}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl px-5 py-3"
                            >
                                Enable 2FA
                            </button>
                            <button
                                type="button"
                                onClick={() => requestTwoFactorChange('disable')}
                                disabled={twoFactorLoading || !twoFactorEnabled}
                                className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold rounded-xl px-5 py-3"
                            >
                                Disable 2FA
                            </button>
                        </div>

                        {twoFactorPendingAction && (
                            <div className="grid gap-3">
                                <label className="text-sm text-gray-400">Verification code</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={8}
                                    value={twoFactorCode}
                                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white tracking-[0.25em]"
                                    placeholder="000000"
                                />
                                <button
                                    type="button"
                                    onClick={confirmTwoFactorChange}
                                    disabled={twoFactorLoading || twoFactorCode.length < 4}
                                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl px-5 py-3"
                                >
                                    Confirm {twoFactorPendingAction === 'enable' ? 'enable' : 'disable'}
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
