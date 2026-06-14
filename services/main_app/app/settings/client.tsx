

'use client'

import { changeAvatar } from '@/lib/changeAvatar';
import { UserFrontend } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Settings({ user }: { user: UserFrontend }) {
    const firstname =  user.firstname;
    const lastname =  user.lastname;
    const email =  user.email;
    const phoneNumber =  user.phoneNumber;

    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // /api/user/edit
        // req.body = { firstname, lastname, email, phoneNumber }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const changeAvatarWrapper = async (formdata: FormData) => {
        const {success, error, avatarLink}: {
            success: boolean,
            error: string,
            avatarLink: string | null
        } = await changeAvatar(formdata);

        setSaved(success);
        setError(error);
    }

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
                                            src={user.avatar}
                                            alt='avatar'
                                            fill
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

            </main>
        </div>
    );
}
