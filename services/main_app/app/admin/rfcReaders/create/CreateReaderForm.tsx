"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Radio, Plus, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Org = { id: number; name: string };

type Props = {
  organizations: Org[];
};

export default function CreateReaderForm({ organizations }: Props) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [organizationId, setOrganizationId] = useState(
    String(organizations[0]?.id ?? ""),
  );
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location.trim() || !organizationId) {
      setServerError("Location and Organization are required.");
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("/api/admin/rfcReaders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: location.trim(),
          organizationId: Number(organizationId),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Failed to create reader.");
        return;
      }

      router.push("/admin/rfcReaders");
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/admin/rfcReaders"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> RFC Readers
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-white">Add Reader</span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 mt-10">
        <div className="flex items-start gap-3 mb-8">
          <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
            <Radio className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Create new RFC reader
            </h1>
            <p className="text-sm text-gray-400">
              Add a new access point configuration.
            </p>
          </div>
        </div>

        {serverError && (
          <div className="mb-6 rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm px-4 py-3 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {serverError}
          </div>
        )}

        <Card className="bg-gray-900 border-gray-800">
          <form onSubmit={handleSubmit} noValidate>
            <CardHeader className="pb-4 border-b border-gray-800">
              <CardTitle className="text-gray-200 text-lg font-semibold">
                Reader Details
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Main Entrance"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-gray-950/50 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-green-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">
                  Organization
                </label>
                <Select
                  value={organizationId}
                  onValueChange={(val) => setOrganizationId(val || "")}
                >
                  <SelectTrigger className="bg-gray-950/50 border-gray-800 text-white focus:ring-green-600">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-gray-200 max-h-60">
                    {organizations.map((org) => (
                      <SelectItem
                        key={org.id}
                        value={String(org.id)}
                        className="focus:bg-gray-800 focus:text-white cursor-pointer"
                      >
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-950/50 border-t border-gray-800 px-6 py-4 flex gap-3">
              <Link href="/admin/rfcReaders" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white gap-2"
              >
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Create reader
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
