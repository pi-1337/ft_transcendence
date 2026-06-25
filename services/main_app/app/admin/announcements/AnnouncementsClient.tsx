"use client"
import { useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faBullhorn } from "@fortawesome/free-solid-svg-icons";

interface Organization
{
	id: number;
	name: string;
};

interface Announcement
{
	id: number;
	title: string;
	message: string;
	createdAt: Date;
	updatedAt: Date | null;
	organization:
	{
		id: number;
		name: string;
	};
	createdBy:
	{
		id: number;
		firstname: string;
		lastname: string;
		email: string;
	};
};

interface Props
{
	organizations: Organization[];
	announcements: Announcement[];
};

interface FormState
{
	organizationId: string;
	title: string;
	message: string;
};

const defaultFormState: FormState =
{
	organizationId: "",
	title: "",
	message: "",
};

export default function AnnouncementsClient({ organizations, announcements: initialAnnouncements }: Props)
{
	const [announcements, setAnnouncements] = useState(initialAnnouncements);
	const [form, setForm] = useState<FormState>(defaultFormState);
	const [editing_id, setEditingId] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [deleting_id, setDeletingId] = useState<number | null>(null);
	const [info, setInfo] = useState("");
	const [error, setError] = useState("");
	const submit_label = useMemo(() => (editing_id === null ? "Send announcement" : "Save changes"), [editing_id]);

	function resetForm()
	{
		setForm(defaultFormState);
		setEditingId(null);
	};

	function startEdit(announcement: Announcement)
	{
		setEditingId(announcement.id);
		setForm
		({
			organizationId: String(announcement.organization.id),
			title: announcement.title,
			message: announcement.message,
		});
		setInfo("");
		setError("");
	};

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>)
	{
		e.preventDefault();
		setLoading(true);
		setInfo("");
		setError("");

		try 
		{
			const endpoint = editing_id === null ? "/api/admin/announcements" : `/api/admin/announcements/${editing_id}`;
			const method = editing_id === null ? "POST" : "PATCH";
			const body = editing_id === null ? form : { title: form.title, message: form.message };

			const res = await fetch(endpoint,
			{
				method,
				headers: { "Content-Type": "application/json", },
				body: JSON.stringify(body),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setError(data.error || "Failed to save announcement.");
				return ;
			}
			if (editing_id === null)
			{
				setAnnouncements((prev) => [data.announcement, ...prev]);
				setInfo(`Announcement sent to ${data.sentToUsers ?? 0} users.`);
			}
			else
			{
				setAnnouncements((prev) => prev.map((item) => item.id === editing_id ? data.announcement : item));
				setInfo("Announcement updated successfully.");
			}
			resetForm();
		}
		catch
		{
			setError("Network error. Please try again.");
		}
		finally
		{
			setLoading(false);
		}
	};

	async function handleDelete(id: number)
	{
		if (!confirm("Delete this announcement? Existing notifications already sent to users will remain."))
			return ;

		setDeletingId(id);
		setInfo("");
		setError("");
		try
		{
			const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE", });
			const data = await res.json();
			if (!res.ok)
			{
				setError(data.error || "Failed to delete announcement.");
				return ;
			}
			setAnnouncements((prev) => prev.filter((item) => item.id !== id));
			setInfo("Announcement deleted.");
			if (editing_id === id)
				resetForm();
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
			<header className="px-5 md:px-8 py-4 border-b border-[#222222] flex items-center gap-3 sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md">
				<Link href="/admin/dashboard" className="flex items-center gap-1.5 text-[#555555] hover:text-white text-[16px] transition-colors group">
					<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-0.5 transition-transform" />
					Admin Panel
				</Link>
				<div className="w-px h-4 bg-[#2A2A2A]" />
				<span className="text-[16px] font-semibold">Announcements</span>
			</header>
		
			<main className="max-w-4xl mx-auto px-5 md:px-8 py-10 flex flex-col gap-6">
				<div className="bg-[#1A1A1A] border border-[#222222] rounded-2xl overflow-hidden">
					<div className="px-5 py-4 border-b border-[#222222]">
						<h1 className="text-[16px] font-semibold">{deleting_id === null ? "New announcement" : "Edit announcement"}</h1>
					</div>
		
					<div className="p-5">
						{error && 
						(
							<div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[16px] px-4 py-3">
								{error}
							</div>
						)}
						{info &&
						(
							<div className="mb-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[16px] px-4 py-3">
								{info}
							</div>
						)}
	
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="flex flex-col gap-1.5 flex-1">
									<label className="text-xs text-[#555555] font-bold uppercase tracking-widest">Organization</label>
									<select value={form.organizationId} onChange={(e) => setForm((prev) => ({ ...prev, organizationId: e.target.value }))} disabled={deleting_id !== null} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors disabled:opacity-50" required>
										<option value="">Select organization</option>
										{organizations.map((org) => 
										(
											<option key={org.id} value={org.id}>{org.name}</option>
										))}
									</select>
								</div>
								<div className="flex flex-col gap-1.5 flex-1">
									<label className="text-xs text-[#555555] font-bold uppercase tracking-widest">Title</label>
									<input type="text" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Maintenance update" className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#444444]" required/>
								</div>
							</div>
									
							<div className="flex flex-col gap-1.5">
								<label className="text-xs text-[#555555] font-bold uppercase tracking-widest">Message</label>
								<textarea value={form.message} onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} placeholder="Badge system will be unavailable from 15:00 to 15:30." rows={4} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#444444] resize-none" required/>
							</div>
									
							<div className="flex items-center gap-3">
								<button type="submit" disabled={loading} className="bg-[#E8963A] hover:bg-[#D4842A] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[16px] font-bold rounded-xl px-5 py-2.5 transition-colors">{loading ? "Saving…" : submit_label}</button>
								{deleting_id !== null && ( <button type="button" onClick={resetForm} className="text-[16px] text-[#888888] hover:text-white border border-[#2A2A2A] hover:border-[#444444] rounded-xl px-5 py-2.5 transition-colors">Cancel</button> )}
							</div>
						</form>
					</div>
				</div>
							
				<div className="bg-[#1A1A1A] border border-[#222222] rounded-2xl overflow-hidden">
					<div className="px-5 py-4 border-b border-[#222222] flex items-center justify-between">
						<h2 className="text-[16px] font-semibold">History</h2>
						<span className="text-xs font-bold bg-[#E8963A]/10 text-[#E8963A] border border-[#E8963A]/20 rounded-full px-2 py-0.5">{announcements.length} entries</span>
					</div>
							
					{announcements.length === 0 ?
					(
						<div className="py-14 flex flex-col items-center gap-3 text-center">
							<div className="w-10 h-10 rounded-xl bg-[#222222] border border-[#2A2A2A] flex items-center justify-center">
								<FontAwesomeIcon icon={faBullhorn} className="text-[#444444]" />
							</div>
							<p className="text-[#555555] text-[16px]">No announcements yet.</p>
						</div>
					) :
					(
						<div className="flex flex-col divide-y divide-[#1E1E1E]">
							{announcements.map((item) =>
							(
								<div key={item.id} className="px-5 py-4 hover:bg-[#1F1F1F] transition-colors">
									<div className="flex items-start justify-between gap-4">
										<div className="flex flex-col gap-1 min-w-0">
											<div className="flex items-center gap-2 flex-wrap">
												<span className="text-[16px] font-semibold text-white">{item.title}</span>
												<span className="text-xs text-[#555555] bg-[#222222] border border-[#2A2A2A] rounded-full px-2 py-0.5 font-medium shrink-0">{item.organization.name}</span>
											</div>
											<p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">{item.message}</p>
											<p className="text-[11px] text-[#444444] mt-1">{item.createdBy.firstname} {item.createdBy.lastname} · {new Date(item.createdAt).toLocaleDateString()}</p>
										</div>
										<div className="flex items-center gap-2 shrink-0">
									    	<button onClick={() => startEdit(item)} className="text-xs text-[#888888] hover:text-white border border-[#2A2A2A] hover:border-[#444444] rounded-lg px-3 py-1.5 transition-colors">Edit</button>
									    	{editing_id === item.id &&
											(
									    	    <button onClick={resetForm} className="text-xs text-[#888888] hover:text-white border border-[#2A2A2A] hover:border-[#444444] rounded-lg px-3 py-1.5 transition-colors">Cancel</button>
									    	)}
									    	<button onClick={() => handleDelete(item.id)} disabled={deleting_id === item.id} className="text-xs text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20 hover:border-red-500 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40">{deleting_id === item.id ? "…" : "Delete"}</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
