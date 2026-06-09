'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Shield, ChevronLeft, ClipboardList, Building2, Tag, Calendar, MapPin, Radio, CheckCircle2, ArrowRight, Activity, Award } from 'lucide-react';

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
            <div className="min-h-screen bg-[#030712] text-white font-sans">
                {/* Top bar */}
                <header className="border-b border-gray-800 bg-[#030712]/80 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/records" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-all group">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Records
                        </Link>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-8 py-24 flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="bg-red-500/10 p-4 rounded-3xl border border-red-500/20 inline-block mb-6">
                            <Shield className="w-12 h-12 text-red-500" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-4">Record not found</h1>
                        <p className="text-gray-500 mb-8">The access record you are looking for does not exist or has been removed.</p>
                        <Link href="/records" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-8 py-3.5 transition-all shadow-xl shadow-indigo-500/20">
                            Back to Records
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030712] text-white font-sans">
            {/* Top bar */}
            <header className="border-b border-gray-800 bg-[#030712]/80 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/records" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-all group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Records
                    </Link>
                    <div className="w-px h-4 bg-gray-800" />
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-500" />
                        <span className="text-white font-bold tracking-tight text-sm uppercase">Record #{record.id}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-8 py-12">
                {/* Header Section */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
                            <ClipboardList className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black tracking-tight">Record #{record.id}</h1>
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                                    record.action === 'Entry'
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                }`}>
                                    <span className={`w-1 h-1 rounded-full ${record.action === 'Entry' ? 'bg-green-400' : 'bg-orange-400'}`} />
                                    {record.action}
                                </span>
                            </div>
                            <p className="text-gray-500 mt-1 font-mono text-sm tracking-wide">{record.badgeNumber} • {record.orgName}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8">
                    {/* Status Card */}
                    <div className="bg-[#0b1120]/50 border border-gray-800 rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[60px] rounded-full pointer-events-none" />
                        
                        <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <span className="w-1 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            System Status
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <span className="text-2xl font-black text-white tracking-tight">{record.status}</span>
                                <p className="text-xs text-gray-500 mt-0.5">Authentication verified by secure gateway</p>
                            </div>
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="bg-[#0b1120]/50 border border-gray-800 rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
                        
                        <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                            <span className="w-1 h-3 bg-indigo-500 rounded-full" />
                            Record Details
                        </h2>
                        
                        <div className="space-y-6">
                            {[
                                { label: 'Record ID', value: `#${record.id}`, icon: Tag, font: 'font-mono text-indigo-400' },
                                { label: 'Badge Number', value: record.badgeNumber, icon: Tag, font: 'font-mono text-white font-bold' },
                                { label: 'Organization', value: record.orgName, icon: Building2, font: 'text-white font-bold', link: `/organizations/${record.orgId}` },
                                { label: 'Action Type', value: record.action, icon: Activity, font: 'text-white font-bold' },
                                { label: 'Timestamp', value: record.timestamp.toLocaleString(), icon: Calendar, font: 'text-gray-300' }
                            ].map((item, idx) => (
                                <div key={item.label}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-800">
                                                <item.icon className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider">{item.label}</span>
                                        </div>
                                        <div className={item.font}>
                                            {item.link ? (
                                                <Link href={item.link} className="hover:text-indigo-400 flex items-center gap-1.5 transition-colors group/link">
                                                    {item.value}
                                                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                                </Link>
                                            ) : (
                                                item.value
                                            )}
                                        </div>
                                    </div>
                                    {idx < 4 && <div className="h-px bg-gray-800/50 mt-6" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Access Point Info Card */}
                    <div className="bg-[#0b1120]/50 border border-gray-800 rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                            <span className="w-1 h-3 bg-blue-500 rounded-full" />
                            Access Point Information
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="p-5 rounded-3xl bg-gray-900/30 border border-gray-800/50 hover:border-gray-700 transition-colors group/box">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover/box:scale-110 transition-transform">
                                        <MapPin className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Location</span>
                                </div>
                                <span className="text-lg font-bold text-white block ml-1">{record.location}</span>
                            </div>
                            
                            <div className="p-5 rounded-3xl bg-gray-900/30 border border-gray-800/50 hover:border-gray-700 transition-colors group/box">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover/box:scale-110 transition-transform">
                                        <Radio className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">RFID Reader</span>
                                </div>
                                <span className="text-lg font-mono font-bold text-white block ml-1">{record.reader}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-12">
                    <Link
                        href="/records"
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-800/50 hover:bg-gray-800 text-white font-bold rounded-2xl px-8 py-4 border border-gray-700 transition-all text-sm group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Records
                    </Link>
                    <Link
                        href={`/badge`}
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl px-8 py-4 transition-all shadow-xl shadow-indigo-500/20 text-sm group"
                    >
                        <Award className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        View Associated Badge
                    </Link>
                </div>
            </main>
        </div>
    );
}
