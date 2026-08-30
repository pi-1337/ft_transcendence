"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  ArrowLeft,
  Send,
  Pencil,
  Trash2,
  History,
  X,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
};

type Item = {
  id: number;
  title: string;
  message: string;
  createdAt: Date;
  organization: {
    id: number;
    name: string;
  };
  createdBy: {
    id: number;
    firstname: string;
    lastname: string;
  };
};

type Props = {
  organizations: Org[];
  announcements: Item[];
};

export default function AnnouncementsClient({
  organizations,
  announcements: initialList,
}: Props) {
  const [list, setList] = useState<Item[]>(initialList);
  const [orgId, setOrgId] = useState<string | null>("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [delId, setDelId] = useState<number | null>(null);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const isEditing = editId !== null;

  const clearForm = () => {
    setOrgId("");
    setTitle("");
    setMessage("");
    setEditId(null);
    setError("");
    setInfo("");
  };

  const handleEdit = (item: Item) => {
    // console.log("Edit clicked for item:", item.id);
    setEditId(item.id);
    setOrgId(String(item.organization.id));
    setTitle(item.title);
    setMessage(item.message);
    setError("");
    setInfo("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || (!isEditing && !orgId)) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    setInfo("");

    try {
      const url = isEditing
        ? `/api/admin/announcements/${editId}`
        : "/api/admin/announcements";
      const method = isEditing ? "PATCH" : "POST";

      const payload = isEditing
        ? { title, message }
        : { organizationId: orgId, title, message };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Operation failed.");
        return;
      }

      if (isEditing) {
        setList((prev) =>
          prev.map((el) => (el.id === editId ? data.announcement : el)),
        );
        setInfo("Announcement updated successfully.");
      } else {
        setList((prev) => [data.announcement, ...prev]);
        setInfo("Announcement sent successfully.");
      }

      clearForm();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;

    setDelId(id);
    setError("");
    setInfo("");

    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete.");
        return;
      }

      setList((prev) => prev.filter((el) => el.id !== id));
      setInfo("Announcement deleted.");
      if (editId === id) clearForm();
    } catch {
      setError("Network error.");
    } finally {
      setDelId(null);
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
          <span className="text-white">Announcements</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10 grid gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
              <Megaphone className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Announcements</h1>
              <p className="text-sm text-gray-400">Manage system alerts.</p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm px-4 py-3 font-medium">
              {error}
            </div>
          )}
          {info && (
            <div className="rounded-lg bg-green-950/40 border border-green-800 text-green-400 text-sm px-4 py-3 font-medium">
              {info}
            </div>
          )}

          <Card className="bg-gray-900 border-gray-800">
            <form onSubmit={handleSubmit}>
              <CardHeader className="pb-4 border-b border-gray-800">
                <CardTitle className="text-gray-200 text-lg font-semibold flex items-center gap-2">
                  {isEditing ? (
                    <Pencil className="w-4 h-4 text-green-500" />
                  ) : (
                    <Send className="w-4 h-4 text-green-500" />
                  )}
                  {isEditing ? "Edit Announcement" : "New Announcement"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">
                    Organization
                  </label>
                  <Select
                    value={orgId}
                    onValueChange={(val) => setOrgId(val)}
                    disabled={isEditing}
                  >
                    <SelectTrigger className="bg-gray-950/50 border-gray-800 text-white focus:ring-green-600 disabled:opacity-50">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800 text-gray-200">
                      {organizations.map((org) => (
                        <SelectItem
                          key={org.id}
                          value={org.id}
                          className=" focus:text-white cursor-pointer"
                        >
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">
                    Title
                  </label>
                  <Input
                    type="text"
                    placeholder="Maintenance update"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">
                    Message
                  </label>
                  <Textarea
                    placeholder="System offline..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600 min-h-[120px] resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearForm}
                      className="w-12 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white px-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white gap-2"
                  >
                    {loading
                      ? "Saving..."
                      : isEditing
                        ? "Save changes"
                        : "Send"}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
        <div className="lg:col-span-8">
          <Card className="bg-gray-900 border-gray-800 overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-800 bg-gray-950/20">
              <CardTitle className="text-gray-200 text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-green-500" />
                  History
                </div>
                <span className="text-xs font-medium bg-gray-800 text-gray-400 px-2.5 py-0.5 rounded-full">
                  {list.length} Total
                </span>
              </CardTitle>
            </CardHeader>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-950/50">
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-400 font-semibold h-12 px-6">
                      Details
                    </TableHead>
                    <TableHead className="text-gray-400 font-semibold h-12">
                      Organization
                    </TableHead>
                    <TableHead className="text-gray-400 font-semibold h-12">
                      Created
                    </TableHead>
                    <TableHead className="text-right h-12 px-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.length === 0 ? (
                    <TableRow className="border-gray-800 hover:bg-transparent">
                      <TableCell
                        colSpan={4}
                        className="h-32 text-center text-gray-500"
                      >
                        No announcements found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    list.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-gray-800 hover:bg-gray-800/30 transition-colors"
                      >
                        <TableCell className="px-6 py-4 align-top">
                          <div className="flex flex-col gap-1 max-w-sm">
                            <span className="font-medium text-white">
                              {item.title}
                            </span>
                            <span className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                              {item.message}
                            </span>
                            <span className="text-gray-600 text-[10px] uppercase tracking-wider mt-1">
                              By {item.createdBy.firstname}{" "}
                              {item.createdBy.lastname}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 align-top">
                          <span className="inline-flex items-center text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded-md px-2.5 py-1">
                            {item.organization.name}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm py-4 align-top whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-6 py-4 align-top">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(item)}
                              className="h-8 w-8 bg-transparent border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                              disabled={delId === item.id}
                              className="h-8 w-8 bg-red-900/80 hover:bg-red-900 text-red-200 border border-red-800"
                            >
                              {delId === item.id ? (
                                "..."
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      </main>
    </div>
  );
}
