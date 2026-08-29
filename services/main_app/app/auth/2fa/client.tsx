"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TwoFactorClient() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(
    "Enter the verification code sent to your email.",
  );

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length < 4) {
      setError("Please enter a valid code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code.");
        return;
      }

      if (data.user?.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResending(true);

    try {
      const res = await fetch("/api/auth/2fa/resend", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        if (data.retryAfter) {
          setError(
            `Please wait ${data.retryAfter}s before requesting another code.`,
          );
        } else {
          setError(data.error || "Could not resend code.");
        }
        return;
      }

      setInfo(`A new code was sent to ${data.maskedEmail ?? "your email"}.`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800 shadow-2xl">
        <CardHeader className="pb-4 border-b border-gray-800 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-green-950/50 border border-green-900/50 rounded-full flex items-center justify-center">
            <KeyRound className="w-6 h-6 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Two-Step Verification
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-5">
          {info && !error && (
            <div className="rounded-lg bg-gray-950 border border-gray-800 text-gray-400 text-sm px-4 py-3 text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> {info}
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm px-4 py-3 font-medium flex items-center justify-center gap-2 text-center">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form id="2fa-form" onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                inputMode="numeric"
                maxLength={8}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-gray-950/50 border-gray-800 text-white placeholder:text-gray-600 font-mono tracking-[0.5em] text-center text-2xl h-14 focus-visible:ring-green-600"
                placeholder="000000"
                required
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 px-6 pb-8 bg-transparent border-t-0">
          <Button
            type="submit"
            form="2fa-form"
            disabled={loading || code.length < 6}
            className="w-full bg-green-700 hover:bg-green-800 text-white h-12 text-base font-semibold gap-2"
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                Verify <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleResend}
            disabled={resending || loading}
            className="w-full bg-transparent border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 h-12"
          >
            {resending ? (
              "Sending..."
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 mr-2" /> Resend code
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
