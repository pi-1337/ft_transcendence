'use client'

import { useState } from 'react';
import Link from 'next/link';

type Member = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
};

type Meal = {
    id: number;
    name: string;
    startTime: string | Date;
    endTime: string | Date;
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
    meals: Meal[];
};

type FormConfig = {
    backHref: string;
    backLabel: string;
    title: string;
    saveFieldsUrl: string;
    addMemberUrl: string;
    removeMemberUrl: string;
    mealsUrl: string;
    addAdminUrl?: string;
    removeAdminUrl?: string;
    showAdminSection?: boolean;
    blockAdminMemberRemoval?: boolean;
};

type Props = {
    org: Org;
    config?: FormConfig;
};

export default function EditOrgForm({ org, config }: Props) {
    const resolvedConfig: Required<FormConfig> = {
        backHref: config?.backHref ?? '/admin/orgs',
        backLabel: config?.backLabel ?? 'Organizations',
        title: config?.title ?? 'Edit org',
        saveFieldsUrl: config?.saveFieldsUrl ?? `/api/admin/orgs/${org.id}`,
        addMemberUrl: config?.addMemberUrl ?? `/api/admin/orgs/${org.id}/members`,
        removeMemberUrl: config?.removeMemberUrl ?? `/api/admin/orgs/${org.id}/members`,
        mealsUrl: config?.mealsUrl ?? `/api/admin/orgs/${org.id}/meals`,
        addAdminUrl: config?.addAdminUrl ?? `/api/admin/orgs/${org.id}/admins`,
        removeAdminUrl: config?.removeAdminUrl ?? `/api/admin/orgs/${org.id}/admins`,
        showAdminSection: config?.showAdminSection ?? true,
        blockAdminMemberRemoval: config?.blockAdminMemberRemoval ?? false,
    };

    const toTimeInput = (value: string | Date) => {
        const date = value instanceof Date ? value : new Date(value);
        if (isNaN(date.getTime())) {
            return '';
        }
        const hh = String(date.getUTCHours()).padStart(2, '0');
        const mm = String(date.getUTCMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    };

    const toMinutes = (value: string) => {
        const [hh, mm] = value.split(':');
        const hours = parseInt(hh, 10);
        const minutes = parseInt(mm, 10);
        if (isNaN(hours) || isNaN(minutes)) {
            return null;
        }
        return (hours * 60) + minutes;
    };

    const validateMeal = (mealName: string, start: string, end: string) => {
        if (!mealName.trim()) {
            return 'Meal name is required.';
        }
        if (!start || !end) {
            return 'Start and end times are required.';
        }
        const startMinutes = toMinutes(start);
        const endMinutes = toMinutes(end);
        if (startMinutes === null || endMinutes === null) {
            return 'Invalid meal time format.';
        }
        if (endMinutes <= startMinutes) {
            return 'End time must be after start time.';
        }
        return '';
    };

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

    // Meals state
    const [meals, setMeals] = useState<Meal[]>(
        [...org.meals]
            .sort((a, b) => toTimeInput(a.startTime).localeCompare(toTimeInput(b.startTime)))
    );
    const [mealFormName, setMealFormName] = useState('');
    const [mealFormStartTime, setMealFormStartTime] = useState('');
    const [mealFormEndTime, setMealFormEndTime] = useState('');
    const [mealError, setMealError] = useState('');
    const [mealLoading, setMealLoading] = useState(false);
    const [removingMealId, setRemovingMealId] = useState<number | null>(null);
    const [savingMealId, setSavingMealId] = useState<number | null>(null);
    const [mealRowErrors, setMealRowErrors] = useState<Record<number, string>>({});

    const [editingMealId, setEditingMealId] = useState<number | null>(null);
    const [editMealName, setEditMealName] = useState('');
    const [editMealStartTime, setEditMealStartTime] = useState('');
    const [editMealEndTime, setEditMealEndTime] = useState('');

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
            const res = await fetch(resolvedConfig.saveFieldsUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orgId: org.id, name, type, service, badgeTimes: bt, active, callBackURL: callBackURL || null }),
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
            const res = await fetch(resolvedConfig.addMemberUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orgId: org.id, email: addMemberEmail.trim() }),
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
        if (resolvedConfig.blockAdminMemberRemoval && isOrgAdmin(member)) {
            setMemberErrors(prev => ({ ...prev, [member.id]: 'Org admins cannot be removed from this page.' }));
            return;
        }

        setRemovingMemberId(member.id);
        setMemberErrors(prev => ({ ...prev, [member.id]: '' }));
        try {
            const res = await fetch(resolvedConfig.removeMemberUrl, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orgId: org.id, email: member.email }),
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
            const res = await fetch(resolvedConfig.addAdminUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orgId: org.id, email: addAdminEmail.trim() }),
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
            const res = await fetch(resolvedConfig.removeAdminUrl, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orgId: org.id, email: admin.email }),
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

    // ── Meals CRUD ───────────────────────────────────────────────
    const handleAddMeal = async () => {
        const validationError = validateMeal(mealFormName, mealFormStartTime, mealFormEndTime);
        if (validationError) {
            setMealError(validationError);
            return;
        }

        setMealError('');
        setMealLoading(true);
        try {
            const res = await fetch(resolvedConfig.mealsUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orgId: org.id,
                    name: mealFormName.trim(),
                    startTime: mealFormStartTime,
                    endTime: mealFormEndTime,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMealError(data.error || 'Failed to add meal.');
                return;
            }

            setMeals(prev => [...prev, data.meal].sort((a, b) => toTimeInput(a.startTime).localeCompare(toTimeInput(b.startTime))));
            setMealFormName('');
            setMealFormStartTime('');
            setMealFormEndTime('');
        } catch {
            setMealError('Network error. Please try again.');
        } finally {
            setMealLoading(false);
        }
    };

    const handleStartEditMeal = (meal: Meal) => {
        setEditingMealId(meal.id);
        setEditMealName(meal.name);
        setEditMealStartTime(toTimeInput(meal.startTime));
        setEditMealEndTime(toTimeInput(meal.endTime));
        setMealRowErrors(prev => ({ ...prev, [meal.id]: '' }));
    };

    const handleCancelEditMeal = () => {
        setEditingMealId(null);
        setEditMealName('');
        setEditMealStartTime('');
        setEditMealEndTime('');
    };

    const handleSaveMeal = async (mealId: number) => {
        const validationError = validateMeal(editMealName, editMealStartTime, editMealEndTime);
        if (validationError) {
            setMealRowErrors(prev => ({ ...prev, [mealId]: validationError }));
            return;
        }

        setSavingMealId(mealId);
        setMealRowErrors(prev => ({ ...prev, [mealId]: '' }));
        try {
            const res = await fetch(resolvedConfig.mealsUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orgId: org.id,
                    mealId,
                    name: editMealName.trim(),
                    startTime: editMealStartTime,
                    endTime: editMealEndTime,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMealRowErrors(prev => ({ ...prev, [mealId]: data.error || 'Failed to save meal.' }));
                return;
            }

            setMeals(prev =>
                prev
                    .map(m => (m.id === mealId ? data.meal : m))
                    .sort((a, b) => toTimeInput(a.startTime).localeCompare(toTimeInput(b.startTime)))
            );
            handleCancelEditMeal();
        } catch {
            setMealRowErrors(prev => ({ ...prev, [mealId]: 'Network error.' }));
        } finally {
            setSavingMealId(null);
        }
    };

    const handleRemoveMeal = async (mealId: number) => {
        setRemovingMealId(mealId);
        setMealRowErrors(prev => ({ ...prev, [mealId]: '' }));
        try {
            const res = await fetch(resolvedConfig.mealsUrl, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orgId: org.id, mealId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMealRowErrors(prev => ({ ...prev, [mealId]: data.error || 'Failed to remove meal.' }));
                return;
            }

            setMeals(prev => prev.filter(m => m.id !== mealId));
            if (editingMealId === mealId) {
                handleCancelEditMeal();
            }
        } catch {
            setMealRowErrors(prev => ({ ...prev, [mealId]: 'Network error.' }));
        } finally {
            setRemovingMealId(null);
        }
    };

    const isOrgAdmin = (member: Member) => admins.some(a => a.id === member.id);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center gap-4">
                <Link href={resolvedConfig.backHref} className="text-gray-500 hover:text-white text-sm transition-colors">
                    ← {resolvedConfig.backLabel}
                </Link>
                <span className="text-[#333]">/</span>
                <span className="text-white font-semibold">{resolvedConfig.title}</span>
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
                                            disabled={removingMemberId === member.id || (resolvedConfig.blockAdminMemberRemoval && isOrgAdmin(member))}
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
                {resolvedConfig.showAdminSection && (
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
                )}

                {/* ── Section 4: Meals ──────────────────────────────── */}
                <section className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                    <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-5">
                        Meals ({meals.length})
                    </h2>

                    {meals.length > 0 && (
                        <div className="flex flex-col mb-5">
                            {meals.map(meal => {
                                const isEditing = editingMealId === meal.id;
                                const currentStart = toTimeInput(meal.startTime);
                                const currentEnd = toTimeInput(meal.endTime);

                                return (
                                    <div key={meal.id}>
                                        <div className="flex items-center justify-between py-2.5 border-b border-[#1a1a1a] last:border-0 gap-3">
                                            {isEditing ? (
                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                    <input
                                                        type="text"
                                                        value={editMealName}
                                                        onChange={e => setEditMealName(e.target.value)}
                                                        className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                                        placeholder="Meal name"
                                                    />
                                                    <input
                                                        type="time"
                                                        value={editMealStartTime}
                                                        onChange={e => setEditMealStartTime(e.target.value)}
                                                        className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                    <input
                                                        type="time"
                                                        value={editMealEndTime}
                                                        onChange={e => setEditMealEndTime(e.target.value)}
                                                        className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex-1">
                                                    <span className="text-white text-sm">{meal.name}</span>
                                                    <p className="text-gray-500 text-xs">{currentStart} - {currentEnd}</p>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveMeal(meal.id)}
                                                            disabled={savingMealId === meal.id}
                                                            className="text-xs text-green-400 hover:text-green-300 border border-green-900/50 hover:border-green-600/50 rounded-md px-3 py-1 transition-colors disabled:opacity-50"
                                                        >
                                                            {savingMealId === meal.id ? '…' : 'Save'}
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEditMeal}
                                                            disabled={savingMealId === meal.id}
                                                            className="text-xs text-gray-300 hover:text-white border border-[#333] rounded-md px-3 py-1 transition-colors disabled:opacity-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStartEditMeal(meal)}
                                                        className="text-xs text-blue-400 hover:text-blue-300 border border-blue-900/50 hover:border-blue-600/50 rounded-md px-3 py-1 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRemoveMeal(meal.id)}
                                                    disabled={removingMealId === meal.id || savingMealId === meal.id}
                                                    className="text-xs text-red-500 hover:text-red-400 border border-red-900/50 hover:border-red-600/50 rounded-md px-3 py-1 transition-colors disabled:opacity-50"
                                                >
                                                    {removingMealId === meal.id ? '…' : 'Remove'}
                                                </button>
                                            </div>
                                        </div>
                                        {mealRowErrors[meal.id] && (
                                            <p className="text-red-400 text-xs px-1 pb-1">{mealRowErrors[meal.id]}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {mealError && (
                        <div className="mb-3 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-2.5">
                            {mealError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                            type="text"
                            value={mealFormName}
                            onChange={e => setMealFormName(e.target.value)}
                            placeholder="Meal name"
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                        />
                        <input
                            type="time"
                            value={mealFormStartTime}
                            onChange={e => setMealFormStartTime(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <input
                            type="time"
                            value={mealFormEndTime}
                            onChange={e => setMealFormEndTime(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="flex justify-end mt-3">
                        <button
                            onClick={handleAddMeal}
                            disabled={mealLoading}
                            className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap"
                        >
                            {mealLoading ? '…' : 'Add meal'}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

