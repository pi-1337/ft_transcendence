"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faBuilding, faPenToSquare, faQrcode, faChartLine, faUsers, faAward, faLayerGroup, faTag, faCircleCheck, faCalendar } from "@fortawesome/free-solid-svg-icons";

interface Org
{
	id: number,
	name: string,
	type: string,
	service: string,
	badgeTimes: number,
	active: string,
	createdAt: Date,
	members: number,
	badges: number,
	isOrgAdmin: boolean,
};

export default function OrgDetails({ orgs }: { orgs: Org[] })
{
	const params = useParams<{ id: string }>();
	const org = orgs.find(org => org.id === parseInt(params.id));

	if (!org)
	{
		return (
			<div className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-5">
				<div className="text-center">
					<div className="w-16 h-16 bg-[#E8963A]/10 border border-[#E8963A]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<FontAwesomeIcon icon={faBuilding} className="text-[#E8963A] text-2xl"/>
					</div>
					<h1 className="text-xl font-bold mb-2">Organization not found</h1>
					<p className="text-[#666666] text-[16px] mb-6">This organization doesn"t exist or you don"t have access.</p>
					<Link href="/organizations" className="text-[#E8963A] hover:text-[#D4842A] text-[16px] font-semibold transition-colors">← Back to Organizations</Link>
				</div>
			</div>
		);
	}

	const org_stats =
	[
		{ label: "Type", value: org.type, icon: faLayerGroup },
		{ label: "Members", value: org.members, icon: faUsers },
		{ label: "Badges", value: org.badges, icon: faAward },
	];
	const org_details =
	[
		{ label: "Service", value: org.service, icon: faLayerGroup, valueClass: "text-white" },
		{ label: "Badge Times", value: org.badgeTimes, icon: faTag, valueClass: "text-white" },
		{ label: "Status", value: "Active", icon: faCircleCheck, valueClass: "text-green-400" },
		{ label: "Created", value: org.createdAt.toLocaleDateString("en-GB"), icon: faCalendar, valueClass: "text-white" },
	];

	return (
		<div className="min-h-screen bg-[#111111] text-white">
			<header className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#2A2A2A] px-5 md:px-8 py-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Link href="/organizations" className="flex items-center gap-2 text-[#888888] hover:text-white text-[16px] font-medium transition-all group">
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-1 transition-transform"/>
						Organizations
					</Link>
					<div className="w-px h-4 bg-[#2A2A2A]"/>
					<span className="text-white font-semibold text-[16px]">{org.name}</span>
				</div>
				{org.isOrgAdmin && (
					<div className="flex items-center gap-2">
						<Link href={`/organizations/${org.id}/edit`} className="flex items-center gap-2 text-[16px] font-semibold text-[#888888] hover:text-white bg-[#1A1A1A] hover:bg-[#222222] border border-[#2A2A2A] hover:border-[#444444] rounded-xl px-4 py-2 transition-all">
							<FontAwesomeIcon icon={faPenToSquare} className="text-xs"/>
							<span className="hidden sm:inline">Edit</span>
						</Link>
						<Link href={`/organizations/${org.id}/scans`} className="flex items-center gap-2 text-[16px] font-semibold text-[#E8963A] hover:text-white bg-[#E8963A]/10 hover:bg-[#E8963A] border border-[#E8963A]/20 hover:border-[#E8963A] rounded-xl px-4 py-2 transition-all">
							<FontAwesomeIcon icon={faQrcode} className="text-xs"/>
							<span className="hidden sm:inline">Scans</span>
						</Link>
						<Link href={`/organizations/${org.id}/analytics`} className="flex items-center gap-2 text-[16px] font-semibold text-[#E8963A] hover:text-white bg-[#E8963A]/10 hover:bg-[#E8963A] border border-[#E8963A]/20 hover:border-[#E8963A] rounded-xl px-4 py-2 transition-all">
							<FontAwesomeIcon icon={faChartLine} className="text-xs"/>
							<span className="hidden sm:inline">Analytics</span>
						</Link>
					</div>
				)}
			</header>

			<main className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-12">
				<div className="mb-10">
					<div className="flex items-center gap-4">
						<div className="w-14 h-14 bg-[#E8963A]/10 border border-[#E8963A]/20 rounded-2xl flex items-center justify-center shrink-0">
							<FontAwesomeIcon icon={faBuilding} className="text-[#E8963A] text-xl"/>
						</div>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold tracking-tight">{org.name}</h1>
							<p className="text-[#666666] text-[16px] mt-1">{org.type}</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
					{org_stats.map((stat) => (
						<div key={stat.label} className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E8963A]/30 rounded-2xl p-6 transition-all group">
							<div className="w-9 h-9 bg-[#E8963A]/10 border border-[#E8963A]/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
								<FontAwesomeIcon icon={stat.icon} className="text-[#E8963A] text-[16px]"/>
							</div>
							<p className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
							<p className="text-2xl font-black text-white">{stat.value}</p>
						</div>
					))}
				</div>

				<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 mb-8">
					<h2 className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-6">Organization Details</h2>
					<div className="flex flex-col divide-y divide-[#2A2A2A]">
						{org_details.map((row) => (
							<div key={row.label} className="flex items-center justify-between py-4">
								<div className="flex items-center gap-3 text-[#888888] text-[16px]">
									<FontAwesomeIcon icon={row.icon} className="text-[#444444] text-xs w-4"/>
									{row.label}
								</div>
								<span className={`text-[16px] font-semibold ${row.valueClass}`}>{row.value}</span>
							</div>
						))}
					</div>
				</div>

				<Link href="/organizations" className="inline-flex items-center gap-2 text-[#888888] hover:text-white border border-[#2A2A2A] hover:border-[#444444] rounded-xl px-5 py-2.5 text-[16px] font-semibold transition-all">
					<FontAwesomeIcon icon={faChevronLeft} className="text-xs"/>
					Back
				</Link>
			</main>
		</div>
	);
}
