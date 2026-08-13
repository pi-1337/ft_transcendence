"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Shield,
  UserIcon,
  ArrowLeft,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  createdAt: Date;
};

type Props = {
  users: User[];
  currentAdminId: number;
};

export default function UsersTable({
  users: initialUsers,
  currentAdminId,
}: Props) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleDelete = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(userId);
    setError("");
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete user.");
        return;
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/admin/dashboard"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Admin Panel
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-white">Users</span>
        </div>
        <Link href="/admin/users/create">
          <Button className="bg-green-700 hover:bg-green-800 text-white h-9 px-4 gap-2">
            <Plus className="w-4 h-4" /> Add user
          </Button>
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        <div className="flex items-start gap-3 mb-8">
          <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
            <Users className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">All users</h1>
            <p className="text-sm text-gray-400">
              Manage {users.length} system users and their roles.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm px-4 py-3 font-medium">
            {error}
          </div>
        )}

        <Card className="bg-gray-900 border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-950/50">
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-semibold h-12 px-6">
                    Name
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Email
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Role
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Created
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold text-right h-12 px-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-gray-800 hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="font-medium text-white flex items-center gap-2">
                          {user.firstname} {user.lastname}
                          {user.id === currentAdminId && (
                            <span className="text-[10px] uppercase tracking-wider bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                              You
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 py-4">
                        {user.email}
                      </TableCell>
                      <TableCell className="py-4">
                        {user.role === "ADMIN" ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-950/40 text-green-400 border border-green-800/50 rounded-full px-2.5 py-1 font-medium">
                            <Shield className="w-3 h-3" /> ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs bg-gray-900 text-gray-400 border border-gray-800 rounded-full px-2.5 py-1 font-medium">
                            <UserIcon className="w-3 h-3" /> USER
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm py-4">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/users/${user.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 bg-transparent border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 gap-1.5"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </Button>
                          </Link>
                          {user.id !== currentAdminId && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              disabled={deletingId === user.id}
                              className="h-8 bg-red-900/80 hover:bg-red-900 text-red-200 border border-red-800 gap-1.5"
                            >
                              {deletingId === user.id ? (
                                "Deleting..."
                              ) : (
                                <>
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}
