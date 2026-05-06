'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type FieldErrors = {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
};

export default function CreateUserForm() {
    const router = useRouter();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = (): FieldErrors => {
        const e: FieldErrors = {};
        if (!firstname.trim()) e.firstname = 'First name is required.';
        if (!lastname.trim()) e.lastname = 'Last name is required.';
        if (!email) e.email = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email format.';
        if (!password) e.password = 'Password is required.';
        else if (password.length < 8) e.password = 'Password must be at least 8 characters.';
        if (!phoneNumber) e.phoneNumber = 'Phone number is required.';
        else if (!/^\+[1-9]\d{7,14}$/.test(phoneNumber)) e.phoneNumber = 'Must start with + and country code.';
        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        setLoading(true);
        try {
            const res = await fetch('/api/admin/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname, lastname, email, password, phoneNumber, role }),
            });
            const data = await res.json();
            if (!res.ok) {
                setServerError(data.error || 'Something went wrong.');
                return;
            }
            router.push('/admin/users');
        } catch {
            setServerError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center gap-4">
                <Link href="/admin/users" className="text-gray-500 hover:text-white text-sm transition-colors">
                    ← Users
                </Link>
                <span className="text-[#333]">/</span>
                <span className="text-white font-semibold">Add user</span>
            </header>

            <main className="max-w-lg mx-auto px-8 py-12">
                <h1 className="text-xl font-semibold mb-8">Create new user</h1>

                {serverError && (
                    <div className="mb-6 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-3">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-gray-400 text-sm">First name</label>
                            <input
                                type="text"
                                placeholder="John"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                            />
                            {errors.firstname && <span className="text-red-400 text-xs">{errors.firstname}</span>}
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-gray-400 text-sm">Last name</label>
                            <input
                                type="text"
                                placeholder="Doe"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                            />
                            {errors.lastname && <span className="text-red-400 text-xs">{errors.lastname}</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                        />
                        {errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                        />
                        {errors.password && <span className="text-red-400 text-xs">{errors.password}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Phone number</label>
                        <input
                            type="tel"
                            placeholder="+1234567890"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                        />
                        {errors.phoneNumber && <span className="text-red-400 text-xs">{errors.phoneNumber}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <Link
                            href="/admin/users"
                            className="flex-1 text-center border border-[#333] text-gray-400 hover:text-white hover:border-[#555] rounded-lg py-2.5 text-sm transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
                        >
                            {loading ? 'Creating…' : 'Create user'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
