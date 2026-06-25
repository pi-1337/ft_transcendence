"use client"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { faIdBadge, faRightFromBracket, faUsers, faBuilding, faWifi, faBullhorn, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props
{
	firstname: string;
	lastname: string;
	email: string;
	totalUsers: number;
	totalOrgs: number;
	totalReaders: number;
};

export default function AdminDashboard({ firstname, lastname, email, totalUsers, totalOrgs, totalReaders }: Props)
{
	const router = useRouter();
	const stats =
	[
		{ label: "Total Users", value: totalUsers, icon: faUsers, color: "text-blue-400", bg: "bg-blue-500/10" },
		{ label: "Total Organizations", value: totalOrgs, icon: faBuilding, color: "text-indigo-400", bg: "bg-indigo-500/10" },
		{ label: "RFC Readers", value: totalReaders, icon: faWifi, color: "text-purple-400", bg: "bg-purple-500/10" },
	];
	const admin_quick_actions =
	[
		{ title: "Manage user accounts", link: "/admin/users", icon: faUsers, action: "Manage Users" },
		{ title: "Organizations", link: "/organizations", icon: faBuilding, action: "See Orgs" },
		{ title: "System organizations", link: "/admin/orgs", icon: faBuilding, action: "Manage Orgs" },
		{ title: "RFC Reader hardware", link: "/admin/rfcReaders", icon: faWifi, action: "Manage Readers" },
		{ title: "Announcements", link: "/admin/announcements", icon: faBullhorn, action: "Manage Announcements" },
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
					<FontAwesomeIcon icon={faIdBadge} className="text-[#E8963A] text-xl" />
					<span className="text-white font-bold text-base tracking-wide">Admin Panel</span>
				</div>
				<button onClick={handleLogout} className="flex items-center gap-2 text-[16px] font-medium text-[#888888] hover:text-red-400 hover:bg-red-400/10 px-3 py-2 rounded-lg transition-all border border-transparent hover:border-red-400/20 cursor-pointer">
					<FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
					<span className="hidden sm:inline">Log out</span>
				</button>
			</header>

			<main className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-12">
				<div className="mb-10">
					<h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome, <span className="text-[#E8963A]">{firstname} {lastname}</span></h1>
					<p className="text-[#666666] text-[16px] flex items-center gap-2">
						<span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
						Administrator · {email}
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
					{stats.map((stat) =>
					(
						<div key={stat.label} className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E8963A]/30 rounded-2xl p-6 transition-all group">
							<div className="w-10 h-10 bg-[#E8963A]/10 border border-[#E8963A]/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
								<FontAwesomeIcon icon={stat.icon} className="text-[#E8963A] text-[16px]" />
							</div>
							<p className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
							<p className="text-4xl font-black text-white">{stat.value}</p>
						</div>
					))}
				</div>

				<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
					<div className="px-6 py-5 border-b border-[#2A2A2A]">
						<h2 className="text-[#666666] text-xs font-bold uppercase tracking-widest">System Management</h2>
					</div>
					{admin_quick_actions.map((item, index, arr) =>
					(
						<div key={index} className={`flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 hover:bg-[#222222] transition-all gap-3 ${index < arr.length - 1 ? "border-b border-[#2A2A2A]" : ""}`}>
							<div className="flex items-center gap-3 sm:gap-4 min-w-0">
								<div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#222222] border border-[#2A2A2A] rounded-xl flex items-center justify-center shrink-0">
									<FontAwesomeIcon icon={item.icon} className="text-[#888888] text-xs sm:text-[16px]" />
								</div>
								<span className="text-white font-medium text-[16px] truncate">{item.title}</span>
							</div>
							<Link href={item.link} className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-[16px] font-bold text-[#E8963A] hover:text-[#D4842A] transition-colors group/link shrink-0">
								<span className="hidden md:inline">{item.action}</span>
								<FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover/link:translate-x-0.5 transition-transform" />
							</Link>
						</div>
					))}
				</div>
			</main>
		</div>
	);
}
