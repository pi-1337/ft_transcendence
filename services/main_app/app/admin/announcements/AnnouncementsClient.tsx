'use client'

import { useMemo, useState } from 'react';
import Link from 'next/link';

type Organization = {
    id: number;
    name: string;
};

type Announcement = {
    id: number;
    title: string;
    message: string;
    createdAt: Date;
    updatedAt: Date | null;
    organization: {
        id: number;
        name: string;
    };
    createdBy: {
        id: number;
        firstname: string;
        lastname: string;
        email: string;
    };
};

type Props = {
    organizations: Organization[];
    announcements: Announcement[];
};

type FormState = {
    organizationId: string;
    title: string;
    message: string;
};

const defaultFormState: FormState = {
    organizationId: '',
    title: '',
    message: '',
};

export default function AnnouncementsClient({ organizations, announcements: initialAnnouncements }: Props) {
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [form, setForm] = useState<FormState>(defaultFormState);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [info, setInfo] = useState('');
    const [error, setError] = useState('');

    const submitLabel = useMemo(() => editingId === null ? 'Send announcement' : 'Save changes', [editingId]);

    const resetForm = () => {
        setForm(defaultFormState);
        setEditingId(null);
    };

    const startEdit = (announcement: Announcement) => {
        setEditingId(announcement.id);
        setForm({
            organizationId: String(announcement.organization.id),
            title: announcement.title,
            message: announcement.message,
        });
        setInfo('');
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setInfo('');
        setError('');

        try {
            const endpoint = editingId === null
                ? '/api/admin/announcements'
                : `/api/admin/announcements/${editingId}`;
            const method = editingId === null ? 'POST' : 'PATCH';

            const body = editingId === null
                ? form
                : { title: form.title, message: form.message };

            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to save announcement.');
                return;
            }

            if (editingId === null) {
                setAnnouncements((prev) => [data.announcement, ...prev]);
                setInfo(`Announcement sent to ${data.sentToUsers ?? 0} users.`);
            } else {
                setAnnouncements((prev) => prev.map((item) => item.id === editingId ? data.announcement : item));
                setInfo('Announcement updated successfully.');
            }

            resetForm();
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this announcement? Existing notifications already sent to users will remain.'))
            return;

        setDeletingId(id);
        setInfo('');
        setError('');
        try {
            const res = await fetch(`/api/admin/announcements/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to delete announcement.');
                return;
            }

            setAnnouncements((prev) => prev.filter((item) => item.id !== id));
            setInfo('Announcement deleted.');

            if (editingId === id)
                resetForm();
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="text-gray-500 hover:text-white text-sm transition-colors">
                        ← Admin Panel
                    </Link>
                    <span className="text-[#333]">/</span>
                    <span className="text-white font-semibold">Announcements</span>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-8 py-10 grid gap-8">
                <section className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                    <h1 className="text-xl font-semibold mb-5">
                        {editingId === null ? 'New announcement' : 'Edit announcement'}
                    </h1>

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-900/30 border border-red-700/60 text-red-300 text-sm px-4 py-3">
                            {error}
                        </div>
                    )}

                    {info && (
                        <div className="mb-4 rounded-lg bg-green-900/30 border border-green-700/60 text-green-300 text-sm px-4 py-3">
                            {info}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm text-gray-400">Organization</label>
                            <select
                                value={form.organizationId}
                                onChange={(e) => setForm((prev) => ({ ...prev, organizationId: e.target.value }))}
                                disabled={editingId !== null}
                                className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm disabled:opacity-60"
                                required
                            >
                                <option value="">Select organization</option>
                                {organizations.map((org) => (
                                    <option key={org.id} value={org.id}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm text-gray-400">Title</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                                className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm"
                                placeholder="Maintenance update"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm text-gray-400">Message</label>
                            <textarea
                                value={form.message}
                                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                                className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm min-h-32"
                                placeholder="Badge system will be unavailable from 15:00 to 15:30."
                                required
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                            >
                                {loading ? 'Saving...' : submitLabel}
                            </button>
                            {editingId !== null && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="text-sm border border-[#333] hover:border-[#555] rounded-lg px-4 py-2 transition-colors"
                                >
                                    Cancel edit
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#1f1f1f]">
                        <h2 className="text-lg font-semibold">Announcement history ({announcements.length})</h2>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#1f1f1f]">
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Title</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Organization</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Message</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Created by</th>
                                <th className="text-left text-gray-500 font-medium px-5 py-3">Created</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.map((item, idx) => (
                                <tr
                                    key={item.id}
                                    className={idx !== announcements.length - 1 ? 'border-b border-[#1a1a1a]' : ''}
                                >
                                    <td className="px-5 py-3 text-white font-medium">{item.title}</td>
                                    <td className="px-5 py-3 text-gray-300">{item.organization.name}</td>
                                    <td className="px-5 py-3 text-gray-400 max-w-lg">
                                        <p className="line-clamp-2">{item.message}</p>
                                    </td>
                                    <td className="px-5 py-3 text-gray-400">
                                        {item.createdBy.firstname} {item.createdBy.lastname}
                                    </td>
                                    <td className="px-5 py-3 text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(item)}
                                                className="text-xs text-gray-300 hover:text-white border border-[#333] hover:border-[#555] rounded-md px-3 py-1 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deletingId === item.id}
                                                className="text-xs text-red-500 hover:text-red-400 border border-red-900/50 hover:border-red-600/50 rounded-md px-3 py-1 transition-colors disabled:opacity-60"
                                            >
                                                {deletingId === item.id ? '...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {announcements.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center text-gray-600">
                                        No announcements yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}
