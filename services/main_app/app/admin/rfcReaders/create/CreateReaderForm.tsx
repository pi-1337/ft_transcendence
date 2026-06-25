"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faMicrochip } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";

interface Org
{
	id: number;
	name: string;
};

interface Props
{
	organizations: Org[];
};

export default function CreateReaderForm({ organizations }: Props)
{
	const router = useRouter();
	const [location, setLocation] = useState("");
	const [organization_id, setorganizationId] = useState<number | "">(organizations[0]?.id ?? "");
	const [server_error, setServerError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent)
	{
		e.preventDefault();
		if (!location.trim() || organization_id === "")
			return (toast.error("Please enter location & organization_id"));

		setLoading(true);
		setServerError("");
		try
		{
			const res = await fetch("/api/admin/rfcReaders/create",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ location, organization_id }),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setServerError(data.error || "Something went wrong.");
				return ;
			}
			router.push("/admin/rfcReaders");
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
			<header className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#2A2A2A] px-5 md:px-8 py-4 flex items-center gap-3">
				<Link href="/admin/rfcReaders" className="flex items-center gap-2 text-[#888888] hover:text-white text-[16px] font-medium transition-all group">
					<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-1 transition-transform"/>
					RFC Readers
				</Link>
				<div className="w-px h-4 bg-[#2A2A2A]"/>
				<span className="text-white font-semibold text-[16px]">Add reader</span>
			</header>

			<main className="max-w-md mx-auto px-5 md:px-8 py-10 md:py-12">
				<div className="flex items-center gap-3 mb-8">
					<div className="w-10 h-10 bg-[#E8963A]/10 border border-[#E8963A]/20 rounded-xl flex items-center justify-center">
						<FontAwesomeIcon icon={faMicrochip} className="text-[#E8963A] text-[16px]"/>
					</div>
					<h1 className="text-xl font-bold">New RFC reader</h1>
				</div>

				{server_error && ( <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[16px] px-4 py-3">{server_error}</div> )}

				<form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
					<div className="flex flex-col gap-1.5">
						<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Location</label>
						<input type="text" placeholder="e.g. Main entrance" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Organization</label>
						<select value={organization_id} onChange={(e) => setorganizationId(Number(e.target.value))} className="bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors">
							{organizations.map((org) =>
							(
								<option key={org.id} value={org.id}>{org.name}</option>
							))}
						</select>
					</div>

					<div className="flex gap-3 mt-2">
						<Link href="/admin/rfcReaders" className="flex-1 text-center border border-[#2A2A2A] hover:border-[#444444] text-[#888888] hover:text-white rounded-xl py-3 text-[16px] font-semibold transition-all">Cancel</Link>
						<button type="submit" disabled={loading} className="flex-1 bg-[#E8963A] hover:bg-[#D4842A] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl py-3 text-[16px] font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer">{ loading ? "Creating…" : "Create reader" }</button>
					</div>
				</form>
			</main>
			<ToastContainer theme="dark"/>
		</div>
	);
}
