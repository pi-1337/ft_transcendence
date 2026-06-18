'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Badge = {
    number: string;
    createdAt: Date;
};

type User = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    role: string;
    badge: Badge | null;
};

type FieldErrors = {
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
};

type Props = {
    user: User;
    isSelf: boolean;
};

export default function EditUserForm({ user, isSelf }: Props) {
    const router = useRouter();
    const [firstname, setFirstname] = useState(user.firstname);
    const [lastname, setLastname] = useState(user.lastname);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [role, setRole] = useState<'USER' | 'ADMIN'>(user.role as 'USER' | 'ADMIN');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    // Badge state
    const [badge, setBadge] = useState<Badge | null>(user.badge);
    const [badgeNumber, setBadgeNumber] = useState('');
    const [badgeError, setBadgeError] = useState('');
    const [badgeLoading, setBadgeLoading] = useState(false);
    const [editingBadge, setEditingBadge] = useState(false);
    const [editBadgeNumber, setEditBadgeNumber] = useState('');

    const validate = (): FieldErrors => {
        const e: FieldErrors = {};
        if (!firstname.trim()) e.firstname = 'First name is required.';
        if (!lastname.trim()) e.lastname = 'Last name is required.';
        if (!email) e.email = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email format.';
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
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname, lastname, email, phoneNumber, role }),
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

    // ── Badge handlers ─────────────────────────────────────────
    const handleAddBadge = async () => {
        if (!badgeNumber.trim()) {
            setBadgeError('Badge number is required.');
            return;
        }
        setBadgeError('');
        setBadgeLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${user.id}/badges`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number: badgeNumber.trim() }),
            });
            const data = await res.json();
            if (!res.ok) {
                setBadgeError(data.error || 'Failed to add badge.');
                return;
            }
            setBadge(data.badge);
            setBadgeNumber('');
        } catch {
            setBadgeError('Network error. Please try again.');
        } finally {
            setBadgeLoading(false);
        }
    };

    const handleStartEditBadge = () => {
        if (badge) {
            setEditingBadge(true);
            setEditBadgeNumber(badge.number);
            setBadgeError('');
        }
    };

    const handleCancelEditBadge = () => {
        setEditingBadge(false);
        setEditBadgeNumber('');
        setBadgeError('');
    };

    const handleSaveBadge = async () => {
        if (!editBadgeNumber.trim()) {
            setBadgeError('Badge number is required.');
            return;
        }
        setBadgeError('');
        setBadgeLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${user.id}/badges`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number: editBadgeNumber.trim() }),
            });
            const data = await res.json();
            if (!res.ok) {
                setBadgeError(data.error || 'Failed to edit badge.');
                return;
            }
            setBadge(data.badge);
            handleCancelEditBadge();
        } catch {
            setBadgeError('Network error. Please try again.');
        } finally {
            setBadgeLoading(false);
        }
    };

    const handleDeleteBadge = async () => {
        setBadgeError('');
        setBadgeLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${user.id}/badges`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (!res.ok) {
                setBadgeError(data.error || 'Failed to delete badge.');
                return;
            }
            setBadge(null);
            handleCancelEditBadge();
        } catch {
            setBadgeError('Network error. Please try again.');
        } finally {
            setBadgeLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center gap-4">
                <Link href="/admin/users" className="text-gray-500 hover:text-white text-sm transition-colors">
                    ← Users
                </Link>
                <span className="text-[#333]">/</span>
                <span className="text-white font-semibold">Edit user</span>
                {isSelf && (
                    <span className="text-xs text-gray-500 border border-[#333] rounded-full px-2.5 py-0.5">you</span>
                )}
            </header>

            <main className="max-w-lg mx-auto px-8 py-12">
                <h1 className="text-xl font-semibold mb-2">
                    {user.firstname} {user.lastname}
                </h1>
                <p className="text-gray-500 text-sm mb-8">{user.email}</p>

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
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            {errors.firstname && <span className="text-red-400 text-xs">{errors.firstname}</span>}
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-gray-400 text-sm">Last name</label>
                            <input
                                type="text"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            {errors.lastname && <span className="text-red-400 text-xs">{errors.lastname}</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        {errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Phone number</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        {errors.phoneNumber && <span className="text-red-400 text-xs">{errors.phoneNumber}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
                            disabled={isSelf}
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                        {isSelf && (
                            <span className="text-gray-600 text-xs">You cannot change your own role.</span>
                        )}
                    </div>

                    {/* ── Badge section ─────────────────────────────────── */}
                    <div className="border-t border-[#1f1f1f] pt-4">
                        <label className="text-gray-400 text-xs uppercase tracking-widest mb-3 block">Badge</label>
                        
                        {badge ? (
                            <div className="flex flex-col gap-3">
                                {editingBadge ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editBadgeNumber}
                                            onChange={(e) => setEditBadgeNumber(e.target.value)}
                                            className="flex-1 bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="Badge number"
                                        />
                                        <button
                                            onClick={handleSaveBadge}
                                            disabled={badgeLoading}
                                            className="text-xs text-green-400 hover:text-green-300 border border-green-900/50 hover:border-green-600/50 rounded-md px-3 py-2 transition-colors disabled:opacity-50"
                                        >
                                            {badgeLoading ? '…' : 'Save'}
                                        </button>
                                        <button
                                            onClick={handleCancelEditBadge}
                                            disabled={badgeLoading}
                                            className="text-xs text-gray-300 hover:text-white border border-[#333] rounded-md px-3 py-2 transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] border border-[#333] rounded-lg">
                                        <div>
                                            <p className="text-white text-sm font-medium">{badge.number}</p>
                                            <p className="text-gray-500 text-xs">
                                                Created {new Date(badge.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleStartEditBadge}
                                                className="text-xs text-blue-400 hover:text-blue-300 border border-blue-900/50 hover:border-blue-600/50 rounded-md px-3 py-1 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDeleteBadge}
                                                disabled={badgeLoading}
                                                className="text-xs text-red-500 hover:text-red-400 border border-red-900/50 hover:border-red-600/50 rounded-md px-3 py-1 transition-colors disabled:opacity-50"
                                            >
                                                {badgeLoading ? '…' : 'Remove'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {badgeError && (
                                    <p className="text-red-400 text-xs px-1">{badgeError}</p>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <p className="text-gray-500 text-xs mb-2">No badge assigned</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={badgeNumber}
                                        onChange={(e) => setBadgeNumber(e.target.value)}
                                        placeholder="Badge number"
                                        className="flex-1 bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                                    />
                                    <button
                                        onClick={handleAddBadge}
                                        disabled={badgeLoading}
                                        className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap"
                                    >
                                        {badgeLoading ? '…' : 'Add Badge'}
                                    </button>
                                </div>
                                {badgeError && (
                                    <p className="text-red-400 text-xs px-1">{badgeError}</p>
                                )}
                            </div>
                        )}
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
                            {loading ? 'Saving…' : 'Save changes'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
