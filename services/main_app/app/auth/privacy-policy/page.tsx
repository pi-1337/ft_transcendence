import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-10">
        <Card className="w-full max-w-3xl bg-gray-900 border-gray-800">
          <CardHeader className="border-b border-gray-800 pb-6 mb-6">
            <CardTitle className="text-3xl font-bold text-white">
              Privacy Policy
            </CardTitle>
            <p className="text-gray-400 text-sm mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-6 text-sm leading-relaxed">
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
              <p className="text-gray-400">
                Welcome to our Badging System. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and use our badging application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Data We Collect</h2>
              <p className="text-gray-400 mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
              <ul className="list-disc pl-5 text-gray-400 space-y-2">
                <li><strong>Identity Data:</strong> First name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> Email address.</li>
                <li><strong>Technical Data:</strong> Internet protocol (IP) address, your login data, browser type and version.</li>
                <li><strong>Profile Data:</strong> Your 42 Intra profile data, badges earned, progress, and system preferences.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Data</h2>
              <p className="text-gray-400">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-5 mt-2 text-gray-400 space-y-2">
                <li>To register you as a new user and manage your account.</li>
                <li>To process and deliver your digital badges and track your achievements.</li>
                <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
                <li>To administer and protect our business and this website (including troubleshooting, data analysis, and system maintenance).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
              <p className="text-gray-400">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}