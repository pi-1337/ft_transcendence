"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdBadge, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function HomePage()
{
	const features =
	[
		{ num: "01", title: "User Dashboard", desc: "View your profile, manage organizations, and track all your activities in one place." },
		{ num: "02", title: "Badge Tracking", desc: "Create badges for your organizations and track all records in real-time." },
		{ num: "03", title: "Organization Management", desc: "Manage multiple organizations and their associated badges with ease." },
	];

	return (
		<div className="min-h-screen bg-[#111111] text-white relative overflow-hidden">

			<nav className="relative z-10 flex items-center justify-between px-5 md:px-8 py-5">
				<div className="flex items-center gap-2">
					<FontAwesomeIcon icon={faIdBadge} className="text-[#E8963A] text-lg"/>
					<span className="text-white font-bold text-base tracking-wide">BadgeHub</span>
				</div>
				<Link href="/auth/login" className="text-[#aaaaaa] hover:text-white text-[16px] transition-colors">Sign In</Link>
			</nav>

			<section className="relative z-10 px-5 md:px-8 pt-12 md:pt-16 pb-20 md:pb-32 flex flex-col md:flex-row items-start gap-10 md:gap-12 max-w-5xl mx-auto">
				<div className="flex-1 pt-2 md:pt-4">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-6">Track & manage<br/>badges at scale<br/></h1>

					<p className="text-[#888888] text-[16px] leading-relaxed mb-10 max-w-xs">Monitor user badges across your organizations with ease. Create, track, and manage credentials in real-time.</p>
					<div className="flex items-center gap-4">
						<Link href="/auth/register" className="flex items-center gap-2 bg-[#E8963A] hover:bg-[#D4842A] text-white text-[16px] font-semibold px-5 py-2.5 rounded-lg transition-colors">
							Get started <FontAwesomeIcon icon={faArrowRight} className="text-xs"/>
						</Link>
						<Link href="/auth/login" className="text-[#aaaaaa] hover:text-white text-[16px] transition-colors">Sign In</Link>
					</div>
				</div>
			</section>

			<section className="relative z-10 px-5 md:px-8 py-14 md:py-20 max-w-5xl mx-auto border-t border-[#2A2A2A]">
				<div className="flex flex-col md:flex-row gap-10 md:gap-16">
					<div className="md:w-48 shrink-0">
						<p className="text-[#E8963A] text-xs font-bold tracking-widest uppercase mb-4">Everything you need</p>
						<p className="text-white text-base font-semibold leading-snug">A complete platform for badge management, tracking, and organizational control.</p>
					</div>
					<div className="flex-1 flex flex-col divide-y divide-[#2A2A2A]">
						{features.map((item, index) => (
							<div key={index} className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 py-7 md:py-8">
								<span className="text-[#444444] text-[16px] font-mono shrink-0">{item.num}</span>
								<h3 className="text-white text-lg md:text-xl font-bold sm:w-48 shrink-0">{item.title}</h3>
								<p className="text-[#888888] text-[16px] leading-relaxed flex-1">{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="relative z-10 px-5 md:px-8 py-16 md:py-24 text-center border-t border-[#2A2A2A]">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-10 leading-snug">Ready to get started?</h2>
				<div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
					<Link href="/auth/register" className="w-full sm:w-auto bg-[#1A1A1A] hover:bg-[#222222] border border-[#2A2A2A] text-white text-[16px] font-semibold px-6 py-3 rounded-lg transition-colors">Start your transformation</Link>
				</div>
			</section>

			<footer className="relative z-10 px-5 md:px-8 py-8 border-t border-[#2A2A2A]">
				<div className="flex items-center gap-2 mb-1">
					<FontAwesomeIcon icon={faIdBadge} className="text-[#E8963A] text-[16px]"/>
					<span className="text-white font-bold text-[16px] tracking-wide">BadgeHub</span>
				</div>
				<p className="text-[#444444] text-xs tracking-widest uppercase">© 2024 BadgeHub. Engineered for the precise.</p>
			</footer>
		</div>
	);
}
