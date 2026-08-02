"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, BadgePlus, Building2, IdCard, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Organization = {
  id: number;
  name: string;
  type: string;
  service: string;
  active: "TRUE" | "FALSE";
};

type Props = {
  organizations: Organization[];
};

export default function BadgeManagerClient({ organizations }: Props) {
  const [email, setEmail] = useState("");
  const [orgId, setOrgId] = useState<number | "">(organizations[0]?.id ?? "");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [createdBadge, setCreatedBadge] = useState("");
  const [deletedBadge, setDeletedBadge] = useState("");

  const handleCreateBadge = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError("");
    setCreatedBadge("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || orgId === "") {
      setCreateError("Email and organization are required.");
      return;
    }

    setCreateLoading(true);

    try {
      const response = await fetch("/api/badge/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, orgId }),
      });

      const result = await response.json();

      if (!response.ok) {
        setCreateError(result.error || "Failed to create badge.");
        return;
      }

      setCreatedBadge(
        result.data?.badgeNumber || "Badge created successfully.",
      );
      setEmail("");
    } catch {
      setCreateError("Network error. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteBadge = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDeleteError("");
    setDeletedBadge("");

    const trimmedBadgeNumber = badgeNumber.trim();
    if (!trimmedBadgeNumber) {
      setDeleteError("Badge number is required.");
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch("/api/badge/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badgeNumber: trimmedBadgeNumber }),
      });

      const result = await response.json();

      if (!response.ok) {
        setDeleteError(result.error || "Failed to delete badge.");
        return;
      }

      setDeletedBadge(trimmedBadgeNumber);
      setBadgeNumber("");
    } catch {
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      <header className="border-b border-gray-800 bg-gray-950/95 backdrop-blur px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-white">Badge management</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
            <IdCard className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Badge management</h1>
            <p className="text-sm text-gray-400">
              Issue a badge with a user email and organization ID, or revoke an
              existing badge number.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <BadgePlus className="w-5 h-5 text-green-500" />
                  Create badge
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {createError && (
                  <div className="mb-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-sm px-4 py-3">
                    {createError}
                  </div>
                )}

                {createdBadge && (
                  <div className="mb-4 rounded-lg bg-green-950/40 border border-green-800/60 text-green-300 text-sm px-4 py-3">
                    Badge created successfully. Number: {createdBadge}
                  </div>
                )}

                <form
                  onSubmit={handleCreateBadge}
                  className="space-y-4"
                  noValidate
                >
                  <div className="space-y-1.5">
                    <label className="text-gray-400 text-sm">User email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="user@example.com"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-600 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 text-sm">
                      Organization
                    </label>
                    <select
                      value={orgId}
                      onChange={(event) =>
                        setOrgId(
                          event.target.value ? Number(event.target.value) : "",
                        )
                      }
                      disabled={organizations.length === 0}
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-600 transition-colors disabled:opacity-60"
                    >
                      {organizations.length === 0 ? (
                        <option value="">No organizations available</option>
                      ) : (
                        organizations.map((organization) => (
                          <option key={organization.id} value={organization.id}>
                            #{organization.id} - {organization.name}
                          </option>
                        ))
                      )}
                    </select>
                    <p className="text-xs text-gray-500">
                      The backend will only issue a badge if the user already
                      belongs to the selected organization.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={createLoading || organizations.length === 0}
                    className="bg-green-700 hover:bg-green-800 text-white w-full"
                  >
                    {createLoading ? "Creating..." : "Create badge"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <Trash2 className="w-5 h-5 text-red-500" />
                  Delete badge
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {deleteError && (
                  <div className="mb-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-sm px-4 py-3">
                    {deleteError}
                  </div>
                )}

                {deletedBadge && (
                  <div className="mb-4 rounded-lg bg-green-950/40 border border-green-800/60 text-green-300 text-sm px-4 py-3">
                    Badge deleted successfully. Number: {deletedBadge}
                  </div>
                )}

                <form
                  onSubmit={handleDeleteBadge}
                  className="space-y-4"
                  noValidate
                >
                  <div className="space-y-1.5">
                    <label className="text-gray-400 text-sm">
                      Badge number
                    </label>
                    <input
                      type="text"
                      value={badgeNumber}
                      onChange={(event) => setBadgeNumber(event.target.value)}
                      placeholder="Enter badge number"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={deleteLoading}
                    className="w-full bg-red-700 hover:bg-red-800 text-white"
                  >
                    {deleteLoading ? "Deleting..." : "Delete badge"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-800 h-fit">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <Building2 className="w-5 h-5 text-green-500" />
                Available organizations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {organizations.length === 0 ? (
                <p className="text-sm text-gray-500">No organizations found.</p>
              ) : (
                organizations.map((organization) => (
                  <div
                    key={organization.id}
                    className="rounded-lg border border-gray-800 bg-gray-950/60 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {organization.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {organization.type} · {organization.service}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                          organization.active === "TRUE"
                            ? "border-green-800/60 bg-green-950/40 text-green-300"
                            : "border-gray-700 bg-gray-900 text-gray-500"
                        }`}
                      >
                        {organization.active === "TRUE" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Organization ID: {organization.id}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
