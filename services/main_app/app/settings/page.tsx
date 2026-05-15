'use client'

import Link from 'next/link';
import { useState } from 'react';

// Mock data
const mockUser = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 234 567 8900',
    role: 'USER'
};

export default function Settings() {
    const [formData, setFormData] = useState({
        firstname: mockUser.firstname,
        lastname: mockUser.lastname,
        email: mockUser.email,
        phoneNumber: mockUser.phoneNumber
    });
    const [saved, setSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                        <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-6">Personal information</h2>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
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
            </main>
        </div>
    );
}
