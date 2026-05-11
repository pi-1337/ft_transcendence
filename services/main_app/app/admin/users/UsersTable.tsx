'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

type User = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    createdAt: Date;
};

type Props = {
    users: User[];
    currentAdminId: number;
};

export default function UsersTable({ users: initialUsers, currentAdminId }: Props) {
    const router = useRouter();
    const [users, setUsers] = useState(initialUsers);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        setDeletingId(id);
        setError('');
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to delete user.');
                return;
            }
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top bar */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
                        ← Admin Panel
                    </Link>
                    <span className="text-[#333]">/</span>
                    <span className="text-white font-semibold">Users</span>
                </div>
                <Link
                    href="/admin/users/create"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg px-4 py-1.5 transition-colors"
                >
                    + Add user
                </Link>
            </header>

            <main className="max-w-5xl mx-auto px-8 py-10">
                <h1 className="text-xl font-semibold mb-6">All users ({users.length})</h1>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-3">
                        {error}
                    </div>
                )}

                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#1f1f1f]">
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Name</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Email</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Role</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Created</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, i) => (
                                <tr
                                    key={user.id}
                                    className={i !== users.length - 1 ? 'border-b border-[#1a1a1a]' : ''}
                                >
                                    <td className="px-5 py-3 text-white">
                                        {user.firstname} {user.lastname}
                                        {user.id === currentAdminId && (
                                            <span className="ml-2 text-xs text-gray-600">(you)</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-gray-400">{user.email}</td>
                                    <td className="px-5 py-3">
                                        {user.role === 'ADMIN' ? (
                                            <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-2.5 py-0.5">
                                                ADMIN
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] rounded-full px-2.5 py-0.5">
                                                USER
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="text-xs text-gray-400 hover:text-white border border-[#333] hover:border-[#555] rounded-md px-3 py-1 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            {user.id !== currentAdminId && (
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={deletingId === user.id}
                                                    className="text-xs text-red-500 hover:text-red-400 border border-red-900/50 hover:border-red-600/50 rounded-md px-3 py-1 transition-colors disabled:opacity-50"
                                                >
                                                    {deletingId === user.id ? '…' : 'Delete'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-8 text-center text-gray-600">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
