"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function LoginForm({ ftAuthUrl }: { ftAuthUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "an error occurgreen!");
        return;
      }
      if (data.requiresTwoFactor) {
        router.push("/auth/2fa");
        return;
      }
      if (data.success) {
        if (data.user?.role === "ADMIN") router.push("/admin/dashboard");
        else router.push("/dashboard");
        return;
      }
      setError("Unexpected login response.");
    } catch {
      setError("Network error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-6">
        <Card className="w-full max-w-sm bg-gray-900">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Welcom back
            </CardTitle>
            <div className="flex items-center justify-between gap-2">
              <p className="text-gray-400 text-sm">
                Don't you have an account?
              </p>
              <Link
                href="/auth/register"
                className="text-gray-300 hover:text-white transition text-sm font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="mb-4 rounded-lg border border-green-700 bg-green-950/40 px-4 py-3 text-sm text-green-300">
                {error}
              </div>
            ) : null}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <label className="text-sm text-white" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Image
                    src="/email.png"
                    alt="email icon"
                    width={16}
                    height={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 brightness-150"
                  />
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-600 rounded-lg w-full h-10 pl-10 bg-gray-800 text-white"
                    type="email"
                    placeholder="Bandit@example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white" htmlFor="pass">
                  Password
                </label>
                <div className="relative">
                  <Image
                    src="/lock.png"
                    alt="user icon"
                    width={16}
                    height={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 brightness-150"
                  />
                  <Input
                    id="pass"
                    className="border border-gray-600 rounded-lg w-full h-10 pl-10 pr-10 bg-gray-800 pt-3 text-white"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-700 hover:bg-green-800 w-full h-12 mt-6 text-lg"
                size="lg"
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>
            <div className="flex items-center gap-2 mt-3">
              <div className="h-px flex-1 bg-gray-800 my-4"></div>
              <p className="text-gray-400 font-bold text-xs">
                OR CONTINUE WITH
              </p>
              <div className="h-px flex-1 bg-gray-800 my-4"></div>
            </div>
            <div className="flex items-center justify-center mt-2 mb-3 gap-6 w-full">
              <Link href={ftAuthUrl} className="w-full sm:w-64">
                <Button
                  type="button"
                  className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-800"
                >
                  42 Auth
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap px-3">
          <a className="text-sm text-gray-400" href="/auth/privacy-policy">
            Privacy Policy
          </a>
          <a className="text-sm text-gray-400" href="/auth/terms-of-service">
            Terms of service
          </a>
        </div>
      </main>
    </div>
  );
}
