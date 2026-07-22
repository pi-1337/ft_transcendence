"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Building2,
  Radio,
  LayoutGrid,
  Megaphone,
  Shield,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

type Props = {
  firstname: string;
  lastname: string;
  email: string;
  totalUsers: number;
  totalOrgs: number;
  totalReaders: number;
};

export default function AdminDashboard({
  firstname,
  lastname,
  email,
  totalUsers,
  totalOrgs,
  totalReaders,
}: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };
  const managementLinks = [
    {
      title: "Manage user accounts",
      description: "View, edit, and manage all user accounts in the system",
      link: "/admin/users",
      icon: Users,
      action: "Manage Users",
    },
    {
      title: "Organizations",
      description: "View general organizational activity and metrics",
      link: "/organizations",
      icon: Building2,
      action: "See Organizations",
    },
    {
      title: "System organizations",
      description: "Manage core system organizational structures",
      link: "/admin/orgs",
      icon: Building2,
      action: "Manage Organizations",
    },
    {
      title: "RFC Reader hardware",
      description: "Monitor and configure RFC reader devices",
      link: "/admin/rfcReaders",
      icon: Radio,
      action: "Manage Readers",
    },
    {
      title: "Announcements",
      description: "Create and broadcast system-wide announcements",
      link: "/admin/announcements",
      icon: Megaphone,
      action: "Manage Announcements",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-xl tracking-tight">
            Badge<span className="text-green-700">Hub</span>
          </span>
          <span className="text-xs bg-green-950/40 text-green-400 border border-green-800/50 rounded-full px-2.5 py-0.5 font-medium flex items-center gap-1">
            <Shield className="w-3 h-3" /> ADMIN
          </span>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="h-9 w-9 border border-gray-800 hover:border-gray-700 transition-colors">
                <AvatarFallback className="bg-gray-800 text-green-400 font-semibold">
                  {firstname?.charAt(0).toUpperCase()}
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
                      {firstname} {lastname}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
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
            Welcome back, {firstname} {lastname}!
          </h1>
          <p className="text-gray-400 text-sm">
            Signed in as <span className="text-gray-300">{email}</span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{totalUsers}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Total Organizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{totalOrgs}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Total RFC Readers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{totalReaders}</p>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-200 text-lg font-semibold flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-green-600" />
              System Management
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {managementLinks.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gray-950/50 border border-gray-800 hover:border-gray-700 transition-colors gap-4 sm:gap-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800 flex-shrink-0">
                    <item.icon className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {item.title}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      {item.description}
                    </span>
                  </div>
                </div>
                <Link href={item.link}>
                  <Button className="bg-green-700 hover:bg-green-800 text-white h-8 text-xs w-full sm:w-auto">
                    {item.action}
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
