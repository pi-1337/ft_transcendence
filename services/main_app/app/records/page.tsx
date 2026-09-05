import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ClipboardList,
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  Hourglass,
  XCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/sessionManage";
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

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function getStatusStyle(status: string) {
  if (status === "ACCEPTED") {
    return "bg-green-950/40 text-green-400 border-green-800/50";
  }

  if (status === "REJECTED") {
    return "bg-red-950/40 text-red-400 border-red-800/50";
  }

  return "bg-yellow-950/40 text-yellow-300 border-yellow-800/50";
}

function getStatusIcon(status: string) {
  if (status === "ACCEPTED") {
    return <BadgeCheck className="h-4 w-4" />;
  }

  if (status === "REJECTED") {
    return <XCircle className="h-4 w-4" />;
  }

  return <Hourglass className="h-4 w-4" />;
}

export default async function RecordsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const scans = await prisma.badgeScan.findMany({
    where:
      session.role === "ADMIN"
        ? {}
        : {
            badge: {
              userId: session.id,
            },
          },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
    select: {
      id: true,
      status: true,
      createdAt: true,
      badgeId: true,
      meal: {
        select: {
          id: true,
          name: true,
        },
      },
      rfidReader: {
        select: {
          id: true,
          location: true,
        },
      },
    },
  });

  const totalScans = scans.length;
  const acceptedScans = scans.filter(
    (scan) => scan.status === "ACCEPTED",
  ).length;
  const pendingScans = scans.filter((scan) => scan.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-white">Records</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        <div className="flex items-start gap-3 mb-8">
          <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
            <ClipboardList className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Scan history</h1>
            <p className="text-sm text-gray-400">
              Showing real BadgeScan entries with status, badge, meal, reader,
              and timestamp.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-green-500" />
                Total scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{totalScans}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-green-500" />
                Accepted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{acceptedScans}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                <Hourglass className="h-4 w-4 text-yellow-400" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{pendingScans}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900 border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-950/50">
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-semibold h-12 px-6">
                    Scan
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Badge
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Meal
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Reader
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Created
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold text-right h-12 px-6">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.length === 0 ? (
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-gray-500"
                    >
                      No scans found.
                    </TableCell>
                  </TableRow>
                ) : (
                  scans.map((scan) => (
                    <TableRow
                      key={scan.id}
                      className="border-gray-800 hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="px-6 py-4 font-mono text-sm text-gray-300">
                        #{scan.id}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-mono text-sm bg-gray-950 px-2.5 py-1 rounded border border-gray-800 text-gray-300">
                          {scan.badgeId}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-300 py-4">
                        {scan.meal.name}
                      </TableCell>
                      <TableCell className="text-gray-300 py-4">
                        {scan.rfidReader.location}
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs border rounded-full px-2.5 py-1 font-medium ${getStatusStyle(scan.status)}`}
                        >
                          {getStatusIcon(scan.status)}
                          {scan.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm py-4">
                        {formatDateTime(scan.createdAt)}
                      </TableCell>
                      <TableCell className="text-right px-6 py-4">
                        <Link href={`/records/${scan.id}`}>
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
