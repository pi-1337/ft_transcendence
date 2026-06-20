'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type TrendPoint = {
    date: string;
    accepted: number;
    rejected: number;
};

type MealStat = {
    id: number;
    name: string;
    startTime: Date;
    endTime: Date;
    accepted: number;
    rejected: number;
};

type Analytics = {
    days: number;
    meals: MealStat[];
    totalAccepted: number;
    totalRejected: number;
    trendData: TrendPoint[];
};

type Props = {
    analytics: Analytics;
    periodDays: number;
    orgID: number;
    orgName: string;
};

function DonutChart({ accepted, rejected }: { accepted: number; rejected: number }) {
    const total = accepted + rejected;
    if (total === 0) return (
        <svg viewBox="0 0 36 36" className="w-24 h-24">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#27272a" strokeWidth="3.8" />
            <text x="18" y="21" textAnchor="middle" className="fill-zinc-500 text-xs" fontSize="5">No data</text>
        </svg>
    );

    const circumference = 100;
    const acceptedDash = (accepted / total) * circumference;
    const rejectedDash = (rejected / total) * circumference;

    return (
        <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#27272a" strokeWidth="3.8" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#7f1d1d"
                strokeWidth="3.8"
                strokeDasharray={`${rejectedDash} ${circumference - rejectedDash}`}
                strokeDashoffset={0}
            />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#065f46"
                strokeWidth="3.8"
                strokeDasharray={`${acceptedDash} ${circumference - acceptedDash}`}
                strokeDashoffset={-rejectedDash}
            />
        </svg>
    );
}

function TrendChart({ trendData }: { trendData: TrendPoint[] }) {
    if (trendData.length === 0) return null;

    const W = 500, H = 180;
    const padL = 36, padR = 16, padT = 16, padB = 36;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    const baseline = padT + plotH;
    const n = trendData.length;

    const maxVal = Math.max(...trendData.flatMap(d => [d.accepted, d.rejected]), 1);

    const xOf = (i: number) => padL + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
    const yOf = (v: number) => padT + (1 - v / maxVal) * plotH;

    const acceptedPts = trendData.map((d, i) => `${xOf(i)},${yOf(d.accepted)}`).join(' ');
    const rejectedPts = trendData.map((d, i) => `${xOf(i)},${yOf(d.rejected)}`).join(' ');
    const acceptedFill = `${xOf(0)},${baseline} ${acceptedPts} ${xOf(n - 1)},${baseline}`;
    const rejectedFill = `${xOf(0)},${baseline} ${rejectedPts} ${xOf(n - 1)},${baseline}`;

    const yTicks = [0, Math.round(maxVal / 2), maxVal];
    const step = Math.max(1, Math.ceil(n / 6));
    const xLabelIndices = Array.from({ length: n }, (_, i) => i)
        .filter(i => i === 0 || i === n - 1 || i % step === 0);
    // deduplicate (when n=1, index 0 matches both i===0 and i===n-1)
    const uniqueXLabels = [...new Set(xLabelIndices)];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            {/* Gridlines + Y labels */}
            {yTicks.map(v => (
                <g key={v}>
                    <line x1={padL} y1={yOf(v)} x2={W - padR} y2={yOf(v)}
                        stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="4 3" />
                    <text x={padL - 4} y={yOf(v) + 3.5} textAnchor="end" fontSize="9" fill="#71717a">{v}</text>
                </g>
            ))}

            {/* X labels */}
            {uniqueXLabels.map(i => (
                <text key={i} x={xOf(i)} y={H - padB + 14} textAnchor="middle" fontSize="9" fill="#71717a">
                    {trendData[i].date.slice(5)}
                </text>
            ))}

            {/* Filled areas */}
            <polygon points={rejectedFill} fill="#7f1d1d" fillOpacity="0.15" />
            <polygon points={acceptedFill} fill="#065f46" fillOpacity="0.15" />

            {/* Lines (only if more than 1 point) */}
            {n > 1 && (
                <>
                    <polyline points={rejectedPts} fill="none" stroke="#ef4444"
                        strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                    <polyline points={acceptedPts} fill="none" stroke="#10b981"
                        strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                </>
            )}

            {/* Dots */}
            {trendData.map((d, i) => (
                <g key={i}>
                    <circle cx={xOf(i)} cy={yOf(d.accepted)} r={n === 1 ? 4 : 2.5} fill="#10b981" />
                    <circle cx={xOf(i)} cy={yOf(d.rejected)} r={n === 1 ? 4 : 2.5} fill="#ef4444" />
                </g>
            ))}
        </svg>
    );
}

