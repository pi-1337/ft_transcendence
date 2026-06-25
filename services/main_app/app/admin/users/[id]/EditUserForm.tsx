"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

interface Badge
{
	number: string;
	createdAt: Date;
};

interface User
{
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	phoneNumber: string;
	role: string;
	badge: Badge | null;
};

interface FieldErrors
{
	firstname?: string;
	lastname?: string;
	email?: string;
	phoneNumber?: string;
};

interface Props
{
	user: User;
	isSelf: boolean;
};

export default function EditUserForm({ user, isSelf }: Props)
{
	const router = useRouter();
	const [firstname, setFirstname] = useState(user.firstname);
	const [lastname, setLastname] = useState(user.lastname);
	const [email, setEmail] = useState(user.email);
	const [phone_number, setPhoneNumber] = useState(user.phoneNumber);
	const [role, setRole] = useState<"USER" | "ADMIN">(user.role as "USER" | "ADMIN");
	const [errors, setErrors] = useState<FieldErrors>({});
	const [server_error, setServerError] = useState("");
	const [loading, setLoading] = useState(false);
	const [badge, setBadge] = useState<Badge | null>(user.badge);
	const [badge_number, setBadgeNumber] = useState("");
	const [badge_error, setBadgeError] = useState("");
	const [badge_loading, setBadgeLoading] = useState(false);
	const [editing_badge, setEditingBadge] = useState(false);
	const [edit_badge_number, setEditBadgeNumber] = useState("");

	const validate = (): FieldErrors =>
	{
		const e: FieldErrors = {};
		if (!firstname.trim())
			e.firstname = "First name is required.";
		if (!lastname.trim())
			e.lastname = "Last name is required.";
		if (!email) e.email = "Email is required.";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
			e.email = "Invalid email format.";
		if (!phone_number) e.phoneNumber = "Phone number is required.";
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
			const res = await fetch(`/api/admin/users/${user.id}`,
			{
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ firstname, lastname, email, phone_number, role }),
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

	async function handleAddBadge()
	{
		if (!badge_number.trim())
		{
			setBadgeError("Badge number is required.");
			return ;
		}
		setBadgeError("");
		setBadgeLoading(true);
		try
		{
			const res = await fetch(`/api/admin/users/${user.id}/badges`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ number: badge_number.trim() }),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setBadgeError(data.error || "Failed to add badge.");
				return ;
			}
			setBadge(data.badge);
			setBadgeNumber("");
		}
		catch
		{
			setBadgeError("Network error. Please try again.");
		}
		finally
		{
			setBadgeLoading(false);
		}
	};

	async function handleStartEditBadge()
	{
		if (badge)
		{
			setEditingBadge(true);
			setEditBadgeNumber(badge.number);
			setBadgeError("");
		}
	};

	async function handleCancelEditBadge()
	{
		setEditingBadge(false);
		setEditBadgeNumber("");
		setBadgeError("");
	};

	async function handleSaveBadge()
	{
		if (!edit_badge_number.trim())
		{
			setBadgeError("Badge number is required.");
			return ;
		}
		setBadgeError("");
		setBadgeLoading(true);
		try
		{
			const res = await fetch(`/api/admin/users/${user.id}/badges`,
			{
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ number: edit_badge_number.trim() }),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setBadgeError(data.error || "Failed to edit badge.");
				return ;
			}
			setBadge(data.badge);
			handleCancelEditBadge();
		}
		catch
		{
			setBadgeError("Network error. Please try again.");
		}
		finally
		{
			setBadgeLoading(false);
		}
	};

	async function handleDeleteBadge()
	{
		setBadgeError("");
		setBadgeLoading(true);
		try
		{
			const res = await fetch(`/api/admin/users/${user.id}/badges`,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();
			if (!res.ok)
			{
				setBadgeError(data.error || "Failed to delete badge.");
				return ;
			}
			setBadge(null);
			handleCancelEditBadge();
		}
		catch
		{
			setBadgeError("Network error. Please try again.");
		}
		finally
		{
			setBadgeLoading(false);
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
				<span className="text-[16px] font-semibold">Edit user</span>
				{isSelf && (<span className="text-xs text-[#555555] border border-[#2A2A2A] rounded-full px-2 py-0.5">you</span>)}
			</header>

			<main className="max-w-lg mx-auto px-5 md:px-8 py-10 flex flex-col gap-6">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[16px] font-bold text-[#666666] shrink-0">
						{user.firstname[0]}{user.lastname[0]}
					</div>
					<div>
						<p className="text-base font-bold">{user.firstname} {user.lastname}</p>
						<p className="text-xs text-[#555555] mt-0.5">{user.email}</p>
					</div>
				</div>

				{server_error &&
				(
					<div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[16px] px-4 py-3">
						{server_error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
					<div className="bg-[#1A1A1A] border border-[#222222] rounded-2xl overflow-hidden">
						<div className="px-5 py-3.5 border-b border-[#222222]">
							<span className="text-xs text-[#444444] font-bold uppercase tracking-widest">Profile</span>
						</div>
						<div className="p-5 flex flex-col gap-4">
							<div className="flex flex-col gap-3">
								<div className="flex flex-col gap-1.5 flex-1">
									<label className="text-sm text-[#555555] font-bold uppercase tracking-widest">First name</label>
									<input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors" />
									{errors.firstname && <span className="text-red-400 text-xs">{errors.firstname}</span>}
								</div>
								<div className="flex flex-col gap-1.5 flex-1">
									<label className="text-sm text-[#555555] font-bold uppercase tracking-widest">Last name</label>
									<input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors" />
									{errors.lastname && <span className="text-red-400 text-xs">{errors.lastname}</span>}
								</div>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="text-xs text-[#555555] font-bold uppercase tracking-widest">Email</label>
								<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors"/>
								{errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="text-xs text-[#555555] font-bold uppercase tracking-widest">Phone number</label>
								<input type="tel" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors"/>
								{errors.phoneNumber && <span className="text-red-400 text-xs">{errors.phoneNumber}</span>}
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="text-xs text-[#555555] font-bold uppercase tracking-widest">Role</label>
								<select value={role} onChange={(e) => setRole(e.target.value as "USER" | "ADMIN")} disabled={isSelf} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
									<option value="USER">User</option>
									<option value="ADMIN">Admin</option>
								</select>
								{isSelf && ( <span className="text-[#444444] text-xs">You cannot change your own role.</span> )}
							</div>
						</div>
					</div>

					<div className="bg-[#1A1A1A] border border-[#222222] rounded-2xl overflow-hidden">
						<div className="px-5 py-3.5 border-b border-[#222222]">
							<span className="text-xs text-[#444444] font-bold uppercase tracking-widest">Badge</span>
						</div>
						<div className="p-5">
						{
							badge ?
								<div className="flex flex-col gap-3">
									{editing_badge ?
										<div className="flex gap-2">
											<input type="text" value={edit_badge_number} onChange={(e) => setEditBadgeNumber(e.target.value)} placeholder="Badge number" className="flex-1 bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors"/>
											<button onClick={handleSaveBadge} disabled={badge_loading} className="text-xs text-green-400 hover:text-white hover:bg-green-500 border border-green-500/20 hover:border-green-500 rounded-xl px-3 py-2 transition-all disabled:opacity-40 cursor-pointer">{badge_loading ? "…" : "Save"}</button>
											<button onClick={handleCancelEditBadge} disabled={badge_loading} className="text-xs text-[#888888] hover:text-white border border-[#2A2A2A] hover:border-[#444444] rounded-xl px-3 py-2 transition-colors disabled:opacity-40 cursor-pointer">Cancel</button>
										</div>
									:
										<div className="flex items-center justify-between gap-3">
											<div>
												<p className="text-[16px] font-semibold text-white font-mono">{badge.number}</p>
												<p className="text-xs text-[#555555] mt-0.5">Created {new Date(badge.createdAt).toLocaleDateString()}</p>
											</div>
											<div className="flex gap-2 shrink-0">
												<button onClick={handleStartEditBadge} className="text-xs text-[#E8963A] hover:text-white hover:bg-[#E8963A] border border-[#E8963A]/20 hover:border-[#E8963A] rounded-lg px-3 py-1.5 transition-all cursor-pointer">Edit</button>
												<button onClick={handleDeleteBadge} disabled={badge_loading} className="text-xs text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20 hover:border-red-500 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40 cursor-pointer">{badge_loading ? "…" : "Remove"}</button>
											</div>
										</div>
									}
									{badge_error && (<p className="text-red-400 text-xs">{badge_error}</p>)}
								</div>
							:
								<div className="flex flex-col gap-3">
									<p className="text-xs text-[#555555]">No badge assigned</p>
									<div className="flex gap-2">
										<input type="text" value={badge_number} onChange={(e) => setBadgeNumber(e.target.value)} placeholder="Badge number" className="flex-1 bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#444444]"/>
										<button onClick={handleAddBadge} disabled={badge_loading} className="bg-[#E8963A] hover:bg-[#D4842A] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 text-[16px] font-bold transition-colors whitespace-nowrap cursor-pointer">{badge_loading ? "…" : "Add badge"}</button>
									</div>
									{badge_error && ( <p className="text-red-400 text-xs">{badge_error}</p> )}
								</div>
						}
						</div>
					</div>

					<div className="flex gap-3">
						<Link href="/admin/users" className="flex-1 text-center border border-[#2A2A2A] hover:border-[#444444] text-[#888888] hover:text-white rounded-xl py-2.5 text-[16px] font-semibold transition-colors">Cancel</Link>
						<button type="submit" disabled={loading} className="flex-1 bg-[#E8963A] hover:bg-[#D4842A] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl py-2.5 text-[16px] font-bold transition-colors cursor-pointer">{loading ? "Saving…" : "Save changes"}</button>
					</div>
				</form>
			</main>
		</div>
	);
}
