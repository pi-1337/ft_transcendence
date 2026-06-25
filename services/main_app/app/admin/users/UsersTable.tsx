"use client"
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faPlus, faUsers } from "@fortawesome/free-solid-svg-icons";

interface User
{
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	role: string;
	createdAt: Date;
};

interface Props
{
	users: User[];
	currentAdminId: number;
};

export default function UsersTable({ users: initialUsers, currentAdminId }: Props)
{
	const [users, setUsers] = useState(initialUsers);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [error, setError] = useState("");

	async function handleDelete(id: number)
	{
		if (!confirm("Are you sure you want to delete this user?"))
			return ;

		setDeletingId(id);
		setError("");
		try
		{
			const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
			const data = await res.json();
			if (!res.ok)
			{
				setError(data.error || "Failed to delete user.");
				return ;
			}
			setUsers((prev) => prev.filter((u) => u.id !== id));
		}
		catch
		{
			setError("Network error. Please try again.");
		}
		finally
		{
			setDeletingId(null);
		}
	};

	return (
		<div className="min-h-screen bg-[#111111] text-white">
			<header className="px-5 md:px-8 py-4 border-b border-[#222222] flex items-center justify-between sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md">
				<div className="flex items-center gap-3">
					<Link href="/admin/dashboard" className="flex items-center gap-1.5 text-[#555555] hover:text-white text-sm transition-colors group">
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-0.5 transition-transform" />
						Admin Panel
					</Link>
					<div className="w-px h-4 bg-[#2A2A2A]" />
					<span className="text-sm font-semibold">Users</span>
				</div>
				<Link href="/admin/users/create" className="flex items-center gap-1.5 bg-[#E8963A] hover:bg-[#D4842A] text-white text-xs font-bold rounded-xl px-4 py-2 transition-colors">
					<FontAwesomeIcon icon={faPlus} className="text-xs" />
					Add user
				</Link>
			</header>

			<main className="max-w-4xl mx-auto px-5 md:px-8 py-10 flex flex-col gap-6">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-bold">Users</h1>
					<span className="text-xs font-bold bg-[#E8963A]/10 text-[#E8963A] border border-[#E8963A]/20 rounded-full px-2 py-0.5">{users.length} total</span>
				</div>

				{error &&
				(
					<div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3">
						<p>{error}</p>
					</div>
				)}

				<div className="bg-[#1A1A1A] border border-[#222222] rounded-2xl overflow-hidden">
					{
						users.length === 0
						?
							<div className="py-14 flex flex-col items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-[#222222] border border-[#2A2A2A] flex items-center justify-center">
									<FontAwesomeIcon icon={faUsers} className="text-[#444444]" />
								</div>
								<p className="text-[#555555] text-sm">No users found.</p>
							</div>
						:
							<div className="flex flex-col divide-y divide-[#1E1E1E]">
								{users.map((user) =>
								(
									<div key={user.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#1F1F1F] transition-colors gap-4">
										<div className="flex items-center gap-3 min-w-0">
											<div className="w-8 h-8 rounded-xl bg-[#222222] border border-[#2A2A2A] flex items-center justify-center text-xs font-bold text-[#666666] shrink-0">
												{user.firstname[0]}{user.lastname[0]}
											</div>
											<div className="min-w-0">
												<div className="flex items-center gap-2 flex-wrap">
													<span className="text-sm font-semibold text-white">
														{user.firstname} {user.lastname}
													</span>
													{ user.id === currentAdminId && ( <span className="text-xs text-[#555555]">(you)</span> ) }
													{user.role === "ADMIN"
													?
														<span className="text-xs font-bold bg-[#E8963A]/10 text-[#E8963A] border border-[#E8963A]/20 rounded-full px-2 py-0.5 uppercase tracking-wide">Admin</span>
													:
														<span className="text-xs font-bold bg-[#222222] text-[#555555] border border-[#2A2A2A] rounded-full px-2 py-0.5 uppercase tracking-wide">User</span>
													}
												</div>
												<p className="text-xs text-[#555555] truncate mt-0.5">{user.email}</p>
											</div>
										</div>
										<div className="flex items-center gap-3 shrink-0">
											<span className="text-xs text-[#444444] hidden sm:block">{new Date(user.createdAt).toLocaleDateString()}</span>
											<div className="flex items-center gap-2">
												<Link href={`/admin/users/${user.id}`} className="text-xs text-[#888888] hover:text-white border border-[#2A2A2A] hover:border-[#444444] rounded-lg px-3 py-1.5 transition-colors" >Edit</Link>
												{user.id !== currentAdminId && ( <button onClick={() => handleDelete(user.id)} disabled={deletingId === user.id} className="text-xs text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20 hover:border-red-500 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40" >{deletingId === user.id ? "…" : "Delete"}</button> )}
											</div>
										</div>
									</div>
								))}
							</div>
					}
				</div>
			</main>
		</div>
	);
}
