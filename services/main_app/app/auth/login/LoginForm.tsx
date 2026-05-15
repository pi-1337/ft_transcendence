"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm({ ft_auth_url }: { ft_auth_url: string }) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email) newErrors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format.";
        if (!password) newErrors.password = "Password is required.";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setServerError(data.error || "Something went wrong.");
                return;
            }

            if (data.user?.role === 'ADMIN')
                router.push('/admin/dashboard');
            else
                router.push('/dashboard');
        } catch {
            setServerError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
            <div className="bg-[#111] rounded-2xl p-8 w-full max-w-sm shadow-lg">
                <h1 className="text-white text-2xl font-semibold mb-6 text-center">Login</h1>

                {serverError && (
                    <div className="mb-4 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-3">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
                    >
                        {loading ? "Logging in…" : "Login"}
                    </button>
                </form>

                <p className="text-gray-500 text-sm text-center mt-6">
                    Don&apos;t have an account?{" "}
                    <a href="/auth/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Register
                    </a>
                </p>

                <Link href={ft_auth_url}>Authenticate using 42 Oauth</Link>

            </div>
        </div>
    );
}
