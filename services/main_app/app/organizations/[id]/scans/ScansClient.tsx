"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RequestPopup from "./RequestPopup";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faCircleCheck, faCircleXmark, faClock, faHashtag, faUtensils, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

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
	recent_scans: Scan[];
	accepted_scan_count: number;
	org_name: string;
	org_dd: number;
	pending_scan: Scan | null;
	active_meal: { name: string; startTime: Date; endTime: Date } | null;
};

export default function ScansClient({ recent_scans, accepted_scan_count, org_name, org_dd, pending_scan, active_meal }: Props)
{
	const router = useRouter();
	
	useEffect(() =>
	{
		const interval = setInterval(() => { router.refresh(); }, 1000);
		return () => clearInterval(interval);
	}, [router]);

	function status_config(status: string)
	{
		if (status === "ACCEPTED")
			return { icon: faCircleCheck, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" };
		if (status === "REJECTED")
			return { icon: faCircleXmark, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
		return { icon: faClock, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
	};

	return (
		<div className="min-h-screen bg-[#111111] text-white">
			{pending_scan && <RequestPopup scanData={pending_scan}/>}

			<header className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#2A2A2A] px-5 md:px-8 py-4 flex items-center justify-between">
				<Link href={`/organizations/${org_dd}`} className="flex items-center gap-2 text-[#888888] hover:text-white text-[16px] font-medium transition-all group">
					<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-1 transition-transform"/>
					Back
				</Link>
				{active_meal
				?
					<div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2">
						<FontAwesomeIcon icon={faUtensils} className="text-green-400 text-xs"/>
						<div className="text-right">
							<p className="text-green-400 font-semibold text-[16px] leading-none">{active_meal.name}</p>
							<p className="text-[#888888] text-xs font-mono mt-0.5">
								{new Date(active_meal.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
								{" - "}
								{new Date(active_meal.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
							</p>
						</div>
					</div>
				:
					<div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
						<FontAwesomeIcon icon={faTriangleExclamation} className="text-red-400 text-xs"/>
						<span className="text-red-400 text-[16px] font-medium">No active meal</span>
					</div>
				}
			</header>

			<main className="max-w-3xl mx-auto px-5 md:px-8 py-10 md:py-12">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-2xl md:text-3xl font-bold tracking-tight">{org_name}</h1>
					<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-2 text-[16px]">
						<span className="text-[#E8963A] font-black">{accepted_scan_count}</span>
						<span className="text-[#666666] ml-1">accepted</span>
					</div>
				</div>

				{recent_scans.length === 0
				?
					<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-12 text-center">
						<FontAwesomeIcon icon={faClock} className="text-[#444444] text-3xl mb-3"/>
						<p className="text-[#666666] text-[16px]">No badge scans recorded yet.</p>
					</div>
				:
					<div className="flex flex-col gap-3">
						{recent_scans.map((scan) =>
						{
							const s = status_config(scan.status);
							return (
								<div key={scan.id} className="flex items-center justify-between bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E8963A]/20 rounded-2xl px-5 md:px-6 py-4 transition-all">
									<div className="flex flex-col gap-1">
										<span className="text-white font-semibold">{scan.badge.user.firstname} {scan.badge.user.lastname}</span>
										<span className="text-[#666666] text-xs font-bold uppercase tracking-widest">{scan.badge.user.role}</span>
									</div>
									<div className="flex flex-col items-end gap-1.5">
										<span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${s.bg} ${s.color} ${s.border}`}>
											<FontAwesomeIcon icon={s.icon} className="text-xs"/>
											{scan.status}
										</span>
										<span className="text-[#555555] text-xs font-mono">{new Date(scan.createdAt).toISOString().replace("T", " ").slice(0, 19)}</span>
										<span className="text-[#444444] text-xs flex items-center gap-1">
											<FontAwesomeIcon icon={faHashtag} className="text-xs"/>
											{scan.id}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				}
			</main>
		</div>
	);
}
