"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faChevronLeft, faCheckDouble, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState } from "react";

interface MiniNotification
{
	id: number,
	read: boolean,
	message: string,
	createdAt: Date
};

export default function Notifications({ notifications }: { notifications: MiniNotification[] })
{
	const [notifs, setNotifications] = useState<MiniNotification[]>(notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));

	async function handleRead()
	{
		const notificationIds = notifs.map(n => n.id);
		const response = await fetch("/api/notification/read",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ notificationIds }),
		});

		const data = await response.json();
		if (data.success)
			setNotifications(notifs.map(n => ({ id: n.id, read: true, message: n.message, createdAt: n.createdAt })));
	}

	async function handleUnread()
	{
		const notificationIds = notifs.map(n => n.id);
		const response = await fetch("/api/notification/unread",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ notificationIds }),
		});
		const data = await response.json();
		if (data.success)
			setNotifications(notifs.map(n => ({ id: n.id, read: false, message: n.message, createdAt: n.createdAt })));
	}

	const readCount = notifs.filter(n => n.read).length;
	const unreadCount = notifs.filter(n => !n.read).length;

	return (
		<div className="min-h-screen bg-[#111111] text-white">
			<header className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#2A2A2A] px-5 md:px-8 py-4 flex items-center justify-between gap-3">
				<div className="flex items-center gap-3 min-w-0">
					<Link href="/dashboard" className="flex items-center gap-2 text-[#888888] hover:text-white text-[16px] font-medium transition-all group shrink-0">
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-1 transition-transform"/>
						<span className="hidden sm:inline">Dashboard</span>
					</Link>
					<div className="w-px h-4 bg-[#2A2A2A] shrink-0"/>
					<div className="flex items-center gap-2 min-w-0">
						<FontAwesomeIcon icon={faBell} className="text-[#E8963A] text-[16px] shrink-0"/>
						<span className="text-white font-bold tracking-tight truncate">Notifications</span>
					</div>
				</div>
				<div className="flex items-center gap-2 shrink-0">
					{unreadCount > 0 &&
					(
						<button onClick={handleRead} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E8963A]/30 hover:text-[#E8963A] text-[#888888] transition-all cursor-pointer">
							<FontAwesomeIcon icon={faCheckDouble} className="text-xs"/>
							<span className="hidden sm:inline">Mark all read</span>
							<span className="bg-[#E8963A]/10 text-[#E8963A] border border-[#E8963A]/20 rounded-full px-1.5 py-0.5 text-xs font-black">{unreadCount}</span>
						</button>
					)}
					{readCount > 0 &&
					(
						<button onClick={handleUnread} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#444444] text-[#888888] hover:text-white transition-all cursor-pointer">
							<FontAwesomeIcon icon={faRotateLeft} className="text-xs"/>
							<span className="hidden sm:inline">Mark all unread</span>
							<span className="bg-[#2A2A2A] text-[#888888] rounded-full px-1.5 py-0.5 text-xs font-black">{readCount}</span>
						</button>
					)}
				</div>
			</header>
				
			<main className="max-w-3xl mx-auto px-5 md:px-8 py-10 md:py-12">
				<div className="flex items-center gap-4 mb-8">
					<div className="w-12 h-12 bg-[#E8963A]/10 border border-[#E8963A]/20 rounded-2xl flex items-center justify-center">
						<FontAwesomeIcon icon={faBell} className="text-[#E8963A] text-base"/>
					</div>
					<div>
						<h1 className="text-xl font-bold">Notifications</h1>
						<p className="text-[#666666] text-xs mt-0.5">{notifications.length} total · {unreadCount} unread</p>
					</div>
				</div>
				
				<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
					{notifs.length === 0
					?
						<div className="flex flex-col items-center justify-center py-16 px-6 text-center">
							<div className="w-12 h-12 bg-[#222222] border border-[#2A2A2A] rounded-2xl flex items-center justify-center mb-3">
								<FontAwesomeIcon icon={faBell} className="text-[#444444] text-base"/>
							</div>
							<p className="text-[#666666] text-[16px]">No notifications yet</p>
						</div>
					:
						notifs.map((n, i) =>
						(
							<div key={i} className={`flex items-start justify-between px-5 py-4 border-b border-[#222222] last:border-0 hover:bg-[#222222] transition-all cursor-pointer group ${n.read ? "opacity-50" : ""}`}>
								<div className="flex items-start gap-3 flex-1 min-w-0">
									<div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${n.read ? "bg-[#222222]" : "bg-[#E8963A]/10"}`}>
										<FontAwesomeIcon icon={faBell} className={`text-xs ${n.read ? "text-[#444444]" : "text-[#E8963A]"}`}/>
									</div>
									<span className={`text-[16px] leading-relaxed ${n.read ? "text-[#666666]" : "text-white"}`}>{n.message}</span>
								</div>
								{!n.read && (<span className="w-2 h-2 rounded-full bg-[#E8963A] shrink-0 mt-2 ml-4 shadow-[0_0_6px_rgba(232,150,58,0.6)]"/>)}
							</div>
						))
					}
				</div>
			</main>
		</div>
	);
}
