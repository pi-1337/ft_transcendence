

'use client'

import { changeAvatar } from '@/lib/changeAvatar';
import { UserFrontend } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Shield, ChevronLeft, User, Mail, Phone, Camera, Save, X } from 'lucide-react';

export default function Settings({ user }: { user: UserFrontend }) {
    const firstname =  user.firstname;
    const lastname =  user.lastname;
    const email =  user.email;
    const phoneNumber =  user.phoneNumber;

    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
        <div className="min-h-screen bg-[#030712] text-white font-sans">
            {/* Top bar */}
            <header className="border-b border-gray-800 bg-[#030712]/80 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-all group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </Link>
                    <div className="w-px h-4 bg-gray-800" />
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-500" />
                        <span className="text-white font-bold tracking-tight">Settings</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-8 py-12">
                <div className="flex items-center gap-4 mb-10">
                    <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
                        <User className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                        <p className="text-gray-500 mt-1">Manage your personal information and profile</p>
                    </div>
                </div>

                {saved && (
                    <div className="mb-8 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        <div className="bg-green-500/20 p-1 rounded-full">
                            <Save className="w-4 h-4" />
                        </div>
                        Settings saved successfully!
                    </div>
                )}
                {error !== "" && (
                    <div className="mb-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        <div className="bg-red-500/20 p-1 rounded-full">
                            <X className="w-4 h-4" />
                        </div>
                        {error}
                    </div>
                )}

                <div className="grid gap-8">
                    {/* Personal Information */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-[#0b1120]/50 border border-gray-800 rounded-[2rem] p-8 relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
                            
                            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                                <span className="w-1 h-4 bg-indigo-500 rounded-full" />
                                Personal information
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">First Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={firstname}
                                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Last Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={lastname}
                                            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-8 py-3.5 transition-all shadow-xl shadow-indigo-500/20"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800 text-white font-bold rounded-xl px-8 py-3.5 border border-gray-700 transition-all"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </form>

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
                    </form>
                </div>
            </main>
        </div>
    );
}
