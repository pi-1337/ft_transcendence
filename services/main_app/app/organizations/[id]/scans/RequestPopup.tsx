"use client"
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdBadge, faCheck, faXmark, faHashtag } from "@fortawesome/free-solid-svg-icons";

interface Scan 
{
	id: number;
	createdAt: Date;
	status: string;
	badge:
	{
		user:
		{
			firstname: string;
			lastname: string;
			role: string;
		}
	}
};

interface Props
{ 
	scanData: Scan;
};

export default function RequestPopup({ scanData }: Props)
{
	const router = useRouter();

	async function handleDecision(decision: "ACCEPTED" | "REJECTED")
	{
		const res = await fetch("/api/scans/decide",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ requestId: scanData.id, decision }),
		});
		const data = await res.json();
		if (!res.ok)
		{
			console.error(data.error);
			return ;
		}
		router.refresh();
	};

	return (
		<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
			<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 w-full max-w-sm shadow-2xl">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 bg-[#E8963A]/10 border border-[#E8963A]/20 rounded-xl flex items-center justify-center">
						<FontAwesomeIcon icon={faIdBadge} className="text-[#E8963A] text-base"/>
					</div>
					<div>
						<h2 className="text-white font-bold text-base leading-none">Badge Request</h2>
						<p className="text-[#666666] text-xs flex items-center gap-1 mt-1">
							<FontAwesomeIcon icon={faHashtag} className="text-xs"/>
							{scanData.id}
						</p>
					</div>
				</div>

				<div className="bg-[#111111] border border-[#2A2A2A] rounded-xl px-4 py-3 mb-6">
					<p className="text-white font-semibold">{scanData.badge.user.firstname} {scanData.badge.user.lastname}</p>
					<p className="text-[#666666] text-xs font-bold uppercase tracking-widest mt-0.5">{scanData.badge.user.role}</p>
				</div>

				<div className="flex gap-3">
					<button onClick={() => handleDecision("ACCEPTED")} className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500 border border-green-500/20 hover:border-green-500 text-green-400 hover:text-white text-[16px] font-bold rounded-xl py-3 transition-all cursor-pointer">
						<FontAwesomeIcon icon={faCheck} className="text-xs"/>
						Accept
					</button>
					<button onClick={() => handleDecision("REJECTED")} className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white text-[16px] font-bold rounded-xl py-3 transition-all cursor-pointer">
						<FontAwesomeIcon icon={faXmark} className="text-xs"/>
						Decline
					</button>
				</div>
			</div>
		</div>
	);
}
