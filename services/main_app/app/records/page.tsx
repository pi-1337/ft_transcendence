"use client";

import Link from "next/link";
import { useState } from "react";
import { ClipboardList, ArrowRight, Filter } from "lucide-react";
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

const mockRecords = [
  {
    id: 1,
    badgeNumber: "BADGE-001",
    orgName: "Acme Corporation",
    action: "Entry",
    timestamp: new Date("2024-01-20 10:30:00"),
  },
  {
    id: 2,
    badgeNumber: "BADGE-001",
    orgName: "Acme Corporation",
    action: "Exit",
    timestamp: new Date("2024-01-20 17:00:00"),
  },
  {
    id: 3,
    badgeNumber: "BADGE-001",
    orgName: "Acme Corporation",
    action: "Entry",
    timestamp: new Date("2024-01-21 09:15:00"),
  },
  {
    id: 4,
    badgeNumber: "BADGE-001",
    orgName: "Acme Corporation",
    action: "Exit",
    timestamp: new Date("2024-01-21 18:45:00"),
  },
  {
    id: 5,
    badgeNumber: "BADGE-002",
    orgName: "Tech Startup Inc",
    action: "Entry",
    timestamp: new Date("2024-01-22 08:00:00"),
  },
  {
    id: 6,
    badgeNumber: "BADGE-002",
    orgName: "Tech Startup Inc",
    action: "Exit",
    timestamp: new Date("2024-01-22 17:30:00"),
  },
  {
    id: 7,
    badgeNumber: "BADGE-001",
    orgName: "Acme Corporation",
    action: "Entry",
    timestamp: new Date("2024-01-22 09:00:00"),
  },
  {
    id: 8,
    badgeNumber: "BADGE-001",
    orgName: "Acme Corporation",
    action: "Exit",
    timestamp: new Date("2024-01-22 18:00:00"),
  },
];

export default function Records() {
  const [records] = useState(mockRecords);
  const [filterBadge, setFilterBadge] = useState("");

  const filteredRecords = filterBadge
    ? records.filter((r) => r.badgeNumber === filterBadge)
    : records;

  const uniqueBadges = Array.from(new Set(records.map((r) => r.badgeNumber)));

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm font-medium">
          Records
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
            <ClipboardList className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Your Records</h1>
            <p className="text-sm text-gray-400">
              Showing {filteredRecords.length} activity logs based on your
              selection.
            </p>
          </div>
        </div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-2 text-gray-400 text-sm font-medium">
            <Filter className="w-4 h-4" /> Filter by:
          </div>
          <Button
            onClick={() => setFilterBadge("")}
            variant={filterBadge === "" ? "default" : "outline"}
            className={
              filterBadge === ""
                ? "bg-green-700 hover:bg-green-800 text-white h-9"
                : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 h-9"
            }
          >
            All Badges
          </Button>
          {uniqueBadges.map((badge) => (
            <Button
              key={badge}
              onClick={() => setFilterBadge(badge)}
              variant={filterBadge === badge ? "default" : "outline"}
              className={`font-mono h-9 ${
                filterBadge === badge
                  ? "bg-green-700 hover:bg-green-800 text-white"
                  : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {badge}
            </Button>
          ))}
        </div>
        <Card className="bg-gray-900 border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-950/50">
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-semibold h-12 px-6">
                    Badge
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Organization
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Action
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold text-right h-12 px-6">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500"
                    >
                      No records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      className="border-gray-800 hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="px-6 py-4">
                        <span className="font-mono text-sm bg-gray-950 px-2.5 py-1 rounded border border-gray-800 text-gray-300">
                          {record.badgeNumber}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-300 py-4 font-medium">
                        {record.orgName}
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
                      <TableCell className="text-gray-400 text-sm py-4">
                        {record.timestamp.toLocaleString()}
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
