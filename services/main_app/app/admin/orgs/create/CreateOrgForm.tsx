"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Plus, AlertCircle } from "lucide-react";
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

type FieldErrors = {
  name?: string;
  type?: string;
  service?: string;
  badgeTimes?: string;
  callbackUrl?: string;
};

export default function CreateOrgForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [service, setService] = useState("");
  const [badgeTimes, setBadgeTimes] = useState("");
  const [active, setActive] = useState<"TRUE" | "FALSE">("FALSE");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const e: FieldErrors = {};
    let isValid = true;

    if (!name.trim()) e.name = "Name is required.";
    if (!type.trim()) e.type = "Type is required.";
    if (!service.trim()) e.service = "Service is required.";

    const bt = parseInt(badgeTimes);
    if (isNaN(bt) || bt < 1) {
      e.badgeTimes = "Must be a positive integer.";
    }

    if (callbackUrl && !/^https?:\/\/.+/.test(callbackUrl)) {
      e.callbackUrl = "Must be a valid URL starting with http(s)://.";
    }

    if (Object.keys(e).length > 0) isValid = false;
    setErrors(e);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/orgs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type: type.trim(),
          service: service.trim(),
          badgeTimes: parseInt(badgeTimes),
          active,
          callBackURL: callbackUrl.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Failed to create organization.");
        return;
      }

      router.push("/admin/orgs");
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link
          href="/admin/orgs"
          className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Organizations
        </Link>
        <span className="text-gray-700">/</span>
        <span className="text-white text-sm font-medium">Create org</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 mt-10">
        <div className="flex items-start gap-3 mb-8">
          <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
            <Building2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Create new organization
            </h1>
            <p className="text-sm text-gray-400">
              Add a new organization to the system
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
              <CardTitle className="text-gray-200 text-lg font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-green-500" /> Organization
                Details
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">
                  Name
                </label>
                <Input
                  type="text"
                  placeholder="Acme Corp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`bg-gray-950/50 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-green-600 ${errors.name ? "border-red-500 focus-visible:ring-red-600" : ""}`}
                />
                {errors.name && (
                  <span className="text-red-400 text-xs font-medium">
                    {errors.name}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">
                    Type
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. NGO"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={`bg-gray-950/50 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-green-600 ${errors.type ? "border-red-500 focus-visible:ring-red-600" : ""}`}
                  />
                  {errors.type && (
                    <span className="text-red-400 text-xs font-medium">
                      {errors.type}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">
                    Service
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Healthcare"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className={`bg-gray-950/50 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-green-600 ${errors.service ? "border-red-500 focus-visible:ring-red-600" : ""}`}
                  />
                  {errors.service && (
                    <span className="text-red-400 text-xs font-medium">
                      {errors.service}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">
                    Badge times
                  </label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="1"
                    value={badgeTimes}
                    onChange={(e) => setBadgeTimes(e.target.value)}
                    className={`bg-gray-950/50 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-green-600 ${errors.badgeTimes ? "border-red-500 focus-visible:ring-red-600" : ""}`}
                  />
                  {errors.badgeTimes && (
                    <span className="text-red-400 text-xs font-medium">
                      {errors.badgeTimes}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">
                    Status
                  </label>
                  <Select
                    value={active}
                    onValueChange={(val) => setActive(val as "TRUE" | "FALSE")}
                  >
                    <SelectTrigger className="bg-gray-950/50 border-gray-800 text-white focus:ring-green-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800 text-gray-200">
                      <SelectItem
                        value="TRUE"
                        className="focus:bg-gray-800 focus:text-white cursor-pointer text-green-400"
                      >
                        Active
                      </SelectItem>
                      <SelectItem
                        value="FALSE"
                        className="focus:bg-gray-800 focus:text-white cursor-pointer"
                      >
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">
                  Callback URL{" "}
                  <span className="text-gray-600 font-normal">(optional)</span>
                </label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={callbackUrl}
                  onChange={(e) => setCallbackUrl(e.target.value)}
                  className={`bg-gray-950/50 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-green-600 ${errors.callbackUrl ? "border-red-500 focus-visible:ring-red-600" : ""}`}
                />
                {errors.callbackUrl && (
                  <span className="text-red-400 text-xs font-medium">
                    {errors.callbackUrl}
                  </span>
                )}
              </div>
            </CardContent>

            <CardFooter className="bg-gray-950/50 border-t border-gray-800 mt-2 px-6 py-4 flex gap-3">
              <Link href="/admin/orgs" className="flex-1">
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
                    <Plus className="w-4 h-4" /> Create organization
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
