import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-10">
        <Card className="w-full max-w-3xl bg-gray-900 border-gray-800">
          <CardHeader className="border-b border-gray-800 pb-6 mb-6">
            <CardTitle className="text-3xl font-bold text-white">
              Terms of Service
            </CardTitle>
            <p className="text-gray-400 text-sm mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6 text-sm leading-relaxed">
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-400">
                By accessing and using this Badging System, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this system's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. User Accounts & Security</h2>
              <ul className="list-disc pl-5 text-gray-400 space-y-2">
                <li>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</li>
                <li>You must provide accurate and complete information when creating an account.</li>
                <li>You may not use as a username the name of another person or entity or that is not lawfully available for use.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Badging Rules & Integrity</h2>
              <p className="text-gray-400">
                The core functionality of this platform is to award digital badges based on user achievements. By using this platform, you agree to:
              </p>
              <ul className="list-disc pl-5 mt-2 text-gray-400 space-y-2">
                <li>Earn badges through legitimate means as defined by the platform administrators.</li>
                <li>Not exploit bugs, vulnerabilities, or loopholes to artificially inflate your badge count or progress.</li>
                <li>Acknowledge that administrators reserve the right to revoke badges or suspend accounts if malicious activity, cheating, or manipulation is detected.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Intellectual Property</h2>
              <p className="text-gray-400">
                The Service and its original content (excluding Content provided by users), features, badge designs, and functionality are and will remain the exclusive property of the platform developers and its licensors.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Termination</h2>
              <p className="text-gray-400">
                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}