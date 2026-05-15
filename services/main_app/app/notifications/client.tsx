'use client'

import Link from 'next/link';
import { useState } from 'react';
import { Award, Users, CheckCircle, Trash2 } from 'lucide-react';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

type Props = {
    notifications: Notification[];
};

export default function NotificationsClient({ notifications: initialNotifications }: Props) {
    const [notifications, setNotifications] = useState(initialNotifications);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (id: number) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const handleDelete = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'badge_awarded':
                return <Award size={16} className="text-yellow-400" />;
            case 'user_added':
                return <Users size={16} className="text-blue-400" />;
            case 'badge_recorded':
                return <CheckCircle size={16} className="text-green-400" />;
            default:
                return <CheckCircle size={16} className="text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="border-b border-[#1f1f1f] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-white font-semibold text-lg">Notifications</span>
                    {unreadCount > 0 && (
                        <span className="text-xs bg-red-600/20 text-red-400 border border-red-600/30 rounded-full px-2.5 py-0.5">
                            {unreadCount} new
                        </span>
                    )}
                </div>
                <Link href="/user/dashboard" className="text-sm text-blue-400 hover:text-blue-300">
                    ← Back
                </Link>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-12">
                {notifications.length === 0 ? (
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-12 text-center">
                        <p className="text-gray-500">No notifications yet.</p>
                    </div>
                ) : (
                    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                        <div className="space-y-1">
                            {notifications.map((notification, idx) => (
                                <div key={notification.id}>
                                    <div className={`px-6 py-4 hover:bg-[#1f1f1f] transition-colors ${!notification.read ? 'bg-[#1f1f1f]/50' : ''}`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className="mt-1">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-white">{notification.title}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                                                    <p className="text-xs text-gray-600 mt-2">{notification.createdAt}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(notification.id)}
                                                className="text-gray-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    {idx < notifications.length - 1 && <div className="h-px bg-[#1f1f1f]" />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
