"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

interface Errors
{
	firstname?: string;
	lastname?: string;
	email?: string;
	password?: string;
	phone?: string;
}

export default function Register({ ft_auth_url }: { ft_auth_url: string })
{
	const router = useRouter();
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [phone, setPhone] = useState("");
	const [show_password, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Errors>({});

	const validate = (): boolean =>
	{
		const new_errors: Errors = {};
		const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phone_regex = /^\+[1-9]\d{6,14}$/;
 
		if (!firstname.trim())
			new_errors.firstname = "First name is required.";
		if (!lastname.trim())
			new_errors.lastname = "Last name is required.";
		if (!email.trim())
			new_errors.email = "Email address is required.";
		else if (!email_regex.test(email))
			new_errors.email = "Please enter a valid email address.";
		if (!password)
			new_errors.password = "Password is required.";
		else if (password.length < 8)
			new_errors.password = "Password must be at least 8 characters.";
		if (!phone.trim())
			new_errors.phone = "Phone number is required.";
		else if (!phone_regex.test(phone))
			new_errors.phone = "Must start with + and country code (e.g. +212613374120).";
		setErrors(new_errors);
		return (Object.keys(new_errors).length === 0);
	};
	async function handleSubmit(e: React.FormEvent)
	{
		e.preventDefault();
	
		if (!validate())
			return ;
		setLoading(true);
		try 
		{
			const response = await fetch("/api/auth/register",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password, firstname, lastname, phoneNumber: phone }),
			});
			const data = await response.json();
			if (!response.ok)
			{
				toast.error(data.error || "Something went wrong.");
				return ;
			}
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
				<FontAwesomeIcon icon={faAward} className="text-[#E8963A] text-2xl"/>
				<span className="text-white font-bold text-xl tracking-wide">BadgeHub</span>
			</div>

			<div className="w-full max-w-120 bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-8">
				<h1 className="text-white text-3xl font-bold text-center mb-2">Create account</h1>
				<p className="text-[#888888] text-[16px] text-center mb-8">Join BadgeHub and start managing your credentials</p>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex gap-4">
						<div className="flex-1 flex flex-col gap-1.5">
							<label className="text-[#999999] text-xs font-semibold tracking-widest uppercase">First Name</label>
							<input type="text" placeholder="asmae" value={firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-all placeholder-[#555555]"/>
							{errors.firstname && <p className="text-red-500 text-xs mt-0.5">{errors.firstname}</p>}
						</div>
						<div className="flex-1 flex flex-col gap-1.5">
							<label className="text-[#999999] text-xs font-semibold tracking-widest uppercase">Last Name</label>
							<input type="text" placeholder="mandour" value={lastname} onChange={(e) => setLastname(e.target.value)} className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-all placeholder-[#555555]"/>
							{errors.lastname && <p className="text-red-500 text-xs mt-0.5">{errors.lastname}</p>}
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-[#999999] text-xs font-semibold tracking-widest uppercase">Email Address</label>
						<input type="email" placeholder="amandour@student.1337.ma" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-all placeholder-[#555555]"/>
						{errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-[#999999] text-xs font-semibold tracking-widest uppercase">Password</label>
						<div className="relative">
							<input type={show_password ? "text" : "password"} placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 pr-11 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-all placeholder-[#555555]"/>
							<button type="button" onClick={() => setShowPassword(!show_password)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#999999] duration-300 transition-colors">{ show_password ? <FontAwesomeIcon icon={faEyeSlash}/> : <FontAwesomeIcon icon={faEye}/> }</button>
							{errors.password && <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>}
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-[#999999] text-xs font-semibold tracking-widest uppercase">Phone Number</label>
						<input type="tel" placeholder="+212613374120" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-all placeholder-[#555555]"/>
						{errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone}</p>}
					</div>

					<button type="submit" className={`w-full ${loading ? "bg-[#6a4a24] cursor-not-allowed" : "bg-[#E8963A] hover:bg-[#D4842A] cursor-pointer"}  text-white font-bold text-[16px] tracking-widest uppercase rounded-xl py-3.5 duration-300 transition-colors mt-1`}>{loading ? "Creating account.." : "Create Account"}</button>

					<div className="flex items-center gap-3 my-1">
						<div className="flex-1 h-px bg-[#2A2A2A]"/>
						<span className="text-[#555555] text-xs uppercase tracking-widest">or</span>
						<div className="flex-1 h-px bg-[#2A2A2A]"/>
					</div>

					<button onClick={() => (router.push(ft_auth_url))} type="button" className="w-full bg-[#222222] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white font-semibold text-[16px] tracking-wider rounded-xl py-3.5 flex items-center justify-center gap-3 duration-300 transition-colors cursor-pointer">
						<span className="bg-white text-black font-bold text-xs rounded-full w-6 h-6 flex items-center justify-center">42</span>
						Continue with 42 Network
					</button>
				</form>

				<p className="text-[#666666] text-[16px] text-center mt-6">Already have an account?{" "}
					<Link href="/auth/login" className="text-white font-semibold hover:text-[#E8963A] duration-300 transition-colors">Sign In</Link>
				</p>
			</div>
			<ToastContainer theme="dark"/>
		</div>
	);
}
