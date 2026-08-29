"use client";

import { OrgsFrontend } from "@/lib/types";
import Link from "next/link";
import { Building2 } from "lucide-react";
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

export default function Organizations({ orgs }: { orgs: OrgsFrontend[] }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          Organizations
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
            <Building2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Your Organizations
            </h1>
            <p className="text-sm text-gray-400">
              Manage and view details for {orgs.length} total organizations.
            </p>
          </div>
        </div>

        <Card className="bg-gray-900 border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-950/50">
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-semibold h-12 px-6">
                    Name
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Type
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Service
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Badges
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Status
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
                      <TableCell className="font-medium text-white px-6 py-4">
                        {org.name}
                      </TableCell>
                      <TableCell className="text-gray-300 py-4">
                        {org.type}
                      </TableCell>
                      <TableCell className="text-gray-300 py-4">
                        {org.service}
                      </TableCell>
                      <TableCell className="text-gray-300 py-4">
                        {org.badgeTimes}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center text-xs bg-green-950/40 text-green-400 border border-green-800/50 rounded-full px-2.5 py-1 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                          Active
                        </span>
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
