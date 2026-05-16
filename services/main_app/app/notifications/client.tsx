'use client'

import Link from "next/link";
import { useState } from "react";

type MiniNotification = {
    id: number,
    read: boolean,
    message: string,
    createdAt: Date
};

export default function Notifications(
    { notifications }: { notifications: MiniNotification[] }
) {
    const [notifs, setNotifications] = useState<MiniNotification[]>(
        notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    );

    const handleRead = async () => {
        const notificationIds = notifs.map(n => n.id);
        const response = await fetch('/api/notification/read', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationIds }),
        });

        const data = await response.json();
        if (data.success) {
            setNotifications(notifs.map(n => ({ id: n.id, read: true, message: n.message, createdAt: n.createdAt })));
        }
    }

    const handleUnread = async () => {
        const notificationIds = notifs.map(n => n.id);
        const response = await fetch('/api/notification/unread', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationIds }),
        });

        const data = await response.json();
        if (data.success) {
            setNotifications(notifs.map(n => ({ id: n.id, read: false, message: n.message, createdAt: n.createdAt })));
        }
    }

    const readCount = notifs.filter(n => n.read).length;
    const unreadCount = notifs.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top bar */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="text-gray-500 hover:text-white text-sm transition-colors"
                    >
                        ← Dashboard
                    </Link>

                    <span className="text-[#333]">/</span>

                    <span className="text-white font-semibold">Notifications</span>

                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={handleRead}
                        className="text-xs px-3 py-1 rounded-lg bg-[#111] border border-[#1f1f1f] hover:bg-[#161616] transition text-gray-300"
                    >
                        Mark all as read ({unreadCount})
                    </button>
                )}
                {readCount > 0 && (
                    <button
                        onClick={handleUnread}
                        className="text-xs px-3 py-1 rounded-lg bg-[#111] border border-[#1f1f1f] hover:bg-[#161616] transition text-gray-300"
                    >
                        Mark all as unread ({readCount})
                    </button>
                )}
            </header>

            {/* Main */}
            <main className="max-w-3xl mx-auto px-8 py-10">
                <h1 className="text-xl font-semibold mb-6">
                    Notifications ({notifications.length})
                </h1>

                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                    {notifs.length === 0 ? (
                        <div className="p-6 text-gray-500 text-sm">
                            No notifications yet
                        </div>
                    ) : (
                        notifs.map((n, i) => (
                            <div
                                key={i}
                                className={`px-5 py-4 border-b border-[#1a1a1a] cursor-pointer hover:bg-[#161616] transition ${n.read ? "text-gray-500" : "text-white"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{n.message}</span>

                                    {!n.read && (
                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}