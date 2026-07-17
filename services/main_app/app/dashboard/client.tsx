"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserFrontend } from "@/lib/types";
import { Bell } from "@/components/notifications/bell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export default function Dashboard({
  user,
  totalOrganizations,
  totalBadges,
  totalRecords,
  unreadCount,
}: {
  user: UserFrontend;
  totalOrganizations: number;
  totalBadges: number;
  totalRecords: number;
  unreadCount: number;
}) {
  const router = useRouter();

  const stats = {
    totalOrganizations,
    totalBadges,
    totalRecords,
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-xl tracking-tight">
            Badge<span className="text-green-700">Hub</span>
          </span>
          <span className="text-xs bg-green-950/40 text-green-400 border border-green-800/50 rounded-full px-2.5 py-0.5 font-medium">
            {user.role}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Bell unreadCount={unreadCount} />

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

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.firstname}!
          </h1>
          <p className="text-gray-400 text-sm">
            Signed in as <span className="text-gray-300">{user.email}</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Organizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">
                {stats.totalOrganizations}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">
                {stats.totalBadges}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Total Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">
                {stats.totalRecords}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-200 text-lg font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-950/50 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  View your organizations
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Manage and oversee all your affiliated organizations
                </span>
              </div>
              <Link href="/organizations">
                <Button
                  variant="secondary"
                  className="bg-green-700 hover:bg-green-800 text-white h-8 text-xs"
                >
                  View all
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-950/50 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  Create a new badge
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Design and issue a new badge for your organization
                </span>
              </div>
              <Link href="/badge">
                <Button className="bg-green-700 hover:bg-green-800 text-white h-8 w-20text-xs">
                  Create
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-950/50 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  View your records
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Track all badge records and issuances history
                </span>
              </div>
              <Link href="/records">
                <Button
                  variant="secondary"
                  className="bg-green-700 hover:bg-green-800 text-white h-8 text-xs"
                >
                  View all
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
