"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FieldErrors
{
	name?: string;
	type?: string;
	service?: string;
	badgeTimes?: string;
	callBackURL?: string;
};

export default function CreateOrgForm()
{
	const router = useRouter();
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [service, setService] = useState("");
	const [badge_times, setBadgeTimes] = useState("");
	const [active, setActive] = useState<"TRUE" | "FALSE">("FALSE");
	const [call_back_URL, setCallBackURL] = useState("");
	const [errors, setErrors] = useState<FieldErrors>({});
	const [server_error, setServerError] = useState("");
	const [loading, setLoading] = useState(false);

	function validate(): FieldErrors
	{
		const e: FieldErrors = {};
		if (!name.trim())
			e.name = "Name is required.";
		if (!type.trim())
			e.type = "Type is required.";
		if (!service.trim())
			e.service = "Service is required.";
		if (!badge_times)
			e.badgeTimes = "Badge times is required.";
		else 
		{
			const bt = parseInt(badge_times);
			if (isNaN(bt) || bt < 1)
				e.badgeTimes = "Must be a positive integer.";
		}
		if (call_back_URL && !/^https?:\/\/.+/.test(call_back_URL))
			e.callBackURL = "Must be a valid URL starting with http(s)://.";
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
			const res = await fetch("/api/admin/orgs/create",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify
				({
					name,
					type,
					service,
					badgeTimes: parseInt(badge_times),
					active,
					callBackURL: call_back_URL || null,
				}),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setServerError(data.error || "Something went wrong.");
				return ;
			}
			router.push("/admin/orgs");
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
				<Link href="/admin/orgs" className="flex items-center gap-2 text-[#888888] hover:text-white text-[16px] font-medium transition-all group">
					<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-1 transition-transform"/>
					Organizations
				</Link>
				<div className="w-px h-4 bg-[#2A2A2A]"/>
				<span className="text-white font-semibold text-[16px]">Create org</span>
			</header>

			<main className="max-w-lg mx-auto px-5 md:px-8 py-10 md:py-12">
				<h1 className="text-xl font-bold mb-8">Create new organization</h1>
				{server_error && ( <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[16px] px-4 py-3">{server_error}</div> )}

				<form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col gap-4" noValidate>
					<div className="flex flex-col gap-1.5">
						<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Name</label>
						<input type="text" placeholder="Acme Corp" value={name} onChange={e => setName(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
						{errors.name && <span className="text-red-400 text-xs">{errors.name}</span>}
					</div>

					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1.5 flex-1">
							<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Type</label>
							<input type="text" placeholder="e.g. NGO" value={type} onChange={e => setType(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
							{errors.type && <span className="text-red-400 text-xs">{errors.type}</span>}
						</div>
						<div className="flex flex-col gap-1.5 flex-1">
							<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Service</label>
							<input type="text" placeholder="e.g. Healthcare" value={service} onChange={e => setService(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
							{errors.service && <span className="text-red-400 text-xs">{errors.service}</span>}
						</div>
					</div>

					<div className="flex gap-3">
						<div className="flex flex-col gap-1.5 w-36">
							<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Badge times</label>
							<input type="number" min={1} placeholder="1" value={badge_times} onChange={e => setBadgeTimes(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
							{errors.badgeTimes && <span className="text-red-400 text-xs">{errors.badgeTimes}</span>}
						</div>
						<div className="flex flex-col gap-1.5 flex-1">
							<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Status</label>
							<select value={active} onChange={e => setActive(e.target.value as "TRUE" | "FALSE")} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors">
								<option value="FALSE">Inactive</option>
								<option value="TRUE">Active</option>
							</select>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Callback URL <span className="text-[#444444] normal-case font-normal">(optional)</span></label>
						<input type="url" placeholder="https://..." value={call_back_URL} onChange={e => setCallBackURL(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
						{errors.callBackURL && <span className="text-red-400 text-xs">{errors.callBackURL}</span>}
					</div>

					<div className="flex gap-3 mt-2">
						<Link href="/admin/orgs" className="flex-1 text-center my-auto border border-[#2A2A2A] hover:border-[#444444] text-[#888888] hover:text-white rounded-xl py-3 text-[16px] font-semibold transition-all">Cancel</Link>
						<button type="submit" disabled={loading} className="flex-1 bg-[#E8963A] hover:bg-[#D4842A] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl py-3 text-[16px] font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer">{ loading ? "Creating…" : "Create organization" }</button>
					</div>
				</form>
			</main>
		</div>
	);
}
