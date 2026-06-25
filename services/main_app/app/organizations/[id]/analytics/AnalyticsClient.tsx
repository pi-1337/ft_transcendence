"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faCircleCheck, faCircleXmark, faFileExport, faUtensils } from "@fortawesome/free-solid-svg-icons";

interface TrendPoint
{
	date: string;
	accepted: number;
	rejected: number;
};

interface MealStat
{
	id: number;
	name: string;
	startTime: Date;
	endTime: Date;
	accepted: number;
	rejected: number;
};

interface Analytics
{
	days: number;
	meals: MealStat[];
	totalAccepted: number;
	totalRejected: number;
	trendData: TrendPoint[];
};

interface Props
{
	analytics: Analytics;
	periodDays: number;
	orgID: number;
	orgName: string;
};

function DonutChart({ accepted, rejected }: { accepted: number; rejected: number })
{
	const total = accepted + rejected;
	if (total === 0) 
	{
		return (
			<svg viewBox="0 0 36 36" className="w-24 h-24">
				<circle cx="18" cy="18" r="15.9" fill="none" stroke="#2A2A2A" strokeWidth="3.8"/>
				<text x="18" y="21" textAnchor="middle" fontSize="5" fill="#555555">No data</text>
			</svg>
		);
	}

	const circumference = 100;
	const acceptedDash = (accepted / total) * circumference;
	const rejectedDash = (rejected / total) * circumference;

	return (
		<svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
			<circle cx="18" cy="18" r="15.9" fill="none" stroke="#2A2A2A" strokeWidth="3.8"/>
			<circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" strokeWidth="3.8" strokeDasharray={`${rejectedDash} ${circumference - rejectedDash}`} strokeDashoffset={0}/>
			<circle cx="18" cy="18" r="15.9" fill="none" stroke="#E8963A" strokeWidth="3.8" strokeDasharray={`${acceptedDash} ${circumference - acceptedDash}`} strokeDashoffset={-rejectedDash}/>
		</svg>
	);
 
}

function TrendChart({ trendData }: { trendData: TrendPoint[] })
{
	if (trendData.length === 0)
		return (null);

	const W = 500, H = 180;
	const padL = 36, padR = 16, padT = 16, padB = 36;
	const plotW = W - padL - padR;
	const plotH = H - padT - padB;
	const baseline = padT + plotH;
	const n = trendData.length;

	const maxVal = Math.max(...trendData.flatMap(d => [d.accepted, d.rejected]), 1);

	const xOf = (i: number) => padL + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
	const yOf = (v: number) => padT + (1 - v / maxVal) * plotH;

	const acceptedPts = trendData.map((d, i) => `${xOf(i)},${yOf(d.accepted)}`).join(" ");
	const rejectedPts = trendData.map((d, i) => `${xOf(i)},${yOf(d.rejected)}`).join(" ");
	const acceptedFill = `${xOf(0)},${baseline} ${acceptedPts} ${xOf(n - 1)},${baseline}`;
	const rejectedFill = `${xOf(0)},${baseline} ${rejectedPts} ${xOf(n - 1)},${baseline}`;

	const yTicks = [0, Math.round(maxVal / 2), maxVal];
	const step = Math.max(1, Math.ceil(n / 6));
	const xLabelIndices = Array.from({ length: n }, (_, i) => i).filter(i => i === 0 || i === n - 1 || i % step === 0);
	const uniqueXLabels = [...new Set(xLabelIndices)];

	return (
		<svg viewBox={`0 0 ${W} ${H}`} className="w-full">
			{yTicks.map(v =>
			(
				<g key={v}>
					<line x1={padL} y1={yOf(v)} x2={W - padR} y2={yOf(v)} stroke="#2A2A2A" strokeWidth="0.5" strokeDasharray="4 3"/>
					<text x={padL - 4} y={yOf(v) + 3.5} textAnchor="end" fontSize="9" fill="#555555">{v}</text>
				</g>
			))}

			{uniqueXLabels.map(i =>
			(
				<text key={i} x={xOf(i)} y={H - padB + 14} textAnchor="middle" fontSize="9" fill="#555555">
					{trendData[i].date.slice(5)}
				</text>
			))}

			<polygon points={rejectedFill} fill="#ef4444" fillOpacity="0.08"/>
			<polygon points={acceptedFill} fill="#E8963A" fillOpacity="0.08"/>
		
			{n > 1 &&
			(
				<>
					<polyline points={rejectedPts} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
					<polyline points={acceptedPts} fill="none" stroke="#E8963A" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
				</>
			)}

			{trendData.map((d, i) =>
			(
				<g key={i}>
					<circle cx={xOf(i)} cy={yOf(d.accepted)} r={n === 1 ? 4 : 2.5} fill="#E8963A"/>
					<circle cx={xOf(i)} cy={yOf(d.rejected)} r={n === 1 ? 4 : 2.5} fill="#ef4444"/>
				</g>
			))}
		</svg>
	);
}

