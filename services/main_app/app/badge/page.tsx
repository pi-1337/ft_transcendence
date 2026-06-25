"use client";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faBolt, faCalendar, faListUl, faClock, faArrowRight, faArrowRightToBracket, faArrowRightFromBracket, } from "@fortawesome/free-solid-svg-icons";

const mock_badges =
[
	{
		number: "BADGE-001",
		userId: 1,
		orgId: 1,
		orgName: "Acme Corporation",
		createdAt: new Date("2024-01-15"),
		records: 12
	},
	{
		number: "BADGE-002",
		userId: 1,
		orgId: 2,
		orgName: "Tech Startup Inc",
		createdAt: new Date("2024-02-20"),
		records: 8
	}
];

const mock_records =
[
	{
		id: 1,
		badgeNumber: "BADGE-001",
		timestamp: new Date("2024-01-20 10:30:00"),
		action: "Entry"
	},
	{
		id: 2,
		badgeNumber: "BADGE-001",
		timestamp: new Date("2024-01-20 17:00:00"),
		action: "Exit"
	},
	{
		id: 3,
		badgeNumber: "BADGE-002",
		timestamp: new Date("2024-01-21 09:15:00"),
		action: "Entry"
	},
	{
		id: 4,
		badgeNumber: "BADGE-002",
		timestamp: new Date("2024-01-21 18:45:00"),
		action: "Exit"
	}
];

export default function BadgeDetails()
{
	const [selectedBadge, setSelectedBadge] = useState(mock_badges[0]);
	const badgeRecords = mock_records.filter(r => r.badgeNumber === selectedBadge.number);
	const badge_overview_items =
	[
		{ label: "Badge", value: selectedBadge.number, cls: "font-mono text-[#E8963A] text-[16px]" },
		{ label: "Organization", value: selectedBadge.orgName, cls: "text-[#CCCCCC] text-[16px] font-medium" },
		{ label: "Issued", value: selectedBadge.createdAt.toLocaleDateString(), cls: "text-[#CCCCCC] text-[16px]" },
		{ label: "Records", value: badgeRecords.length, cls: "text-white text-xl font-bold" },
	];

	return (
		<div className="min-h-screen bg-[#111111] text-white">
			<header className="px-5 md:px-8 py-4 border-b border-[#222222] flex items-center gap-3 sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md">
				<Link href="/dashboard" className="flex items-center gap-1.5 text-[#555555] hover:text-white text-[16px] transition-colors group">
					<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-0.5 transition-transform" />
					Dashboard
				</Link>
				<div className="w-px h-4 bg-[#2A2A2A]" />
				<span className="text-[16px] font-semibold">Badges</span>
			</header>
	
			<main className="max-w-4xl mx-auto px-5 md:px-8 py-10 flex flex-col gap-7">
				<div>
					<h1 className="text-xl font-bold">Your badges</h1>
					<p className="text-[#555555] text-[16px] mt-1">Select a badge to view its access records</p>
				</div>
	
				<div className="border border-[#222222] rounded-2xl overflow-hidden">
					{mock_badges.map((badge, idx) =>
					(
						<button key={badge.number} onClick={() => setSelectedBadge(badge)} className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors gap-4 ${idx > 0 ? "border-t border-[#222222]" : ""} ${selectedBadge.number === badge.number ? "bg-[#1F1F1F] border-l-2 border-l-[#E8963A]" : "bg-[#1A1A1A] border-l-2 border-l-transparent hover:bg-[#1F1F1F]"}`}>
							<div className="flex items-center gap-4 min-w-0">
								<span className={`font-mono text-[16px] shrink-0 ${selectedBadge.number === badge.number ? "text-[#E8963A]" : "text-[#555555]"}`}>{badge.number}</span>
								<span className="text-[16px] font-semibold text-[#CCCCCC] truncate">{badge.orgName}</span>
							</div>
							<div className="flex items-center gap-4 shrink-0">
								<span className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#444444]">
									<FontAwesomeIcon icon={faBolt} className="text-xs" />
									{badge.records} records
								</span>
								<span className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#444444]">
									<FontAwesomeIcon icon={faCalendar} className="text-xs" />
									{badge.createdAt.toLocaleDateString()}
								</span>
								<FontAwesomeIcon icon={faChevronRight} className={`text-xs ${selectedBadge.number === badge.number ? "text-[#E8963A]" : "text-[#333333]"}`} />
							</div>
						</button>
					))}
				</div>
				
				<div className="grid lg:grid-cols-[200px_1fr] gap-4">
					<div className="bg-[#1A1A1A] border border-[#222222] rounded-2xl p-5 flex flex-col gap-0">
						{badge_overview_items.map((item, index, arr) => (
							<div key={item.label} className={`py-3 ${index < arr.length - 1 ? "border-b border-[#1F1F1F]" : ""} ${index === 0 ? "pt-0" : ""} ${index === arr.length - 1 ? "pb-0" : ""}`}>
								<p className="text-xs text-[#444444] uppercase tracking-widest font-bold mb-1">{item.label}</p>
								<p className={item.cls}>{item.value}</p>
							</div>
						))}
					</div>
					
					<div className="bg-[#1A1A1A] border border-[#222222] rounded-2xl overflow-hidden">
						<div className="px-5 py-3.5 border-b border-[#222222] flex items-center gap-2">
							<FontAwesomeIcon icon={faListUl} className="text-[16px] text-[#E8963A]" />
							<span className="text-[16px] font-semibold">Access records</span>
							<span className="text-xs font-bold bg-[#E8963A]/10 text-[#E8963A] border border-[#E8963A]/20 rounded-full px-2 py-0.5 ml-1">
								{badgeRecords.length} entries
							</span>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-[#222222]">
										<th className="text-left text-xs text-[#444444] font-bold uppercase tracking-widest px-5 py-3">Timestamp</th>
										<th className="text-left text-xs text-[#444444] font-bold uppercase tracking-widest px-5 py-3">Action</th>
										<th className="px-5 py-3" />
									</tr>
								</thead>
								<tbody>
									{badgeRecords.map((record, idx) =>
									(
										<tr key={record.id} className={`hover:bg-white/1.5 transition-colors ${idx < badgeRecords.length - 1 ? "border-b border-[#1E1E1E]" : ""}`}>
											<td className="px-5 py-3">
												<div className="flex items-center gap-2 text-[#666666] text-xs">
													<FontAwesomeIcon icon={faClock} className="text-[#333333] text-xs" />
													{record.timestamp.toLocaleString()}
												</div>
											</td>
											<td className="px-5 py-3">
												<span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${record.action === "Entry"? "bg-green-500/6 text-green-400 border-green-500/20": "bg-orange-500/6 text-orange-400 border-orange-500/20"}`}>
													<FontAwesomeIcon icon={record.action === "Entry" ? faArrowRightToBracket : faArrowRightFromBracket} className="text-[9px]" />
													{record.action}
												</span>
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
					</div>
				</div>
			</main>
		</div>
	);
}
