"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faPlus } from "@fortawesome/free-solid-svg-icons";

interface Org
{
	id: number;
	name: string;
	type: string;
	service: string;
	active: "TRUE" | "FALSE";
	admins: { id: number; firstname: string; lastname: string }[];
	_count: { users: number };
	createdAt: Date;
};

interface Props
{
	orgs: Org[];
};

export default function OrgsTable({ orgs: initialOrgs }: Props)
{
	const [orgs] = useState(initialOrgs);

	return (
		<div className="min-h-screen bg-[#111111] text-white">
			<header className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#2A2A2A] px-5 md:px-8 py-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Link href="/admin/dashboard" className="flex items-center gap-2 text-[#888888] hover:text-white text-sm font-medium transition-all group">
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-1 transition-transform"/>
						<span className="hidden sm:inline">Admin Panel</span>
					</Link>
					<div className="w-px h-4 bg-[#2A2A2A]"/>
					<span className="text-white font-semibold text-sm">Organizations</span>
				</div>
				<Link href="/admin/orgs/create" className="flex items-center gap-2 bg-[#E8963A] hover:bg-[#D4842A] text-white text-sm font-bold rounded-xl px-4 py-2 transition-colors">
					<FontAwesomeIcon icon={faPlus} className="text-xs"/>
					Create org
				</Link>
			</header>

			<main className="max-w-6xl mx-auto px-5 md:px-8 py-10">
				<p className="text-[#666666] text-sm mb-6">{orgs.length} organizations total</p>

				<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-[#2A2A2A] bg-[#111111]/60">
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-[10px] px-5 py-4">Name</th>
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-[10px] px-5 py-4 hidden md:table-cell">Type</th>
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-[10px] px-5 py-4 hidden lg:table-cell">Service</th>
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-[10px] px-5 py-4">Status</th>
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-[10px] px-5 py-4 hidden sm:table-cell">Members</th>
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-[10px] px-5 py-4 hidden lg:table-cell">Admins</th>
									<th className="text-left text-[#666666] font-bold uppercase tracking-widest text-[10px] px-5 py-4 hidden md:table-cell">Created</th>
									<th className="px-5 py-4"/>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#2A2A2A]">
								{orgs.length === 0
								?
									<tr>
										<td colSpan={8} className="px-5 py-12 text-center text-[#555555]">No organizations found.</td>
									</tr>
								:
									orgs.map((org) =>
									(
										<tr key={org.id} className="hover:bg-[#222222] transition-all">
											<td className="px-5 py-3.5 text-white font-semibold">{org.name}</td>
											<td className="px-5 py-3.5 text-[#888888] hidden md:table-cell">{org.type}</td>
											<td className="px-5 py-3.5 text-[#888888] hidden lg:table-cell">{org.service}</td>
											<td className="px-5 py-3.5">
												{org.active === "TRUE"
												?
													<span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2.5 py-1 uppercase tracking-wider">
														<span className="w-1 h-1 rounded-full bg-green-400"/>
														Active
													</span>
												:
													<span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-[#222222] text-[#666666] border border-[#2A2A2A] rounded-full px-2.5 py-1 uppercase tracking-wider">
														<span className="w-1 h-1 rounded-full bg-[#555555]"/>
														Inactive
													</span>
												}
											</td>
											<td className="px-5 py-3.5 text-[#888888] hidden sm:table-cell">{org._count.users}</td>
											<td className="px-5 py-3.5 text-[#888888] hidden lg:table-cell">
												{ org.admins.length === 0 ? <span className="text-[#444444] italic">none</span>: org.admins.map(a => `${a.firstname} ${a.lastname}`).join(", ") }
											</td>
											<td className="px-5 py-3.5 text-[#666666] hidden md:table-cell">{new Date(org.createdAt).toLocaleDateString()}</td>
											<td className="px-5 py-3.5">
												<Link href={`/admin/orgs/${org.id}`} className="text-xs font-bold text-[#E8963A] hover:text-[#D4842A] transition-colors">Edit</Link>
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
