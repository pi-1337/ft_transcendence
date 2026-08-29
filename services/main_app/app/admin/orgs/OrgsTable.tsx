"use client";

import Link from "next/link";
import {
  Building2,
  Plus,
  ArrowLeft,
  Pencil,
  ShieldCheck,
  XCircle,
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

type Org = {
  id: number;
  name: string;
  type: string;
  service: string;
  active: "TRUE" | "FALSE";
  admins: { id: number; firstname: string; lastname: string }[];
  _count: { users: number };
  createdAt: Date;
};

type Props = {
  orgs: Org[];
};

export default function OrgsTable({ orgs }: Props) {
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
          <span className="text-white">Organizations</span>
        </div>
        <Link href="/admin/orgs/create">
          <Button className="bg-green-700 hover:bg-green-800 text-white h-9 px-4 gap-2">
            <Plus className="w-4 h-4" /> Create org
          </Button>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex items-start gap-3 mb-8">
          <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
            <Building2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">All organizations</h1>
            <p className="text-sm text-gray-400">
              Manage {orgs.length} organizations and their details.
            </p>
          </div>
        </div>

        <Card className="bg-gray-900 border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-950/50 whitespace-nowrap">
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-semibold h-12 px-6">
                    Name
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Type & Service
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Stats
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Admins
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold text-right h-12 px-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgs.length === 0 ? (
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-gray-500"
                    >
                      No organizations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orgs.map((org) => (
                    <TableRow
                      key={org.id}
                      className="border-gray-800 hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-white">{org.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Created {new Date(org.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>

                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="text-gray-300">{org.type}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {org.service}
                        </div>
                      </TableCell>

                      <TableCell className="py-4 whitespace-nowrap">
                        {org.active === "TRUE" ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-950/40 text-green-400 border border-green-800/50 rounded-full px-2.5 py-1 font-medium">
                            <ShieldCheck className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs bg-gray-900 text-gray-400 border border-gray-800 rounded-full px-2.5 py-1 font-medium">
                            <XCircle className="w-3 h-3" /> Inactive
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="py-4 text-gray-300 whitespace-nowrap">
                        <span className="font-medium">{org._count.users}</span>{" "}
                        members
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1">
                          {org.admins.length === 0 ? (
                            <span className="text-gray-600 text-xs italic">
                              None
                            </span>
                          ) : (
                            org.admins.map((a) => (
                              <span
                                key={a.id}
                                className="text-xs text-gray-400 bg-gray-950 border border-gray-800 px-2 py-0.5 rounded-md w-max"
                              >
                                {a.firstname} {a.lastname}
                              </span>
                            ))
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4 text-right whitespace-nowrap">
                        <Link href={`/admin/orgs/${org.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-transparent border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 gap-1.5"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </Button>
                        </Link>
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
