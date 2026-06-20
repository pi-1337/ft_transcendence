"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TwoFactorClient() {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("Enter the verification code sent to your email.");

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch('/api/auth/2fa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Invalid code.');
                return;
            }

            if (data.user?.role === 'ADMIN')
                router.push('/admin/dashboard');
            else
                router.push('/dashboard');
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError("");
        setResending(true);

        try {
            const res = await fetch('/api/auth/2fa/resend', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) {
                if (data.retryAfter)
                    setError(`Please wait ${data.retryAfter}s before requesting another code.`);
                else
                    setError(data.error || 'Could not resend code.');
                return;
            }

            setInfo(`A new code was sent to ${data.maskedEmail ?? 'your email'}.`);
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0b1120]/60 border border-gray-800 rounded-3xl p-8">
                <h1 className="text-2xl font-bold mb-2">Two-factor verification</h1>
                <p className="text-gray-400 text-sm mb-6">{info}</p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-900/40 border border-red-600 text-red-300 text-sm px-4 py-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={8}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white tracking-[0.35em] text-center"
                        placeholder="000000"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded-xl py-3 font-semibold"
                    >
                        {loading ? 'Verifying...' : 'Verify and continue'}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="mt-4 w-full border border-gray-700 hover:border-gray-500 rounded-xl py-3 text-sm text-gray-300 disabled:opacity-60"
                >
                    {resending ? 'Sending...' : 'Resend code'}
                </button>
            </div>
        </div>
    );
}
