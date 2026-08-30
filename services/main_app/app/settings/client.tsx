"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Save,
  KeyRound,
  ShieldCheck,
  XCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import AvatarSetting from "@/components/avatarSetting";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserFrontend = {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string | null;
  avatar: string | null;
  twoFactorEnabled?: boolean;
};

export default function Settings({ user }: { user: UserFrontend }) {
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const initialAvatar = user.avatar || "/avatars/default-avatar.png";

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    Boolean(user.twoFactorEnabled),
  );
  const [twoFactorPassword, setTwoFactorPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorStatus, setTwoFactorStatus] = useState("");
  const [twoFactorError, setTwoFactorError] = useState("");
  const [twoFactorPendingAction, setTwoFactorPendingAction] = useState<
    "enable" | "disable" | null
  >(null);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);

    if (
      !firstname.trim() ||
      !lastname.trim() ||
      !email.trim() ||
      !phoneNumber.trim()
    ) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, email, phoneNumber }),
      });

      const data = await res.json();
      const success = data.success || null;

      if (!res.ok || !success) {
        setError(data.error || "Failed to update settings.");
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const requestTwoFactorChange = async (target: "enable" | "disable") => {
    setTwoFactorLoading(true);
    setTwoFactorError("");
    setTwoFactorStatus("");

    try {
      const action = target === "enable" ? "request_enable" : "request_disable";
      const res = await fetch("/api/auth/2fa/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, password: twoFactorPassword }),
      });

      const data = await res.json();
      const success = data.success || null;

      if (!res.ok || !success) {
        setError(data.error || "Failed to update settings.");
        return;
      }

      setTwoFactorPendingAction(target);
      setTwoFactorStatus(
        `Code sent to ${data.maskedEmail || "your email"}. Enter it below to confirm.`,
      );
    } catch (err: any) {
      setTwoFactorError(err.message || "Network error. Please try again.");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const confirmTwoFactorChange = async () => {
    if (!twoFactorPendingAction) return;

    setTwoFactorLoading(true);
    setTwoFactorError("");
    setTwoFactorStatus("");

    try {
      const action =
        twoFactorPendingAction === "enable"
          ? "confirm_enable"
          : "confirm_disable";
      const res = await fetch("/api/auth/2fa/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, code: twoFactorCode }),
      });

      const data = await res.json();
      const success = data.success || null;

      if (!res.ok || !success) {
        setError(data.error || "Failed to update settings.");
        return;
      }

      setTwoFactorEnabled(Boolean(data.twoFactorEnabled));
      setTwoFactorPendingAction(null);
      setTwoFactorCode("");
      setTwoFactorPassword("");
      setTwoFactorStatus(
        data.twoFactorEnabled
          ? "Two-factor authentication is enabled."
          : "Two-factor authentication is disabled.",
      );
    } catch (err: any) {
      setTwoFactorError(err.message || "Network error. Please try again.");
    } finally {
      setTwoFactorLoading(false);
    }
  };

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
          <span className="text-white">Settings</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 mt-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Account Settings
          </h1>
          <p className="text-sm text-gray-400">
            Manage your personal information and security preferences.
          </p>
        </div>

        {saved && (
          <div className="rounded-lg bg-green-950/40 border border-green-800 text-green-400 text-sm px-4 py-3 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Settings saved successfully!
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm px-4 py-3 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
        <AvatarSetting initialAvatar={initialAvatar} />
        <Card className="bg-gray-900 border-gray-800">
          <form onSubmit={handleSavePersonalInfo}>
            <CardHeader className="pb-4 border-b border-gray-800">
              <CardTitle className="text-gray-200 text-lg font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-green-500" /> Personal Information
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      type="text"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="bg-gray-950/50 border-gray-800 text-white placeholder:text-gray-500 pl-10 focus-visible:ring-green-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      type="text"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      className="bg-gray-950/50 border-gray-800 text-white placeholder:text-gray-500 pl-10 focus-visible:ring-green-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-950/50 border-gray-800 text-white placeholder:text-gray-500 pl-10 focus-visible:ring-green-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-gray-950/50 border-gray-800 text-white placeholder:text-gray-500 pl-10 focus-visible:ring-green-600"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-950/50 border-t mt-2 border-gray-800 px-6 py-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto ml-auto bg-green-700 hover:bg-green-800 text-white gap-2"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-4 border-b border-gray-800">
            <CardTitle className="text-gray-200 text-lg font-semibold flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-green-500" /> Two-Factor
              Authentication
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center justify-between p-4 bg-gray-950/50 border border-gray-800 rounded-lg">
              <div>
                <p className="text-white text-sm font-medium flex items-center gap-2">
                  Status:
                  {twoFactorEnabled ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Enabled
                    </span>
                  ) : (
                    <span className="text-gray-400 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Disabled
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {twoFactorEnabled
                    ? "You will be asked for an email verification code when signing in"
                    : "Enable 2FA to add an email verification step to your login"}
                </p>
              </div>
            </div>

            {twoFactorStatus && (
              <div className="rounded-lg bg-green-950/40 border border-green-800 text-green-400 text-sm px-4 py-3 font-medium">
                {twoFactorStatus}
              </div>
            )}

            {twoFactorError && (
              <div className="rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm px-4 py-3 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {twoFactorError}
              </div>
            )}

            {!twoFactorPendingAction ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">
                    Current Password (Required)
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    value={twoFactorPassword}
                    onChange={(e) => setTwoFactorPassword(e.target.value)}
                    className="bg-gray-950/50 border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-green-600"
                  />
                </div>
                <div className="flex gap-3">
                  {twoFactorEnabled ? (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => requestTwoFactorChange("disable")}
                      disabled={twoFactorLoading}
                      className="bg-red-900/80 hover:bg-red-900 text-red-200 border border-red-800"
                    >
                      Disable 2FA
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => requestTwoFactorChange("enable")}
                      disabled={twoFactorLoading}
                      className="bg-green-700 hover:bg-green-800 text-white"
                    >
                      Enable 2FA
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-5 bg-gray-950/50 border border-gray-800 rounded-xl">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-400">
                    Verification Code
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="000000"
                    value={twoFactorCode}
                    onChange={(e) =>
                      setTwoFactorCode(e.target.value.replace(/\D/g, ""))
                    }
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-600 font-mono tracking-[0.25em] focus-visible:ring-green-600 text-center text-lg"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setTwoFactorPendingAction(null);
                      setTwoFactorCode("");
                      setTwoFactorError("");
                      setTwoFactorStatus("");
                    }}
                    className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={confirmTwoFactorChange}
                    disabled={twoFactorLoading || twoFactorCode.length < 4}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white"
                  >
                    Confirm {twoFactorPendingAction}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
