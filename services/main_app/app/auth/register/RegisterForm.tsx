"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FieldErrors = {
    email?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    phoneNumber?: string;
};

export default function RegisterForm({ ft_auth_url }: { ft_auth_url: string }) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = (): FieldErrors => {
        const e: FieldErrors = {};
        if (!firstname.trim()) e.firstname = "First name is required.";
        if (!lastname.trim()) e.lastname = "Last name is required.";
        if (!email) e.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email format.";
        if (!password) e.password = "Password is required.";
        else if (password.length < 8) e.password = "Password must be at least 8 characters.";
        if (!phoneNumber) e.phoneNumber = "Phone number is required.";
        else if (!/^\+[1-9]\d{7,14}$/.test(phoneNumber)) e.phoneNumber = "Must start with + and country code (e.g. +1234567890).";
        return e;
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
            const response = await fetch('/api/auth/register', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, firstname, lastname, phoneNumber }),
            });

            const data = await response.json();

            if (!response.ok) {
                setServerError(data.error || "Something went wrong.");
                return;
            }

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
                <h1 className="text-white text-2xl font-semibold mb-6 text-center">Create Account</h1>

                {serverError && (
                    <div className="mb-4 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-3">
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
                    >
                        {loading ? "Creating account…" : "Register"}
                    </button>
                </form>

                <p className="text-gray-500 text-sm text-center mt-6">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Login
                    </a>
                </p>
                <Link href={ft_auth_url}>Authenticate using 42 Oauth</Link>
            </div>
        </div>
    );
}
