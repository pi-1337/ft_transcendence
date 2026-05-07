'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type FieldErrors = {
    name?: string;
    type?: string;
    service?: string;
    badgeTimes?: string;
    callBackURL?: string;
};

export default function CreateOrgForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [service, setService] = useState('');
    const [badgeTimes, setBadgeTimes] = useState('');
    const [active, setActive] = useState<'TRUE' | 'FALSE'>('FALSE');
    const [callBackURL, setCallBackURL] = useState('');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = (): FieldErrors => {
        const e: FieldErrors = {};
        if (!name.trim()) e.name = 'Name is required.';
        if (!type.trim()) e.type = 'Type is required.';
        if (!service.trim()) e.service = 'Service is required.';
        if (!badgeTimes) {
            e.badgeTimes = 'Badge times is required.';
        } else {
            const bt = parseInt(badgeTimes);
            if (isNaN(bt) || bt < 1) e.badgeTimes = 'Must be a positive integer.';
        }
        if (callBackURL && !/^https?:\/\/.+/.test(callBackURL))
            e.callBackURL = 'Must be a valid URL starting with http(s)://.';
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
            const res = await fetch('/api/admin/orgs/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    type,
                    service,
                    badgeTimes: parseInt(badgeTimes),
                    active,
                    callBackURL: callBackURL || null,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setServerError(data.error || 'Something went wrong.');
                return;
            }
            router.push('/admin/orgs');
        } catch {
            setServerError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center gap-4">
                <Link href="/admin/orgs" className="text-gray-500 hover:text-white text-sm transition-colors">
                    ← Organizations
                </Link>
                <span className="text-[#333]">/</span>
                <span className="text-white font-semibold">Create org</span>
            </header>

            <main className="max-w-lg mx-auto px-8 py-12">
                <h1 className="text-xl font-semibold mb-8">Create new organization</h1>

                {serverError && (
                    <div className="mb-6 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-3">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Name</label>
                        <input
                            type="text"
                            placeholder="Acme Corp"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                        />
                        {errors.name && <span className="text-red-400 text-xs">{errors.name}</span>}
                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-gray-400 text-sm">Type</label>
                            <input
                                type="text"
                                placeholder="e.g. NGO"
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                            />
                            {errors.type && <span className="text-red-400 text-xs">{errors.type}</span>}
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-gray-400 text-sm">Service</label>
                            <input
                                type="text"
                                placeholder="e.g. Healthcare"
                                value={service}
                                onChange={e => setService(e.target.value)}
                                className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                            />
                            {errors.service && <span className="text-red-400 text-xs">{errors.service}</span>}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1 w-40">
                            <label className="text-gray-400 text-sm">Badge times</label>
                            <input
                                type="number"
                                min={1}
                                placeholder="1"
                                value={badgeTimes}
                                onChange={e => setBadgeTimes(e.target.value)}
                                className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                            />
                            {errors.badgeTimes && <span className="text-red-400 text-xs">{errors.badgeTimes}</span>}
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-gray-400 text-sm">Status</label>
                            <select
                                value={active}
                                onChange={e => setActive(e.target.value as 'TRUE' | 'FALSE')}
                                className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="FALSE">Inactive</option>
                                <option value="TRUE">Active</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">
                            Callback URL <span className="text-gray-600">(optional)</span>
                        </label>
                        <input
                            type="url"
                            placeholder="https://..."
                            value={callBackURL}
                            onChange={e => setCallBackURL(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-600"
                        />
                        {errors.callBackURL && <span className="text-red-400 text-xs">{errors.callBackURL}</span>}
                    </div>

                    <div className="flex gap-3 mt-2">
                        <Link
                            href="/admin/orgs"
                            className="flex-1 text-center border border-[#333] text-gray-400 hover:text-white hover:border-[#555] rounded-lg py-2.5 text-sm transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
                        >
                            {loading ? 'Creating…' : 'Create organization'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
