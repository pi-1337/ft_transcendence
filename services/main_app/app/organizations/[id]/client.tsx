'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Building2, Users, Shield, ArrowLeft, Settings, Activity, BarChart3, Calendar } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Org = {
    id: number,
    name: string,
    type: string,
    service: string,
    badgeTimes: number,
    active: string,
    createdAt: Date,
    members: number,
    badges: number,
    isOrgAdmin: boolean,
};

export default function OrgDetails({ orgs }: { orgs: Org[] }) {
    const params = useParams<{ id: string }>();
    const org = orgs.find(org => org.id === parseInt(params.id));

    if (!org) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
                <Building2 className="w-12 h-12 text-gray-800 mb-4" />
                <h1 className="text-2xl font-semibold mb-2">Organization not found</h1>
                <Link href="/organizations" className="text-green-500 hover:text-green-400 font-medium">
                    Back to Organizations
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-12">
            <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Link href="/organizations" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Organizations
                    </Link>
                    <span className="text-gray-700">/</span>
                    <span className="text-white">{org.name}</span>
                </div>
                
                {org.isOrgAdmin && (
                    <div className="flex items-center gap-2 overflow-x-auto">
                        <Link href={`/organizations/${org.id}/scans`}>
                            <Button variant="outline" size="sm" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-8 gap-1.5">
                                <Activity className="w-3.5 h-3.5" /> Scans
                            </Button>
                        </Link>
                        <Link href={`/organizations/${org.id}/analytics`}>
                            <Button variant="outline" size="sm" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-8 gap-1.5">
                                <BarChart3 className="w-3.5 h-3.5" /> Analytics
                            </Button>
                        </Link>
                        <Link href={`/organizations/${org.id}/edit`}>
                            <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white h-8 gap-1.5">
                                <Settings className="w-3.5 h-3.5" /> Edit
                            </Button>
                        </Link>
                    </div>
                )}
            </header>

            <main className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
                {/* Organization Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-950/30 rounded-xl border border-green-900/50">
                        <Building2 className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{org.name}</h1>
                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Active
                            </span>
                            • Joined {new Date(org.createdAt).toLocaleDateString('en-GB')}
                        </p>
                    </div>
                </div>

                {/* Organization Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                            <Building2 className="w-5 h-5 text-gray-500 mb-2" />
                            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Type</p>
                            <p className="text-2xl font-bold text-white">{org.type}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                            <Users className="w-5 h-5 text-gray-500 mb-2" />
                            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Members</p>
                            <p className="text-2xl font-bold text-white">{org.members}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                            <Shield className="w-5 h-5 text-gray-500 mb-2" />
                            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Badges</p>
                            <p className="text-2xl font-bold text-white">{org.badges}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Organization Details List */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-800">
                            <div className="flex justify-between items-center p-6">
                                <span className="text-gray-400 font-medium">Service</span>
                                <span className="text-white font-medium">{org.service}</span>
                            </div>
                            <div className="flex justify-between items-center p-6">
                                <span className="text-gray-400 font-medium">Badge Times</span>
                                <span className="text-white font-medium">{org.badgeTimes}</span>
                            </div>
                            <div className="flex justify-between items-center p-6">
                                <span className="text-gray-400 font-medium">Status</span>
                                <span className="inline-flex items-center gap-1.5 text-sm bg-green-950/40 text-green-400 border border-green-800/50 rounded-full px-3 py-1 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Active
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-6">
                                <span className="text-gray-400 font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Created
                                </span>
                                <span className="text-white font-medium">
                                    {new Date(org.createdAt).toLocaleDateString('en-GB')}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}