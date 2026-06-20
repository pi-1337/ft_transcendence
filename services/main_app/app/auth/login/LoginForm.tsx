"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";

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

            if (data.requiresTwoFactor) {
                router.push('/auth/2fa');
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
        <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4">
            <div className="bg-[#0b1120]/50 border border-gray-800 rounded-3xl p-10 w-full max-w-md shadow-2xl relative overflow-hidden group">
                {/* Decorative background blur */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex flex-col items-center mb-10">
                        <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20 mb-4 group-hover:scale-110 transition-transform">
                            <Shield className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h1 className="text-white text-3xl font-bold tracking-tight">Welcome back</h1>
                        <p className="text-gray-400 mt-2">Sign in to your account to continue</p>
                    </div>

                    {serverError && (
                        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 text-center">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-400 text-sm font-medium ml-1">Email address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-900/50 border border-gray-800 text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600"
                                />
                            </div>
                            {errors.email && <span className="text-red-400 text-xs ml-1">{errors.email}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-400 text-sm font-medium ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-900/50 border border-gray-800 text-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600"
                                />
                            </div>
                            {errors.password && <span className="text-red-400 text-xs ml-1">{errors.password}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-xl py-4 text-sm font-bold transition-all shadow-xl shadow-indigo-500/20 group"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-4 w-full">
                            <div className="h-px bg-gray-800 flex-1" />
                            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">or</span>
                            <div className="h-px bg-gray-800 flex-1" />
                        </div>
                        
                        <Link 
                            href={ft_auth_url}
                            className="w-full flex items-center justify-center gap-3 bg-gray-800/50 hover:bg-gray-800 text-white font-semibold rounded-xl py-4 border border-gray-700 transition-all text-sm"
                        >
                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-1">
                                <span className="text-[10px] font-black text-black">42</span>
                            </div>
                            Continue with 42 Network
                        </Link>
                        
                        <p className="text-gray-500 text-sm text-center mt-4">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
