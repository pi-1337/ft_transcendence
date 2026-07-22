"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { notification } from "@/lib/types";
import { UserFrontend } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Notifications({
  notifications,
  user,
}: {
  notifications: notification[];
  user: UserFrontend;
}) {
  const router = useRouter();
  const [notifs, setNotifications] = useState<notification[]>(
    [...notifications].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    ),
  );

  const handleRead = async () => {
    const notificationIds = notifs.map((n) => n.id);
    const res = await fetch("/api/notification/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationIds }),
    });

    const data = await res.json();
    if (data.success) {
      setNotifications(notifs.map((n) => ({ ...n, read: true }))); 
    }
  };

  const handleUnread = async () => {
    const notificationIds = notifs.map((n) => n.id);
    const res = await fetch("/api/notification/unread", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationIds }),
    });

    const data = await res.json();
    if (data.success) {
      setNotifications(notifs.map((n) => ({ ...n, read: false }))); 
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  const readCount = notifs.filter((n) => n.read).length;
  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
            <span className="text-white font-bold text-xl tracking-tight">
              Badge<span className="text-green-700">Hub</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="h-9 w-9 border border-gray-800 hover:border-gray-700 transition-colors">
                <AvatarImage src={user.avatar || ""} alt={user.firstname} />
                <AvatarFallback className="bg-gray-800 text-green-400 font-semibold">
                  {user.firstname?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-gray-900 border-gray-800 text-gray-200"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {user.firstname}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-gray-800" />

              <DropdownMenuItem
                className="focus:bg-gray-800 focus:text-white cursor-pointer"
                onClick={() => router.push("/settings")}
              >
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-800" />

              <DropdownMenuItem
                className="text-red-400 focus:bg-gray-800 focus:text-red-300 cursor-pointer"
                onClick={handleLogout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Notifications</h1>
            <span className="text-sm font-medium text-gray-500">
              {notifs.length} total
            </span>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button
                onClick={handleRead}
                variant="outline"
                size="sm"
                className="bg-gray-900 border-gray-800 text-gray-300 hover:bg-green-700 hover:text-white h-8 text-xs transition-colors"
              >
                Mark all as read ({unreadCount})
              </Button>
            )}
            {readCount > 0 && (
              <Button
                onClick={handleUnread}
                variant="outline"
                size="sm"
                className="bg-gray-900 border-gray-800 text-gray-300 hover:bg-green-700 hover:text-white h-8 text-xs transition-colors"
              >
                Mark all as unread ({readCount})
              </Button>
            )}
          </div>
        </div>

        <Card className="bg-gray-900 border-gray-800 overflow-hidden">
          {notifs.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No notifications yet
            </div>
          ) : (
            <div className="flex flex-col">
              {notifs.map((n, i) => (
                <div
                  key={i}
                  className={`px-6 py-4 border-b border-gray-800/50 last:border-0 cursor-pointer hover:bg-gray-950/50 transition-colors flex flex-col gap-1 ${
                    n.read ? "text-gray-400" : "text-white bg-gray-900/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`text-sm ${n.read ? "font-normal" : "font-medium"}`}
                    >
                      {n.message}
                    </span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    )}
                  </div>
                  <span className="text-xs text-gray-600">
                    {new Date(n.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}