export default function StatisticsClient({ analytics, orgID, periodDays, orgName }: Props)
{
	const router = useRouter();

	useEffect(() => 
	{
		const interval = setInterval(() => { router.refresh(); }, 10000);
		return () => clearInterval(interval);
	}, [router]);

	const handleExportCSV = () =>
	{
		let csvString = "";

		csvString += "=== EXECUTIVE SUMMARY ===\n";
		csvString += `Report Period, Last ${analytics.days} Days\n`;
		csvString += `Total Accepted, ${analytics.totalAccepted}\n`;
		csvString += `Total Rejected, ${analytics.totalRejected}\n`;
		csvString += "\n";

		csvString += "=== MEAL BREAKDOWN ===\n";
		csvString += "Meal Name,Accepted,Rejected\n";
		analytics.meals.forEach(meal => { csvString += `${meal.name},${meal.accepted},${meal.rejected}\n`; });
		csvString += "\n";

		csvString += "=== DAILY TRENDS ===\n";
		csvString += "Date,Accepted,Rejected\n";
		analytics.trendData.forEach(day => { csvString += `${day.date},${day.accepted},${day.rejected}\n`; });

		const blob = new Blob([csvString], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `Full_Gate_Report_${analytics.days}_Days.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	};


	return (
		<div className="min-h-screen bg-[#111111] text-white">
		<header className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#2A2A2A] px-4 sm:px-5 md:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
			<div className="flex items-center gap-3">
				<Link href={`/organizations/${orgID}`} className="flex items-center gap-2 text-[#888888] hover:text-white text-[16px] font-medium transition-all group">
					<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-1 transition-transform"/>
					{orgName}
				</Link>
				<div className="w-px h-4 bg-[#2A2A2A]"/>
				<span className="text-white font-semibold text-[16px]">Analytics</span>
			</div>
			<div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
				<select defaultValue={periodDays} onChange={(e) => router.push(`?days=${e.target.value}`)} className="flex-1 sm:flex-none bg-[#1A1A1A] border border-[#2A2A2A] text-white text-[16px] rounded-xl px-3 py-2 focus:outline-none focus:border-[#E8963A] transition-colors">
					<option value="1">Last 1 Day</option>
					<option value="7">Last 7 Days</option>
					<option value="30">Last 30 Days</option>
					<option value="60">Last 60 Days</option>
				</select>
				<button onClick={handleExportCSV} className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2A2A2A] hover:border-[#444444] text-[#888888] hover:text-white px-3 sm:px-4 py-2 rounded-xl text-[16px] font-semibold transition-all whitespace-nowrap">
					<FontAwesomeIcon icon={faFileExport} className="text-xs"/>
					<span className="hidden xs:inline">Export CSV</span>
					<span className="xs:hidden">Export</span>
				</button>
			</div>
		</header>

			<main className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-12">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
					<div className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E8963A]/30 rounded-2xl p-6 transition-all group">
						<div className="w-9 h-9 bg-[#E8963A]/10 border border-[#E8963A]/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
							<FontAwesomeIcon icon={faCircleCheck} className="text-[#E8963A] text-[16px]"/>
						</div>
						<p className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-1">Total Accepted</p>
						<p className="text-4xl font-black text-[#E8963A]">{analytics.totalAccepted}</p>
						<p className="text-[#444444] text-xs mt-1">last {periodDays} day{periodDays > 1 ? "s" : ""}</p>
					</div>
					<div className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-red-500/20 rounded-2xl p-6 transition-all group">
						<div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
							<FontAwesomeIcon icon={faCircleXmark} className="text-red-400 text-[16px]"/>
						</div>
						<p className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-1">Total Rejected</p>
						<p className="text-4xl font-black text-red-400">{analytics.totalRejected}</p>
						<p className="text-[#444444] text-xs mt-1">last {periodDays} day{periodDays > 1 ? "s" : ""}</p>
					</div>
				</div>

				{periodDays > 1 &&
				(
					<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 mb-8">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-[#666666] text-xs font-bold uppercase tracking-widest">Daily Trend</h2>
							<div className="flex items-center gap-5">
								<span className="flex items-center gap-2 text-xs text-[#888888]">
									<span className="w-4 h-0.5 bg-[#E8963A] inline-block rounded"/>
									Accepted
								</span>
								<span className="flex items-center gap-2 text-xs text-[#888888]">
									<span className="w-4 h-0.5 bg-red-400 inline-block rounded"/>
									Rejected
								</span>
							</div>
						</div>
						<TrendChart trendData={analytics.trendData}/>
					</div>
				)}

				<h2 className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-4">By Meal</h2>
				{analytics.meals.length === 0
				?
					<div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-12 text-center">
						<FontAwesomeIcon icon={faUtensils} className="text-[#444444] text-3xl mb-3"/>
						<p className="text-[#666666] text-[16px]">No meals configured for this organization.</p>
					</div>
				:
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{analytics.meals.map(meal => (
							<div key={meal.id} className="bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E8963A]/20 rounded-2xl p-6 flex flex-col gap-4 transition-all">
								<div>
									<p className="text-white font-semibold text-base">{meal.name}</p>
									<p className="text-[#666666] text-xs font-mono mt-1">
										{new Date(meal.startTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
										{" - "}
										{new Date(meal.endTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
									</p>
								</div>
								<div className="flex items-center gap-6">
									<DonutChart accepted={meal.accepted} rejected={meal.rejected}/>
									<div className="flex flex-col gap-2">
										<div className="flex items-center gap-2">
											<span className="w-2.5 h-2.5 rounded-full bg-[#E8963A] inline-block shrink-0"/>
											<span className="text-[#888888] text-[16px]">{meal.accepted} accepted</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block shrink-0"/>
											<span className="text-[#888888] text-[16px]">{meal.rejected} rejected</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				}
			</main>
		</div>
	);
}
