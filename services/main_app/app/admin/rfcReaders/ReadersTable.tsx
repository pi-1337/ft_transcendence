"use client";
import { useState } from "react";
import Link from "next/link";
import { faChevronLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Reader
{
	id: number;
	location: string;
	organizationId: number;
	organization: { name: string };
};

interface Props
{
	readers: Reader[];
};

export default function ReadersTable({ readers: initialReaders }: Props)
{
	const [readers, setReaders] = useState(initialReaders);
	const [deleting_id, setDeletingId] = useState<number | null>(null);
	const [error, setError] = useState("");

	async function handleDelete(id: number)
	{
		if (!confirm("Are you sure you want to delete this reader?"))
			return ;

		setDeletingId(id);
		setError("");
		try
		{
			const res = await fetch(`/api/admin/rfcReaders/${id}`, { method: "DELETE" });
			const data = await res.json();
			if (!res.ok)
			{
				setError(data.error || "Failed to delete reader.");
				return ;
			}
			setReaders((prev) => prev.filter((r) => r.id !== id));
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
			<header className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#2A2A2A] px-5 md:px-8 py-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Link href="/admin/dashboard" className="flex items-center gap-2 text-[#888888] hover:text-white text-sm font-medium transition-all group">
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-1 transition-transform"/>
						<span className="hidden sm:inline">Admin Panel</span>
					</Link>
					<div className="w-px h-4 bg-[#2A2A2A]"/>
					<span className="text-white font-semibold text-sm">RFC Readers</span>
				</div>
				<Link href="/admin/rfcReaders/create" className="flex items-center gap-2 bg-[#E8963A] hover:bg-[#D4842A] text-white text-sm font-bold rounded-xl px-4 py-2 transition-colors">
					<FontAwesomeIcon icon={faPlus} className="text-xs"/>
					Add reader
				</Link>
			</header>

			<main className="max-w-5xl mx-auto px-5 md:px-8 py-10">
				<p className="text-[#666666] text-sm mb-6">{readers.length} readers total</p>
				{error && ( <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3">{error}</div> )}

				<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-[#2A2A2A] bg-[#111111]/60">
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-[10px] px-5 py-4">ID</th>
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-[10px] px-5 py-4">Location</th>
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-[10px] px-5 py-4 hidden sm:table-cell">Organization</th>
									<th className="px-5 py-4"/>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#2A2A2A]">
								{readers.length === 0
								?
									<tr>
										<td colSpan={4} className="px-5 py-12 text-center text-[#555555]">No readers found.</td>
									</tr>
								:
									readers.map((reader) =>
									(
										<tr key={reader.id} className="hover:bg-[#222222] transition-all">
											<td className="px-5 py-3.5 text-[#666666] font-mono text-xs">{reader.id}</td>
											<td className="px-5 py-3.5 text-white font-medium">{reader.location}</td>
											<td className="px-5 py-3.5 text-[#888888] hidden sm:table-cell">{reader.organization.name}</td>
											<td className="px-5 py-3.5">
												<div className="flex items-center justify-end gap-2">
													<Link href={`/admin/rfcReaders/${reader.id}`} className="text-xs font-bold text-[#E8963A] hover:text-[#D4842A] transition-colors">Edit</Link>
													<button onClick={() => handleDelete(reader.id)} disabled={deleting_id === reader.id} className="text-xs font-bold text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20 hover:border-red-500 rounded-lg px-3 py-1 transition-all disabled:opacity-40 cursor-pointer">{deleting_id === reader.id ? "…" : "Delete"}</button>
												</div>
											</td>
										</tr>
									))
								}
							</tbody>
						</table>
					</div>
				</div>
			</main>
		</div>
	);
}
