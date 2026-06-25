"use client";
import { OrgsFrontend } from "@/lib/types";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faBuilding, faTag, faArrowRight, faBolt, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { faIdBadge } from "@fortawesome/free-solid-svg-icons";

export default function Organizations({ orgs }: { orgs: OrgsFrontend[] })
{
	return (
		<div className="min-h-screen bg-[#111111] text-white">
			<header className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#2A2A2A] px-5 md:px-8 py-4 flex items-center gap-4">
				<Link href="/dashboard" className="flex items-center gap-2 text-[#888888] hover:text-white text-[16px] font-medium transition-all group">
					<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-1 transition-transform"/>
					Dashboard
				</Link>
				<div className="w-px h-4 bg-[#2A2A2A]"/>
				<div className="flex items-center gap-2">
					<FontAwesomeIcon icon={faIdBadge} className="text-[#E8963A] text-base"/>
					<span className="text-white font-bold tracking-tight">Organizations</span>
				</div>
			</header>

			<main className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-12">
				<div className="flex items-center gap-4 mb-10">
					<div className="w-14 h-14 bg-[#E8963A]/10 border border-[#E8963A]/20 rounded-2xl flex items-center justify-center">
						<FontAwesomeIcon icon={faBuilding} className="text-[#E8963A] text-xl"/>
					</div>
					<div>
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Organizations</h1>
						<p className="text-[#666666] mt-1 flex items-center gap-2 text-[16px]">
							<FontAwesomeIcon icon={faBolt} className="text-xs text-[#E8963A]"/>
							{orgs.length} active organizations
						</p>
					</div>
				</div>

				<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-[16px]">
							<thead>
								<tr className="border-b border-[#2A2A2A] bg-[#111111]/60">
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-xs px-6 md:px-8 py-5">Organization Name</th>
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-xs px-6 md:px-8 py-5">Type</th>
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-xs px-6 md:px-8 py-5 hidden md:table-cell">Service</th>
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-xs px-6 md:px-8 py-5">Badges</th>
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-xs px-6 md:px-8 py-5 hidden sm:table-cell">Status</th>
									<th className="px-6 md:px-8 py-5"/>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#2A2A2A]">
								{orgs.map((org, index) => (
									<tr key={index} className="hover:bg-[#222222] transition-all group">
										<td className="px-6 md:px-8 py-4">
											<div className="flex items-center gap-3">
												<div className="w-9 h-9 bg-[#E8963A]/10 border border-[#E8963A]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
													<FontAwesomeIcon icon={faBuilding} className="text-[#E8963A] text-[16px]"/>
												</div>
												<span className="text-white font-bold">{org.name}</span>
											</div>
										</td>
										<td className="px-6 md:px-8 py-4">
											<span className="text-[#888888] font-medium bg-[#222222] px-3 py-1 rounded-lg border border-[#2A2A2A] text-xs">{org.type}</span>
										</td>
										<td className="px-6 md:px-8 py-4 hidden md:table-cell">
											<div className="flex items-center gap-2 text-[#aaaaaa]">
												<FontAwesomeIcon icon={faLayerGroup} className="text-[#666666] text-xs"/>
												{org.service}
											</div>
										</td>
										<td className="px-6 md:px-8 py-4">
											<div className="flex items-center gap-2">
												<FontAwesomeIcon icon={faTag} className="text-[#E8963A] text-xs"/>
												<span className="text-white font-black">{org.badgeTimes}</span>
											</div>
										</td>
										<td className="px-6 md:px-8 py-4 hidden sm:table-cell">
											<span className="inline-flex items-center gap-1.5 text-xs font-black bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 uppercase tracking-wider">
												<span className="w-1 h-1 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]"/>
												Active
											</span>
										</td>
										<td className="px-6 md:px-8 py-4 text-right">
											<Link href={`/organizations/${org.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8963A] hover:text-[#D4842A] transition-colors group/link">
												Details
												<FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover/link:translate-x-1 transition-transform"/>
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</main>
		</div>
	);
}
