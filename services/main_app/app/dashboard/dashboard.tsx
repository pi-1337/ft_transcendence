"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserFrontend } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdBadge, faBuilding, faAward, faTableCells, faCog, faRightFromBracket, faArrowUpRightFromSquare, faPlus, faBell } from "@fortawesome/free-solid-svg-icons";

interface Params
{
	user: UserFrontend,
	totalOrganizations: number,
	totalBadges: number,
	totalRecords: number,
	unreadCount: number
};

function Bell({ unreadCount }: { unreadCount: number })
{
	return (
		<Link href="/notifications" className="relative p-2.5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] hover:bg-[#222222] hover:border-[#E8963A]/30 transition-all group">
			<FontAwesomeIcon icon={faBell} className="w-4 h-4 text-[#888888] group-hover:text-[#E8963A] transition-colors"/>
			{unreadCount > 0 && (
				<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E8963A] text-xs font-bold text-white ring-2 ring-[#111111]">
					{unreadCount}
				</span>
			)}
		</Link>
	);
}

export default function Dashboard( { user, totalOrganizations, totalBadges, totalRecords, unreadCount }: Params)
{
	const router = useRouter();
	const stats =
	[
		{ label: "Organizations", value: totalOrganizations, icon: faBuilding, color: "#E8963A", bg: "rgba(232,150,58,0.08)", border: "rgba(232,150,58,0.15)" },
		{ label: "Badges", value: totalBadges, icon: faAward, color: "#E8963A", bg: "rgba(232,150,58,0.08)", border: "rgba(232,150,58,0.15)" },
		{ label: "Total Records", value: totalRecords, icon: faTableCells, color: "#E8963A", bg: "rgba(232,150,58,0.08)", border: "rgba(232,150,58,0.15)" },
	];
	const quick_actions =
	[
		{ title: "View your organizations", link: "/organizations", action: "View all" },
		{ title: "Create a new badge", link: "/badge", action: "Create" },
		{ title: "View your records", link: "/records", action: "View all" },
	];

	async function handleLogout()
	{
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/auth/login");
	};

	return (
		<div className="min-h-screen bg-[#111111] text-white">
			<header className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#2A2A2A] px-5 md:px-8 py-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<FontAwesomeIcon icon={faIdBadge} className="text-[#E8963A] text-xl"/>
					<span className="text-white font-bold text-base tracking-wide">BadgeHub</span>
					<span className="text-xs font-bold bg-[#E8963A]/10 text-[#E8963A] border border-[#E8963A]/20 rounded-full px-2 py-0.5 tracking-wider uppercase">{user.role}</span>
				</div>
				<div className="flex items-center gap-1">
					<Link href="/settings" className="p-2 text-[#888888] hover:text-white hover:bg-[#2A2A2A] rounded-lg transition-all">
						<FontAwesomeIcon icon={faCog} className="w-4 h-4"/>
					</Link>
					<div className="w-px h-4 bg-[#2A2A2A] mx-2"/>
					<Bell unreadCount={unreadCount}/>
					<button onClick={handleLogout} className="ml-1 flex items-center gap-2 text-[16px] font-medium text-[#888888] hover:text-red-400 hover:bg-red-400/10 px-3 py-2 rounded-lg transition-all border border-red-400/20 cursor-pointer">
						<FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4"/>
						<span className="hidden sm:inline">Log out</span>
					</button>
				</div>
			</header>

			<main className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-12">
				<div className="mb-10 md:mb-12">
					<h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">Welcome back, <span className="text-[#E8963A]">{user.firstname}</span>!</h1>
					<p className="text-[#666666] flex items-center gap-2 text-[16px]">
						<span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"/>
						{user.email}
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12">
					{stats.map((stat) => (
						<div key={stat.label} className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E8963A]/30 rounded-2xl p-6 transition-all group">
							<div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: stat.bg, border: `1px solid ${stat.border}` }}>
								<FontAwesomeIcon icon={stat.icon} style={{ color: stat.color }} className="text-base"/>
							</div>
							<p className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
							<p className="text-4xl font-black text-white">{stat.value}</p>
						</div>
					))}
				</div>

				<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-8">
					<h2 className="text-[#666666] text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-8">
						<FontAwesomeIcon icon={faPlus} className="text-[#E8963A]"/>
						Quick actions
					</h2>
					<div className="flex flex-col">
						{quick_actions.map((item, index) => (
							<div key={item.title}>
								<div className="flex items-center justify-between px-4 py-4 rounded-xl hover:bg-[#222222] transition-all border border-transparent hover:border-[#2A2A2A]">
									<span className="text-[#cccccc] font-medium text-[16px]">{item.title}</span>
									<Link href={item.link} className="flex items-center gap-1.5 text-[16px] font-bold text-[#E8963A] hover:text-[#D4842A] transition-colors">
										{item.action}
										<FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs"/>
									</Link>
								</div>
								{index < 2 && <div className="h-px bg-[#2A2A2A] mx-4"/>}
							</div>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
