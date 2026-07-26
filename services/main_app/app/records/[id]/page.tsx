'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
    Activity, 
    MapPin, 
    Info, 
    CheckCircle2, 
    ArrowLeft, 
    ArrowRight,
    FileText
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data for records
const mockRecordsData: Record<string, any> = {
    '1': {
        id: 1,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        orgId: 1,
        action: 'Entry',
        timestamp: new Date('2024-01-20 10:30:00'),
        location: 'Main Entrance',
        reader: 'RFID-Reader-001',
        status: 'Success'
    },
    '2': {
        id: 2,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        orgId: 1,
        action: 'Exit',
        timestamp: new Date('2024-01-20 17:00:00'),
        location: 'Main Entrance',
        reader: 'RFID-Reader-001',
        status: 'Success'
    },
    '3': {
        id: 3,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        orgId: 1,
        action: 'Entry',
        timestamp: new Date('2024-01-21 09:15:00'),
        location: 'Side Entrance',
        reader: 'RFID-Reader-002',
        status: 'Success'
    },
    '4': {
        id: 4,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        orgId: 1,
        action: 'Exit',
        timestamp: new Date('2024-01-21 18:45:00'),
        location: 'Main Entrance',
        reader: 'RFID-Reader-001',
        status: 'Success'
    },
    '5': {
        id: 5,
        badgeNumber: 'BADGE-002',
        orgName: 'Tech Startup Inc',
        orgId: 2,
        action: 'Entry',
        timestamp: new Date('2024-01-22 08:00:00'),
        location: 'Front Desk',
        reader: 'RFID-Reader-003',
        status: 'Success'
    },
    '6': {
        id: 6,
        badgeNumber: 'BADGE-002',
        orgName: 'Tech Startup Inc',
        orgId: 2,
        action: 'Exit',
        timestamp: new Date('2024-01-22 17:30:00'),
        location: 'Front Desk',
        reader: 'RFID-Reader-003',
        status: 'Success'
    },
    '7': {
        id: 7,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        orgId: 1,
        action: 'Entry',
        timestamp: new Date('2024-01-22 09:00:00'),
        location: 'Main Entrance',
        reader: 'RFID-Reader-001',
        status: 'Success'
    },
    '8': {
        id: 8,
        badgeNumber: 'BADGE-001',
        orgName: 'Acme Corporation',
        orgId: 1,
        action: 'Exit',
        timestamp: new Date('2024-01-22 18:00:00'),
        location: 'Main Entrance',
        reader: 'RFID-Reader-001',
        status: 'Success'
    }
};

export default function RecordDetails() {
    const params = useParams();
    const recordId = params.id as string;
    const record = mockRecordsData[recordId];
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
                        <h1 className="text-2xl font-bold text-white mb-2">Record Not Found</h1>
                        <p className="text-gray-400 mb-6 text-sm">The record you are looking for doesn't exist or has been removed.</p>
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
                    Record #{record.id}
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 mt-10">
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-3xl font-bold text-white">Record #{record.id}</h1>
                        <span className={`inline-flex items-center text-xs border rounded-full px-3 py-1 font-semibold ${
                            record.action === 'Entry'
                                ? 'bg-green-950/40 text-green-400 border-green-800/50'
                                : 'bg-red-950/40 text-red-400 border-red-800/50'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${record.action === 'Entry' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {record.action}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                        <span className="text-gray-300 font-mono">{record.badgeNumber}</span> 
                        <span className="text-gray-600">•</span> 
                        <span>{record.orgName}</span>
                    </p>
                </div>

                <div className="grid gap-6">
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-gray-400 text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                                <Activity className="w-4 h-4 text-green-600" />
                                Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 bg-gray-950/50 p-4 rounded-lg border border-gray-800/50">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                <span className="text-xl font-bold text-white">{record.status}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader className="pb-4 border-b border-gray-800">
                            <CardTitle className="text-gray-400 text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                                <Info className="w-4 h-4 text-green-600" />
                                Record Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">Record ID</span>
                                    <span className="text-white font-mono font-medium">#{record.id}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">Badge Number</span>
                                    <span className="text-white font-mono bg-gray-950 px-2.5 py-1 rounded border border-gray-800 text-sm">{record.badgeNumber}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">Organization</span>
                                    <Link href={`/organizations/${record.orgId}`} className="text-white font-medium hover:text-green-400 transition-colors flex items-center gap-1">
                                        {record.orgName} <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">Action Type</span>
                                    <span className="text-white font-medium">{record.action}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">Timestamp</span>
                                    <span className="text-white font-medium">{record.timestamp.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader className="pb-4 border-b border-gray-800">
                            <CardTitle className="text-gray-400 text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-green-600" />
                                Access Point Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">Location</span>
                                    <span className="text-white font-medium">{record.location}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-950/30 rounded-lg transition-colors gap-1">
                                    <span className="text-gray-400 text-sm">RFID Reader</span>
                                    <span className="text-gray-300 font-mono text-sm bg-gray-950 px-2.5 py-1 rounded border border-gray-800">{record.reader}</span>
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
                    <Link href={`/badge`}>
                        <Button variant="outline" className="bg-gray-900 border-gray-800 text-white hover:bg-gray-800 h-10 px-6">
                            View Badge
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}