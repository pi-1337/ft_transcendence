"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faIdBadge } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

interface Errors
{
	email?: string;
	password?: string;
}

export default function Login({ ft_auth_url }: { ft_auth_url: string })
{
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [show_password, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Errors>({});
	const [loading, setLoading] = useState(false);

	const validate = (): boolean =>
	{
		const newErrors: Errors = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!email.trim())
			newErrors.email = "Email address is required.";
		else if (!emailRegex.test(email))
			newErrors.email = "Please enter a valid email address.";
		if (!password)
			newErrors.password = "Password is required.";
		else if (password.length < 8)
			newErrors.password = "Password must be at least 8 characters.";
		setErrors(newErrors);
		return (Object.keys(newErrors).length === 0);
	};

	async function handleSubmit(e: React.FormEvent)
	{
		e.preventDefault();
		if (!validate())
			return ;
		setLoading(true);
		try
		{
			const response = await fetch("/api/auth/login",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();
			if (!response.ok)
			{
				toast.error(data.error || "Something went wrong.");
				return ;
			}
			if (data.requiresTwoFactor)
			{
				router.push("/auth/2fa");
				return ;
			}
			if (data.user?.role === "ADMIN")
				router.push("/admin/dashboard");
			else
				router.push("/dashboard");
		}
		catch
		{
			toast.error("Network error. Please try again.");
		}
		finally
		{
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#111111] flex flex-col items-center px-4 py-10">
			<div className="flex items-center gap-2 mb-10">
				<FontAwesomeIcon icon={faIdBadge} className="text-[#E8963A] text-2xl"/>
				<span className="text-white font-bold text-xl tracking-wide">BadgeHub</span>
			</div>

			<div className="w-full max-w-120 bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-8">
				<h1 className="text-white text-3xl font-bold text-center mb-2">Welcome Back</h1>
				<p className="text-[#888888] text-[16px] text-center mb-8">Sign in to your account to continue</p>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<label className="text-[#999999] text-xs font-semibold tracking-widest uppercase">Email Address</label>
						<input type="text" placeholder="amandour@student.1337.ma" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-all placeholder-[#555555]} pr-11"/>
						{errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-[#999999] text-xs font-semibold tracking-widest uppercase">Password</label>
						<div className="relative">
							<input type={show_password ? "text" : "password"} placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-all placeholder-[#555555]} pr-11"/>
							<button type="button" onClick={() => setShowPassword(!show_password)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#999999] transition-colors">{ show_password ? <FontAwesomeIcon icon={faEyeSlash}/> : <FontAwesomeIcon icon={faEye}/> }</button>
						</div>
						{errors.password && <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>}
					</div>

					<button type="submit" className={`w-full ${loading ? "bg-[#E8963A]/60 cursor-not-allowed" : "bg-[#E8963A] hover:bg-[#D4842A] cursor-pointer"} text-white font-bold text-[16px] tracking-widest uppercase rounded-xl py-3.5 transition-colors mt-1`}>{loading ? "Signing In..." : "Sign In"}</button>

					<div className="flex items-center gap-3 my-1">
						<div className="flex-1 h-px bg-[#2A2A2A]"/>
						<span className="text-[#555555] text-xs uppercase tracking-widest">or continue with</span>
						<div className="flex-1 h-px bg-[#2A2A2A]"/>
					</div>

					<button onClick={() => (router.push(ft_auth_url))} type="button" className="w-full bg-[#222222] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white font-semibold text-[16px] tracking-wider rounded-xl py-3.5 flex items-center justify-center gap-3 transition-colors cursor-pointer">
						<span className="bg-white text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">42</span>
						Continue with 42 Network
					</button>
				</form>

				<p className="text-[#666666] text-[16px] text-center mt-6">
					New to BadgeHub?{" "}
					<Link href="/auth/register" className="text-white font-semibold hover:text-[#E8963A] transition-colors">Sign Up</Link>
				</p>
			</div>
			<ToastContainer theme="dark"/>
		</div>
	);
}
