"use client";

import Link from "next/link";
import { useState } from "react";
import { IdCard, Clock, ArrowRight, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for badges
const mockBadges = [
  {
    number: "BADGE-001",
    userId: 1,
    orgId: 1,
    orgName: "Acme Corporation",
    createdAt: new Date("2024-01-15"),
    records: 12,
  },
  {
    number: "BADGE-002",
    userId: 1,
    orgId: 2,
    orgName: "Tech Startup Inc",
    createdAt: new Date("2024-02-20"),
    records: 8,
  },
];

const mockRecords = [
  {
    id: 1,
    badgeNumber: "BADGE-001",
    timestamp: new Date("2024-01-20 10:30:00"),
    action: "Entry",
  },
  {
    id: 2,
    badgeNumber: "BADGE-001",
    timestamp: new Date("2024-01-20 17:00:00"),
    action: "Exit",
  },
  {
    id: 3,
    badgeNumber: "BADGE-001",
    timestamp: new Date("2024-01-21 09:15:00"),
    action: "Entry",
  },
  {
    id: 4,
    badgeNumber: "BADGE-001",
    timestamp: new Date("2024-01-21 18:45:00"),
    action: "Exit",
  },
];

export default function BadgeDetails() {
  const [selectedBadge, setSelectedBadge] = useState(mockBadges[0]);
  const badgeRecords = mockRecords.filter(
    (r) => r.badgeNumber === selectedBadge.number,
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm font-medium">
            Badges
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
            <IdCard className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Your Badges</h1>
            <p className="text-sm text-gray-400">
              Select a badge to view its details and activity records.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {mockBadges.map((badge) => (
            <button
              key={badge.number}
              onClick={() => setSelectedBadge(badge)}
              className={`text-left rounded-2xl p-6 transition-all duration-200 border ${
                selectedBadge.number === badge.number
                  ? "bg-gray-900/80 border-green-600 ring-1 ring-green-600/50 shadow-[0_0_15px_rgba(22,163,74,0.1)]"
                  : "bg-gray-900 border-gray-800 hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono text-lg font-bold text-green-400">
                  {badge.number}
                </div>
                {selectedBadge.number === badge.number && (
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                )}
              </div>
              <div className="text-sm text-gray-300 font-medium mb-4">
                {badge.orgName}
              </div>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800/50">
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> {badge.records} records
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />{" "}
                  {badge.createdAt.toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
        </div>
        <Card className="bg-gray-900 border-gray-800 mb-10">
          <CardHeader className="pb-4 border-b border-gray-800">
            <CardTitle className="text-gray-400 text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
              <IdCard className="w-4 h-4 text-green-600" />
              Badge Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-2 hover:bg-gray-950/30 rounded-lg transition-colors">
                <span className="text-gray-400 text-sm">Badge Number</span>
                <span className="text-white font-mono font-medium bg-gray-950 px-3 py-1 rounded border border-gray-800">
                  {selectedBadge.number}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-gray-950/30 rounded-lg transition-colors">
                <span className="text-gray-400 text-sm">Organization</span>
                <span className="text-white font-medium">
                  {selectedBadge.orgName}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-gray-950/30 rounded-lg transition-colors">
                <span className="text-gray-400 text-sm">Created</span>
                <span className="text-white font-medium">
                  {selectedBadge.createdAt.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-gray-950/30 rounded-lg transition-colors">
                <span className="text-gray-400 text-sm">Total Records</span>
                <span className="text-white font-medium">
                  {badgeRecords.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Recent Records</h2>
          <p className="text-sm text-gray-400 mb-4">
            Showing {badgeRecords.length} activity logs for this badge.
          </p>
        </div>

        <Card className="bg-gray-900 border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-950/50">
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-semibold h-12 px-6">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Action
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold text-right h-12 px-6">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {badgeRecords.length === 0 ? (
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-gray-500"
                    >
                      No records found for this badge.
                    </TableCell>
                  </TableRow>
                ) : (
                  badgeRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      className="border-gray-800 hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-300 px-6 py-4">
                        {record.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center text-xs border rounded-full px-2.5 py-1 font-medium ${
                            record.action === "Entry"
                              ? "bg-green-950/40 text-green-400 border-green-800/50"
                              : "bg-red-950/40 text-red-400 border-red-800/50"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${record.action === "Entry" ? "bg-green-500" : "bg-red-500"}`}
                          ></span>
                          {record.action}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-6 py-4">
                        <Link href={`/records/${record.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 gap-1.5"
                          >
                            View <ArrowRight className="w-3.5 h-3.5" />
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
