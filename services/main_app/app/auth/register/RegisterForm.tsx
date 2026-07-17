"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { get42OAuthURL } from "@/lib/42school_Oauth";
export default function RegisterForm({ ftAuthUrl }: { ftAuthUrl: string }) {
  const router = useRouter();
  const ft_auth_url = get42OAuthURL();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          phoneNumber,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "An error occurred!");
        setLoading(false);
        return;
      }

      if (data.success) {
        router.push("/auth/login");
      }
    } catch {
      setError("Network error. Try again!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-6">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Create an Account
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-400 text-sm">Already have an account?</p>
              <Link
                href="/auth/login"
                className="text-gray-300 hover:text-white transition text-sm font-medium"
              >
                Log In
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="mb-4 rounded-lg border border-green-700 bg-green-950/40 px-4 py-3 text-sm text-green-300">
                {error}
              </div>
            ) : null}
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm text-white" htmlFor="firstname">
                    First Name
                  </label>
                  <Input
                    id="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="border border-gray-600 rounded-lg w-full h-10 bg-gray-800 text-white"
                    placeholder="Bandit"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-white" htmlFor="lastname">
                    Last Name
                  </label>
                  <Input
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="border border-gray-600 rounded-lg w-full h-10 bg-gray-800 text-white"
                    placeholder="Klm"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white" htmlFor="email">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-600 rounded-lg w-full h-10 bg-gray-800 text-white"
                  placeholder="bandit@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border border-gray-600 rounded-lg w-full h-10 bg-gray-800 text-white"
                  placeholder="+212600000000"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-600 rounded-lg w-full h-10 bg-gray-800 text-white"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-green-700 hover:bg-green-800 w-full h-12 mt-4 text-lg text-white"
              >
                {loading ? "Creating account..." : "Sign Up"}
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

            <div className="mt-6 text-center text-xs text-gray-500">
              By signing up, you agree to our{" "}
              <Link
                href="/auth/terms-of-service"
                className="underline hover:text-gray-300"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/auth/privacy-policy"
                className="underline hover:text-gray-300"
              >
                Privacy Policy
              </Link>
              .
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
