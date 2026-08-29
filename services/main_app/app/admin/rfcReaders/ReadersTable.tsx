"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Radio,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
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

type Reader = {
  id: number;
  location: string;
  organizationId: number;
  organization: { name: string };
};

type Props = {
  readers: Reader[];
};

export default function ReadersTable({ readers: initialReaders }: Props) {
  const [readers, setReaders] = useState(initialReaders);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this reader?")) return;

    setDeletingId(id);
    setError("");

    try {
      const res = await fetch(`/api/admin/rfcReaders/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete reader.");
        return;
      }

      setReaders((prev) => prev.filter((r) => r.id !== id));
    } catch {
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
          <span className="text-white">RFC Readers</span>
        </div>
        <Link href="/admin/rfcReaders/create">
          <Button className="bg-green-700 hover:bg-green-800 text-white h-9 px-4 gap-2">
            <Plus className="w-4 h-4" /> Add reader
          </Button>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-10">
        <div className="flex items-start gap-3 mb-8">
          <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
            <Radio className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">All RFC Readers</h1>
            <p className="text-sm text-gray-400">
              Manage {readers.length} access point readers.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm px-4 py-3 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <Card className="bg-gray-900 border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-950/50 whitespace-nowrap">
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-semibold h-12 px-6">
                    ID
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Location
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold h-12">
                    Organization
                  </TableHead>
                  <TableHead className="text-right h-12 px-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {readers.length === 0 ? (
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-gray-500"
                    >
                      No readers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  readers.map((reader) => (
                    <TableRow
                      key={reader.id}
                      className="border-gray-800 hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="px-6 py-4 font-mono text-gray-400">
                        #{reader.id}
                      </TableCell>
                      <TableCell className="py-4 font-medium text-white whitespace-nowrap">
                        {reader.location}
                      </TableCell>
                      <TableCell className="py-4 text-gray-300 whitespace-nowrap">
                        <span className="inline-flex items-center text-xs bg-gray-950 border border-gray-800 rounded-md px-2.5 py-1">
                          {reader.organization.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/rfcReaders/${reader.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 bg-transparent border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 gap-1.5"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(reader.id)}
                            disabled={deletingId === reader.id}
                            className="h-8 bg-red-900/80 hover:bg-red-900 text-red-200 border border-red-800 gap-1.5"
                          >
                            {deletingId === reader.id ? (
                              "..."
                            ) : (
                              <>
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </>
                            )}
                          </Button>
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
