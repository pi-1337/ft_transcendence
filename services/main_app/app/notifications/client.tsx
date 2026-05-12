'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Check, Trash2, ArrowLeft, Award, Users, CheckCircle } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedOrgId?: number;
  relatedBadgeId?: string;
}

export default function NotificationsClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'badge_awarded',
      title: 'Badge Awarded!',
      message: 'You have been awarded badge #12 by Tech Startup',
      read: false,
      createdAt: 'May 10, 2025 10:30 AM',
      relatedOrgId: 1,
      relatedBadgeId: '#12'
    },
    {
      id: 2,
      type: 'user_added',
      title: 'Added to Organization',
      message: 'You have been added to Design Team by John Developer',
      read: false,
      createdAt: 'May 9, 2025 2:15 PM',
      relatedOrgId: 2
    },
    {
      id: 3,
      type: 'badge_awarded',
      title: 'Badge Awarded!',
      message: 'You have been awarded badge #11 by Design Team',
      read: true,
      createdAt: 'May 8, 2025 9:45 AM',
      relatedOrgId: 2,
      relatedBadgeId: '#11'
    },
    {
      id: 4,
      type: 'user_added',
      title: 'Added to Organization',
      message: 'You have been added to Marketing Guild by Sarah Manager',
      read: true,
      createdAt: 'May 7, 2025 3:20 PM',
      relatedOrgId: 3
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'badge_awarded':
        return <Award size={20} className="text-yellow-400" />;
      case 'user_added':
        return <Users size={20} className="text-blue-400" />;
      case 'badge_recorded':
        return <CheckCircle size={20} className="text-green-400" />;
      default:
        return <Bell size={20} className="text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        {unreadCount > 0 && (
          <div className="flex justify-end mb-6">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm"
            >
              <Check size={16} />
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-5 transition ${
                  notification.read
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                    : 'bg-slate-700 border-blue-500 hover:bg-slate-650'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 pt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-semibold text-base">
                          {notification.title}
                        </h3>
                        <p className="text-slate-300 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-slate-500 text-xs mt-2">
                          {notification.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition"
                            title="Mark as read"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 hover:bg-red-900/30 rounded-lg text-slate-400 hover:text-red-400 transition"
                          title="Delete notification"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Action Links */}
                    {notification.type === 'badge_awarded' && notification.relatedBadgeId && (
                      <Link
                        href={`/badges/${notification.relatedBadgeId}`}
                        className="inline-block text-blue-400 hover:text-blue-300 text-sm font-semibold mt-3"
                      >
                        View Badge →
                      </Link>
                    )}
                    {notification.relatedOrgId && (
                      <Link
                        href={`/organizations/${notification.relatedOrgId}`}
                        className="inline-block text-cyan-400 hover:text-cyan-300 text-sm font-semibold mt-3"
                      >
                        View Organization →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
