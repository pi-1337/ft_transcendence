'use client'

import { useState } from 'react';
import Link from 'next/link';

type Member = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
};

type Org = {
    id: number;
    name: string;
    type: string;
    service: string;
    badgeTimes: number;
    active: 'TRUE' | 'FALSE';
    callBackURL: string | null;
    users: Member[];
    admins: Member[];
};

type Props = {
    org: Org;
};

export default function EditOrgForm({ org }: Props) {
    // Fields form state
    const [name, setName] = useState(org.name);
    const [type, setType] = useState(org.type);
    const [service, setService] = useState(org.service);
    const [badgeTimes, setBadgeTimes] = useState(String(org.badgeTimes));
    const [active, setActive] = useState<'TRUE' | 'FALSE'>(org.active);
    const [callBackURL, setCallBackURL] = useState(org.callBackURL ?? '');
    const [fieldError, setFieldError] = useState('');
    const [fieldSaved, setFieldSaved] = useState(false);
    const [fieldLoading, setFieldLoading] = useState(false);

    // Members state
    const [members, setMembers] = useState<Member[]>(org.users);
    const [addMemberEmail, setAddMemberEmail] = useState('');
    const [addMemberError, setAddMemberError] = useState('');
    const [addMemberLoading, setAddMemberLoading] = useState(false);
    const [removingMemberId, setRemovingMemberId] = useState<number | null>(null);
    const [memberErrors, setMemberErrors] = useState<Record<number, string>>({});

    // Admins state
    const [admins, setAdmins] = useState<Member[]>(org.admins);
    const [addAdminEmail, setAddAdminEmail] = useState('');
    const [addAdminError, setAddAdminError] = useState('');
    const [addAdminLoading, setAddAdminLoading] = useState(false);
    const [removingAdminId, setRemovingAdminId] = useState<number | null>(null);
    const [adminErrors, setAdminErrors] = useState<Record<number, string>>({});

    // ── Fields save ──────────────────────────────────────────────
    const handleFieldsSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setFieldError('');
        setFieldSaved(false);

        const bt = parseInt(badgeTimes);
        if (!name.trim() || !type.trim() || !service.trim()) {
            setFieldError('Name, type, and service are required.');
            return;
        }
        if (isNaN(bt) || bt < 1) {
            setFieldError('Badge times must be a positive integer.');
            return;
        }

        setFieldLoading(true);
        try {
            const res = await fetch(`/api/admin/orgs/${org.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, type, service, badgeTimes: bt, active, callBackURL: callBackURL || null }),
            });
            const data = await res.json();
            if (!res.ok) {
                setFieldError(data.error || 'Failed to save changes.');
                return;
            }
            setFieldSaved(true);
            setTimeout(() => setFieldSaved(false), 3000);
        } catch {
            setFieldError('Network error. Please try again.');
        } finally {
            setFieldLoading(false);
        }
    };

    // ── Add member ───────────────────────────────────────────────
    const handleAddMember = async () => {
        if (!addMemberEmail.trim()) {
            setAddMemberError('Enter an email address.');
            return;
        }
        setAddMemberError('');
        setAddMemberLoading(true);
        try {
            const res = await fetch(`/api/admin/orgs/${org.id}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: addMemberEmail.trim() }),
            });
            const data = await res.json();
            if (!res.ok) {
                setAddMemberError(data.error || 'Failed to add member.');
                return;
            }
            setMembers(prev => [...prev, data.user]);
            setAddMemberEmail('');
        } catch {
            setAddMemberError('Network error. Please try again.');
        } finally {
            setAddMemberLoading(false);
        }
    };

    // ── Remove member ────────────────────────────────────────────
    const handleRemoveMember = async (member: Member) => {
        setRemovingMemberId(member.id);
        setMemberErrors(prev => ({ ...prev, [member.id]: '' }));
        try {
            const res = await fetch(`/api/admin/orgs/${org.id}/members`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: member.email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMemberErrors(prev => ({ ...prev, [member.id]: data.error || 'Failed to remove member.' }));
                return;
            }
            setMembers(prev => prev.filter(m => m.id !== member.id));
            // Also remove from admins state if they were an org admin
            setAdmins(prev => prev.filter(a => a.id !== member.id));
        } catch {
            setMemberErrors(prev => ({ ...prev, [member.id]: 'Network error.' }));
        } finally {
            setRemovingMemberId(null);
        }
    };

    // ── Add org admin ────────────────────────────────────────────
    const handleAddAdmin = async () => {
        if (!addAdminEmail.trim()) {
            setAddAdminError('Enter an email address.');
            return;
        }
        setAddAdminError('');
        setAddAdminLoading(true);
        try {
            const res = await fetch(`/api/admin/orgs/${org.id}/admins`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: addAdminEmail.trim() }),
            });
            const data = await res.json();
            if (!res.ok) {
                setAddAdminError(data.error || 'Failed to add admin.');
                return;
            }
            setAdmins(prev => [...prev, data.user]);
            // Auto-add to members list if not already there
            setMembers(prev =>
                prev.some(m => m.id === data.user.id) ? prev : [...prev, data.user]
            );
            setAddAdminEmail('');
        } catch {
            setAddAdminError('Network error. Please try again.');
        } finally {
            setAddAdminLoading(false);
        }
    };

    // ── Remove org admin ─────────────────────────────────────────
    const handleRemoveAdmin = async (admin: Member) => {
        setRemovingAdminId(admin.id);
        setAdminErrors(prev => ({ ...prev, [admin.id]: '' }));
        try {
            const res = await fetch(`/api/admin/orgs/${org.id}/admins`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: admin.email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setAdminErrors(prev => ({ ...prev, [admin.id]: data.error || 'Failed to remove admin.' }));
                return;
            }
            setAdmins(prev => prev.filter(a => a.id !== admin.id));
        } catch {
            setAdminErrors(prev => ({ ...prev, [admin.id]: 'Network error.' }));
        } finally {
            setRemovingAdminId(null);
        }
    };

    const isOrgAdmin = (member: Member) => admins.some(a => a.id === member.id);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center gap-4">
                <Link href="/admin/orgs" className="text-gray-500 hover:text-white text-sm transition-colors">
                    ← Organizations
                </Link>
                <span className="text-[#333]">/</span>
                <span className="text-white font-semibold">Edit org</span>
            </header>

            <main className="max-w-2xl mx-auto px-8 py-12 flex flex-col gap-10">
                <div>
                    <h1 className="text-xl font-semibold mb-1">{org.name}</h1>
                    <p className="text-gray-500 text-sm">ID: {org.id}</p>
                </div>

                {/* ── Section 1: Fields ─────────────────────────────── */}
                <section className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                    <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-5">Organization details</h2>

                    {fieldError && (
                        <div className="mb-4 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-3">
                            {fieldError}
                        </div>
                    )}

                    <form onSubmit={handleFieldsSave} className="flex flex-col gap-4" noValidate>
                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-gray-400 text-sm">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-gray-400 text-sm">Type</label>
                                <input
                                    type="text"
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                    className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-gray-400 text-sm">Service</label>
                                <input
                                    type="text"
                                    value={service}
                                    onChange={e => setService(e.target.value)}
                                    className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-36">
                                <label className="text-gray-400 text-sm">Badge times</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={badgeTimes}
                                    onChange={e => setBadgeTimes(e.target.value)}
                                    className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-gray-400 text-sm">Status</label>
                                <select
                                    value={active}
                                    onChange={e => setActive(e.target.value as 'TRUE' | 'FALSE')}
                                    className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="TRUE">Active</option>
                                    <option value="FALSE">Inactive</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-gray-400 text-sm">Callback URL <span className="text-gray-600">(optional)</span></label>
                                <input
                                    type="url"
                                    value={callBackURL}
                                    onChange={e => setCallBackURL(e.target.value)}
                                    placeholder="https://..."
                                    className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                            {fieldSaved ? (
                                <span className="text-green-400 text-sm">Saved ✓</span>
                            ) : (
                                <span />
                            )}
                            <button
                                type="submit"
                                disabled={fieldLoading}
                                className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg px-5 py-2 text-sm font-medium transition-colors"
                            >
                                {fieldLoading ? 'Saving…' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                </section>

                {/* ── Section 2: Members ────────────────────────────── */}
                <section className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                    <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-5">
                        Members ({members.length})
                    </h2>

                    {members.length > 0 && (
                        <div className="flex flex-col mb-5">
                            {members.map(member => (
                                <div key={member.id}>
                                    <div className="flex items-center justify-between py-2.5 border-b border-[#1a1a1a] last:border-0">
                                        <div>
                                            <span className="text-white text-sm">
                                                {member.firstname} {member.lastname}
                                            </span>
                                            {isOrgAdmin(member) && (
                                                <span className="ml-2 text-xs bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-2 py-0.5">
                                                    org admin
                                                </span>
                                            )}
                                            <p className="text-gray-500 text-xs">{member.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveMember(member)}
                                            disabled={removingMemberId === member.id}
                                            className="text-xs text-red-500 hover:text-red-400 border border-red-900/50 hover:border-red-600/50 rounded-md px-3 py-1 transition-colors disabled:opacity-50"
                                        >
                                            {removingMemberId === member.id ? '…' : 'Remove'}
                                        </button>
                                    </div>
                                    {memberErrors[member.id] && (
                                        <p className="text-red-400 text-xs px-1 pb-1">{memberErrors[member.id]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {addMemberError && (
                        <div className="mb-3 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-2.5">
                            {addMemberError}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={addMemberEmail}
                            onChange={e => setAddMemberEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
                            placeholder="user@example.com"
                            className="flex-1 bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                        />
                        <button
                            onClick={handleAddMember}
                            disabled={addMemberLoading}
                            className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap"
                        >
                            {addMemberLoading ? '…' : 'Add member'}
                        </button>
                    </div>
                </section>

                {/* ── Section 3: Org admins ─────────────────────────── */}
                <section className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                    <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-5">
                        Org admins ({admins.length})
                    </h2>

                    {admins.length > 0 && (
                        <div className="flex flex-col mb-5">
                            {admins.map(admin => (
                                <div key={admin.id}>
                                    <div className="flex items-center justify-between py-2.5 border-b border-[#1a1a1a] last:border-0">
                                        <div>
                                            <span className="text-white text-sm">
                                                {admin.firstname} {admin.lastname}
                                            </span>
                                            <p className="text-gray-500 text-xs">{admin.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveAdmin(admin)}
                                            disabled={removingAdminId === admin.id}
                                            className="text-xs text-red-500 hover:text-red-400 border border-red-900/50 hover:border-red-600/50 rounded-md px-3 py-1 transition-colors disabled:opacity-50"
                                        >
                                            {removingAdminId === admin.id ? '…' : 'Demote'}
                                        </button>
                                    </div>
                                    {adminErrors[admin.id] && (
                                        <p className="text-red-400 text-xs px-1 pb-1">{adminErrors[admin.id]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {addAdminError && (
                        <div className="mb-3 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-2.5">
                            {addAdminError}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={addAdminEmail}
                            onChange={e => setAddAdminEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddAdmin())}
                            placeholder="user@example.com"
                            className="flex-1 bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                        />
                        <button
                            onClick={handleAddAdmin}
                            disabled={addAdminLoading}
                            className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap"
                        >
                            {addAdminLoading ? '…' : 'Add admin'}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

