"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FieldErrors
{
	firstname?: string;
	lastname?: string;
	email?: string;
	password?: string;
	phoneNumber?: string;
};

export default function CreateUserForm()
{
	const router = useRouter();
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [phone_number, setPhoneNumber] = useState("");
	const [role, setRole] = useState<"USER" | "ADMIN">("USER");
	const [errors, setErrors] = useState<FieldErrors>({});
	const [server_error, setServerError] = useState("");
	const [loading, setLoading] = useState(false);

	function validate(): FieldErrors
	{
		const e: FieldErrors = {};
		if (!firstname.trim())
			e.firstname = "First name is required.";
		if (!lastname.trim())
			e.lastname = "Last name is required.";
		if (!email)
			e.email = "Email is required.";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
			e.email = "Invalid email format.";
		if (!password)
			e.password = "Password is required.";
		else if (password.length < 8)
			e.password = "Password must be at least 8 characters.";
		if (!phone_number)
			e.phoneNumber = "Phone number is required.";
		else if (!/^\+[1-9]\d{7,14}$/.test(phone_number))
			e.phoneNumber = "Must start with + and country code.";
		return (e);
	};

	async function handleSubmit(e: React.FormEvent)
	{
		e.preventDefault();
		setServerError("");

		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0)
		{
			setErrors(validationErrors);
			return ;
		}
		setErrors({});

		setLoading(true);
		try
		{
			const res = await fetch("/api/admin/users/create", 
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ firstname, lastname, email, password, phone_number, role }),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setServerError(data.error || "Something went wrong.");
				return ;
			}
			router.push("/admin/users");
		}
		catch
		{
			setServerError("Network error. Please try again.");
		}
		finally
		{
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#111111] text-white">
			<header className="px-5 md:px-8 py-4 border-b border-[#222222] flex items-center gap-3 sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md">
				<Link href="/admin/users" className="flex items-center gap-1.5 text-[#555555] hover:text-white text-[16px] transition-colors group">
					<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-0.5 transition-transform" />
					Users
				</Link>
				<div className="w-px h-4 bg-[#2A2A2A]" />
				<span className="text-[16px] font-semibold">Add user</span>
			</header>

			<main className="max-w-lg mx-auto px-5 md:px-8 py-10 flex flex-col gap-6">
				<h1 className="text-xl font-bold">Create new user</h1>
				{server_error &&
				(
					<div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[16px] px-4 py-3">
						{server_error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
					<div className="bg-[#1A1A1A] border border-[#222222] rounded-2xl p-5 flex flex-col gap-4">
						<div className="flex flex-col gap-3">
							<div className="flex flex-col gap-1.5 flex-1">
								<label className="text-xs text-[#555555] font-bold uppercase tracking-widest">First name</label>
								<input type="text" placeholder="John" value={firstname} onChange={(e) => setFirstname(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#444444]"/>
								{errors.firstname && <span className="text-red-400 text-xs">{errors.firstname}</span>}
							</div>
							<div className="flex flex-col gap-1.5 flex-1">
								<label className="text-xs text-[#555555] font-bold uppercase tracking-widest">Last name</label>
								<input type="text" placeholder="Doe" value={lastname} onChange={(e) => setLastname(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#444444]"/>
								{errors.lastname && <span className="text-red-400 text-xs">{errors.lastname}</span>}
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-xs text-[#555555] font-bold uppercase tracking-widest">Email</label>
							<input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#444444]"/>
							{errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-xs text-[#555555] font-bold uppercase tracking-widest">Password</label>
							<input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#444444]"/>
							{errors.password && <span className="text-red-400 text-xs">{errors.password}</span>}
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-xs text-[#555555] font-bold uppercase tracking-widest">Phone number</label>
							<input type="tel" placeholder="+1234567890" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#444444]"/>
							{errors.phoneNumber && <span className="text-red-400 text-xs">{errors.phoneNumber}</span>}
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-xs text-[#555555] font-bold uppercase tracking-widest">Role</label>
							<select value={role} onChange={(e) => setRole(e.target.value as "USER" | "ADMIN")} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors">
								<option value="USER">User</option>
								<option value="ADMIN">Admin</option>
							</select>
						</div>
					</div>

					<div className="flex gap-3">
						<Link href="/admin/users" className="flex-1 text-center border border-[#2A2A2A] hover:border-[#444444] text-[#888888] hover:text-white rounded-xl py-2.5 text-[16px] font-semibold transition-colors">Cancel</Link>
						<button type="submit" disabled={loading} className="flex-1 bg-[#E8963A] hover:bg-[#D4842A] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl py-2.5 text-[16px] font-bold transition-colors">{loading ? "Creating…" : "Create user"}</button>
					</div>
				</form>
			</main>
		</div>
	);
}
