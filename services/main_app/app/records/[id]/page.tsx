import Link from 'next/link';
import { redirect } from 'next/navigation';
import { 
    Activity,
    ArrowLeft,
    BadgeCheck,
    Clock3,
    Hourglass,
    Info,
    MapPin,
    XCircle,
    FileText
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/sessionManage';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
function formatDateTime(value: Date) {
    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(value);
}

function getStatusStyle(status: string) {
    if (status === 'ACCEPTED') {
        return 'bg-green-950/40 text-green-400 border-green-800/50';
    }

    if (status === 'REJECTED') {
        return 'bg-red-950/40 text-red-400 border-red-800/50';
    }

    return 'bg-yellow-950/40 text-yellow-300 border-yellow-800/50';
}

function getStatusIcon(status: string) {
    if (status === 'ACCEPTED') {
        return <BadgeCheck className="w-6 h-6 text-green-500" />;
    }

    if (status === 'REJECTED') {
        return <XCircle className="w-6 h-6 text-red-500" />;
    }

    return <Hourglass className="w-6 h-6 text-yellow-400" />;
}

type Params = {
    params: Promise<{ id: string }>;
};

export default async function RecordDetails({ params }: Params) {
    const session = await getSession();

    if (!session) {
        redirect('/auth/login');
    }

    const { id: rawId } = await params;
    const recordId = Number.parseInt(rawId, 10);

    if (Number.isNaN(recordId) || recordId <= 0) {
        redirect('/records');
    }

    const record = await prisma.badgeScan.findFirst({
        where:
            session.role === 'ADMIN'
                ? { id: recordId }
                : {
                    id: recordId,
                    badge: {
                        userId: session.id,
                    },
                },
        select: {
            id: true,
            status: true,
            createdAt: true,
            badgeId: true,
            meal: {
                select: {
                    id: true,
                    name: true,
                    organization: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            rfidReader: {
                select: {
                    id: true,
                    location: true,
                    organization: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!record) {
        return (
            <div className="min-h-screen bg-gray-950 text-white pb-12">
                <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Link href="/records" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Records
                        </Link>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-6 py-12 flex items-center justify-center min-h-[60vh]">
                    <Card className="bg-gray-900 border-gray-800 text-center py-10 px-6 max-w-md w-full">
                        <div className="w-16 h-16 bg-gray-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
                            <FileText className="w-8 h-8 text-gray-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Scan not found</h1>
                        <p className="text-gray-400 mb-6 text-sm">The scan does not exist or you do not have access to it.</p>
                        <Link href="/records">
                            <Button className="bg-green-700 hover:bg-green-800 text-white w-full">
                                Back to Records
                            </Button>
                        </Link>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-12">
            <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2 text-sm font-medium">
                    Scan #{record.id}
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 mt-10">
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-2 flex-wrap">
                        <h1 className="text-3xl font-bold text-white">Scan #{record.id}</h1>
                        <span className={`inline-flex items-center gap-2 text-xs border rounded-full px-3 py-1 font-semibold ${getStatusStyle(record.status)}`}>
                            {getStatusIcon(record.status)}
                            {record.status}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm font-medium flex items-center gap-2 flex-wrap">
                        <span className="text-gray-300 font-mono">{record.badgeId}</span>
                        <span className="text-gray-600">•</span>
                        <span>{record.meal.organization.name}</span>
                    </p>
                </div>

                <div className="grid gap-6">
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader className="pb-4 border-b border-gray-800">
                            <CardTitle className="text-gray-400 text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                                <Activity className="w-4 h-4 text-green-600" />
                                Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 bg-gray-950/50 p-4 rounded-lg border border-gray-800/50">
                                {getStatusIcon(record.status)}
                                <span className="text-xl font-bold text-white">{record.status}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader className="pb-4 border-b border-gray-800">
                            <CardTitle className="text-gray-400 text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                                <Info className="w-4 h-4 text-green-600" />
                                Scan details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">Scan ID</span>
                                    <span className="text-white font-mono font-medium">#{record.id}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">Badge</span>
                                    <span className="text-white font-mono bg-gray-950 px-2.5 py-1 rounded border border-gray-800 text-sm">{record.badgeId}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">Meal</span>
                                    <span className="text-white font-medium">{record.meal.name}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">Reader location</span>
                                    <span className="text-white font-medium">{record.rfidReader.location}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">Created at</span>
                                    <span className="text-white font-medium flex items-center gap-2">
                                        <Clock3 className="w-4 h-4 text-gray-500" />
                                        {formatDateTime(record.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader className="pb-4 border-b border-gray-800">
                            <CardTitle className="text-gray-400 text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-green-600" />
                                Access point
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">Reader ID</span>
                                    <span className="text-gray-300 font-mono text-sm bg-gray-950 px-2.5 py-1 rounded border border-gray-800">#{record.rfidReader.id}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">Location</span>
                                    <span className="text-white font-medium">{record.rfidReader.location}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                    <Link href="/records">
                        <Button variant="outline" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-10 px-6">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Records
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}