export default function StatisticsClient({ analytics, orgID, periodDays, orgName }: Props) {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 10000); //TODO: change to 30000 which is the standard for a real-time refresh rate
        return () => clearInterval(interval);
    }, [router]);

    const handleExportCSV = () => {
        let csvString = "";

        csvString += "=== EXECUTIVE SUMMARY ===\n";
        csvString += `Report Period, Last ${analytics.days} Days\n`;
        csvString += `Total Accepted, ${analytics.totalAccepted}\n`;
        csvString += `Total Rejected, ${analytics.totalRejected}\n`;
        csvString += "\n";

        csvString += "=== MEAL BREAKDOWN ===\n";
        csvString += "Meal Name,Accepted,Rejected\n";
        analytics.meals.forEach(meal => {
            csvString += `${meal.name},${meal.accepted},${meal.rejected}\n`;
        });
        csvString += "\n";

        csvString += "=== DAILY TRENDS ===\n";
        csvString += "Date,Accepted,Rejected\n";
        analytics.trendData.forEach(day => {
            csvString += `${day.date},${day.accepted},${day.rejected}\n`;
        });

        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Full_Gate_Report_${analytics.days}_Days.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };


    return (
        <main className="min-h-screen bg-zinc-950 text-white font-sans p-10">
            <div className="max-w-5xl mx-auto">
                <button 
                    onClick={handleExportCSV}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    Export CSV
                </button>
                {/* Header */}
                <div className="flex items-center justify-between mb-10 border-b border-zinc-800 pb-6">
                    <div className="flex items-center gap-4">
                        <Link href={`/organizations/${orgID}`} className="text-zinc-500 hover:text-white text-sm transition-colors">
                            ← {orgName}
                        </Link>
                        <span className="text-zinc-700">/</span>
                        <h1 className="text-2xl font-bold text-white">Analytics</h1>
                    </div>
                    <select
                        defaultValue={periodDays}
                        onChange={(e) => router.push(`?days=${e.target.value}`)}
                        className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
                    >
                        <option value="1">Last 1 Day</option>
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                        <option value="60">Last 60 Days</option>
                    </select>
                </div>

                {/* Totals */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Total Accepted</p>
                        <p className="text-4xl font-bold text-emerald-400">{analytics.totalAccepted}</p>
                        <p className="text-zinc-600 text-xs mt-1">last {periodDays} day{periodDays > 1 ? 's' : ''}</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Total Rejected</p>
                        <p className="text-4xl font-bold text-red-400">{analytics.totalRejected}</p>
                        <p className="text-zinc-600 text-xs mt-1">last {periodDays} day{periodDays > 1 ? 's' : ''}</p>
                    </div>
                </div>

                {/* Trend Chart */}
                {periodDays > 1 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-zinc-500 text-xs uppercase tracking-widest">Daily Trend</h2>
                        <div className="flex items-center gap-5">
                            <span className="flex items-center gap-2 text-xs text-zinc-400">
                                <span className="w-4 h-0.5 bg-emerald-500 inline-block rounded" /> Accepted
                            </span>
                            <span className="flex items-center gap-2 text-xs text-zinc-400">
                                <span className="w-4 h-0.5 bg-red-500 inline-block rounded" /> Rejected
                            </span>
                        </div>
                    </div>
                    <TrendChart trendData={analytics.trendData} />
                </div>
                )}

                {/* Meal Cards */}
                <h2 className="text-zinc-500 text-xs uppercase tracking-widest mb-4">By Meal</h2>
                {analytics.meals.length === 0 ? (
                    <p className="text-zinc-600">No meals configured for this organization.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {analytics.meals.map(meal => (
                            <div key={meal.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
                                <div>
                                    <p className="text-white font-semibold text-lg">{meal.name}</p>
                                    <p className="text-zinc-500 text-xs font-mono mt-1">
                                        {new Date(meal.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        {' – '}
                                        {new Date(meal.endTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <DonutChart accepted={meal.accepted} rejected={meal.rejected} />
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-emerald-800 inline-block" />
                                            <span className="text-zinc-400 text-sm">{meal.accepted} accepted</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-red-900 inline-block" />
                                            <span className="text-zinc-400 text-sm">{meal.rejected} rejected</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
