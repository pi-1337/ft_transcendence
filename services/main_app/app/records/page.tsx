"use client";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faTag, faBuilding, faClock, faArrowRight, faArrowRightToBracket, faArrowRightFromBracket, faClipboardList, } from "@fortawesome/free-solid-svg-icons";

const mockRecords =
[
	{
		id: 1,
		badgeNumber: "BADGE-001",
		orgName: "Acme Corporation",
		action: "Entry",
		timestamp: new Date("2024-01-20 10:30:00")
	},
	{
		id: 2,
		badgeNumber: "BADGE-001",
		orgName: "Acme Corporation",
		action: "Exit",
		timestamp: new Date("2024-01-20 17:00:00")
	},
	{
		id: 3,
		badgeNumber: "BADGE-001",
		orgName: "Acme Corporation",
		action: "Entry",
		timestamp: new Date("2024-01-21 09:15:00")
	},
	{
		id: 4,
		badgeNumber: "BADGE-001",
		orgName: "Acme Corporation",
		action: "Exit",
		timestamp: new Date("2024-01-21 18:45:00")
	},
	{
		id: 5,
		badgeNumber: "BADGE-002",
		orgName: "Tech Startup Inc",
		action: "Entry",
		timestamp: new Date("2024-01-22 08:00:00")
	},
	{
		id: 6,
		badgeNumber: "BADGE-002",
		orgName: "Tech Startup Inc",
		action: "Exit",
		timestamp: new Date("2024-01-22 17:30:00")
	},
	{
		id: 7,
		badgeNumber: "BADGE-001",
		orgName: "Acme Corporation",
		action: "Entry",
		timestamp: new Date("2024-01-22 09:00:00")
	},
	{
		id: 8,
		badgeNumber: "BADGE-001",
		orgName: "Acme Corporation",
		action: "Exit",
		timestamp: new Date("2024-01-22 18:00:00")
	}
];

export default function Records() 
{
	const [records] = useState(mockRecords);
	const [filterBadge, setFilterBadge] = useState("");
	const filteredRecords = filterBadge ? records.filter(r => r.badgeNumber === filterBadge) : records;
	const uniqueBadges = Array.from(new Set(records.map(r => r.badgeNumber)));

	return (
		<div className="min-h-screen bg-[#111111] text-white">
			<header className="px-5 md:px-8 py-4 border-b border-[#222222] flex items-center gap-3 sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md">
				<Link href="/dashboard" className="flex items-center gap-1.5 text-[#555555] hover:text-white text-[16px] transition-colors group">
					<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-0.5 transition-transform" />
					Dashboard
				</Link>
				<div className="w-px h-4 bg-[#2A2A2A]" />
				<span className="text-[16px] font-semibold">Records</span>
			</header>

			<main className="max-w-5xl mx-auto px-5 md:px-8 py-10 flex flex-col gap-7">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-xl font-bold">Your records</h1>
						<p className="text-[#555555] text-[16px] mt-1">
							<FontAwesomeIcon icon={faTag} className="mr-1.5 text-xs" />
							{filteredRecords.length} entries found
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-1.5 bg-[#1A1A1A] border border-[#222222] rounded-xl p-1">
						<button onClick={() => setFilterBadge("")} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${filterBadge === "" ? "bg-[#E8963A] text-white" : "text-[#555555] hover:text-white hover:bg-[#222222]"}`}>All</button>
						{uniqueBadges.map(badge =>
						(
							<button key={badge} onClick={() => setFilterBadge(badge)} className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-colors ${filterBadge === badge? "bg-[#E8963A] text-white": "text-[#555555] hover:text-white hover:bg-[#222222]"}`}>{badge}</button>
						))}
					</div>
				</div>

				<div className="bg-[#1A1A1A] border border-[#222222] rounded-2xl overflow-hidden">
					{filteredRecords.length > 0 ?
					(
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-[#222222]">
										<th className="text-left text-xs text-[#444444] font-bold uppercase tracking-widest px-5 py-3">Badge ID</th>
										<th className="text-left text-xs text-[#444444] font-bold uppercase tracking-widest px-5 py-3">Organization</th>
										<th className="text-left text-xs text-[#444444] font-bold uppercase tracking-widest px-5 py-3">Action</th>
										<th className="text-left text-xs text-[#444444] font-bold uppercase tracking-widest px-5 py-3">Timestamp</th>
										<th className="px-5 py-3" />
									</tr>
								</thead>
								<tbody>
									{filteredRecords.map((record, index) =>
									(
										<tr key={index} className={`hover:bg-white/1.5 transition-colors ${index < filteredRecords.length - 1 ? "border-b border-[#1E1E1E]" : ""}`}>
											<td className="px-5 py-3">
												<div className="flex items-center gap-2.5">
													<div className="w-7 h-7 rounded-lg bg-[#E8963A]/10 border border-[#E8963A]/20 flex items-center justify-center shrink-0">
														<FontAwesomeIcon icon={faTag} className="text-[#E8963A] text-xs" />
													</div>
													<span className="font-mono text-[16px] text-white font-bold">{record.badgeNumber}</span>
												</div>
											</td>
											<td className="px-5 py-3">
												<div className="flex items-center gap-2 text-[#AAAAAA] text-[16px]">
													<FontAwesomeIcon icon={faBuilding} className="text-[#444444] text-xs" />
													{record.orgName}
												</div>
											</td>
											<td className="px-5 py-3">
												<span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${record.action === "Entry" ? "bg-green-500/6 text-green-400 border-green-500/20" : "bg-orange-500/6 text-orange-400 border-orange-500/20"}`}>
													<FontAwesomeIcon icon={record.action === "Entry" ? faArrowRightToBracket : faArrowRightFromBracket} className="text-[9px]" />
													{record.action}
												</span>
											</td>
											<td className="px-5 py-3">
												<div className="flex items-center gap-2 text-[#666666] text-xs">
													<FontAwesomeIcon icon={faClock} className="text-[#333333] text-xs" />
													{record.timestamp.toLocaleString()}
												</div>
											</td>
											<td className="px-5 py-3 text-right">
												<Link href={`/records/${record.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E8963A] hover:text-[#F4A94A] transition-colors group/link">
													Details
													<FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover/link:translate-x-0.5 transition-transform" />
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : 
					(
						<div className="py-16 flex flex-col items-center gap-3 text-center">
							<div className="w-12 h-12 rounded-xl bg-[#222222] border border-[#2A2A2A] flex items-center justify-center">
								<FontAwesomeIcon icon={faClipboardList} className="text-[#444444] text-lg" />
							</div>
							<div>
								<p className="text-white font-semibold text-[16px]">No records found</p>
								<p className="text-[#555555] text-xs mt-1">Try adjusting your filters to see more entries.</p>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
