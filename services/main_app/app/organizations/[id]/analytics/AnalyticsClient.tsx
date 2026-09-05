"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  PieChart,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

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

export default function StatisticsClient({
  analytics,
  orgID,
  periodDays,
  orgName,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const handleExportCSV = () => {
    let csvString = "";
    csvString += "=== EXECUTIVE SUMMARY ===\n";
    csvString += `Report Period, Last ${analytics.days} Days\n`;
    csvString += `Total Accepted, ${analytics.totalAccepted}\n`;
    csvString += `Total Rejected, ${analytics.totalRejected}\n\n`;
    csvString += "=== MEAL BREAKDOWN ===\n";
    csvString += "Meal Name,Accepted,Rejected\n";
    analytics.meals.forEach((meal) => {
      csvString += `${meal.name},${meal.accepted},${meal.rejected}\n`;
    });
    csvString += "\n=== DAILY TRENDS ===\n";
    csvString += "Date,Accepted,Rejected\n";
    analytics.trendData.forEach((day) => {
      csvString += `${day.date},${day.accepted},${day.rejected}\n`;
    });

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Gate_Report_${orgName.replace(/\s+/g, "_")}_${analytics.days}_Days.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const lineChartData = {
    labels: analytics.trendData.map((d) => d.date.slice(5)),
    datasets: [
      {
        label: "Accepted",
        data: analytics.trendData.map((d) => d.accepted),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#22c55e",
        pointRadius: analytics.trendData.length === 1 ? 4 : 2.5,
      },
      {
        label: "Rejected",
        data: analytics.trendData.map((d) => d.rejected),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: "#ef4444",
        pointRadius: analytics.trendData.length === 1 ? 4 : 2.5,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "#111827",
        titleColor: "#9ca3af",
        bodyColor: "#ffffff",
        borderColor: "#1f2937",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: "#6b7280" },
      },
      y: {
        grid: { color: "#374151", borderDash: [4, 4], drawBorder: false },
        ticks: { color: "#6b7280", maxTicksLimit: 5 },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      <header className="border-b border-gray-800 bg-gray-950 px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link
            href={`/organizations/${orgID}`}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> {orgName}
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-white">Analytics</span>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={String(periodDays)}
            onValueChange={(val) => router.push(`?days=${val}`)}
          >
            <SelectTrigger className="w-35 bg-gray-950/50 border-gray-800 text-white focus:ring-green-600 h-9">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800 text-gray-200">
              <SelectItem
                value="1"
                className="focus:bg-gray-800 focus:text-white cursor-pointer"
              >
                Last 1 Day
              </SelectItem>
              <SelectItem
                value="7"
                className="focus:bg-gray-800 focus:text-white cursor-pointer"
              >
                Last 7 Days
              </SelectItem>
              <SelectItem
                value="30"
                className="focus:bg-gray-800 focus:text-white cursor-pointer"
              >
                Last 30 Days
              </SelectItem>
              <SelectItem
                value="60"
                className="focus:bg-gray-800 focus:text-white cursor-pointer"
              >
                Last 60 Days
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-9 gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-10 space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
            <Activity className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Scan Analytics</h1>
            <p className="text-sm text-gray-400">
              Overview of badge scans over the last {periodDays} day
              {periodDays > 1 ? "s" : ""}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Total
                  Accepted
                </p>
              </div>
              <p className="text-4xl font-bold text-green-500">
                {analytics.totalAccepted}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-500" /> Total Rejected
                </p>
              </div>
              <p className="text-4xl font-bold text-red-500">
                {analytics.totalRejected}
              </p>
            </CardContent>
          </Card>
        </div>

        {periodDays > 1 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2 border-b border-gray-800 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-gray-200 text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" /> Daily Trend
                </CardTitle>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span className="w-3 h-3 bg-green-500/20 border border-green-500 rounded-sm" />{" "}
                    Accepted
                  </span>
                  <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span className="w-3 h-3 bg-red-500/20 border border-red-500 rounded-sm" />{" "}
                    Rejected
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 pl-1">
            <PieChart className="w-4 h-4" /> By Meal
          </h2>

          {analytics.meals.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800 border-dashed">
              <CardContent className="p-8 text-center text-gray-500">
                No meals configured for this organization.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.meals.map((meal) => {
                const hasData = meal.accepted > 0 || meal.rejected > 0;

                const doughnutData = {
                  labels: ["Accepted", "Rejected"],
                  datasets: [
                    {
                      data: hasData ? [meal.accepted, meal.rejected] : [1],
                      backgroundColor: hasData
                        ? ["#15803d", "#b91c1c"]
                        : ["#1f2937"],
                      borderWidth: 0,
                    },
                  ],
                };

                const doughnutOptions = {
                  cutout: "75%",
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: hasData },
                  },
                };

                return (
                  <Card key={meal.id} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-5 flex flex-col gap-4">
                      <div>
                        <p className="text-white font-semibold">{meal.name}</p>
                        <p className="text-gray-500 text-xs font-mono mt-1 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {new Date(meal.startTime).toLocaleTimeString(
                            "en-GB",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                          {" – "}
                          {new Date(meal.endTime).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-5 bg-gray-950/50 p-3 rounded-xl border border-gray-800/50">
                        <div className="w-16 h-16 relative shrink-0">
                          <Doughnut
                            data={doughnutData}
                            options={doughnutOptions}
                          />
                          {!hasData && (
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-gray-500 uppercase">
                              Empty
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5 text-gray-400 text-sm font-medium">
                              <span className="w-2.5 h-2.5 rounded-full bg-green-600" />{" "}
                              Acc
                            </span>
                            <span className="text-white font-semibold text-sm">
                              {meal.accepted}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5 text-gray-400 text-sm font-medium">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />{" "}
                              Rej
                            </span>
                            <span className="text-white font-semibold text-sm">
                              {meal.rejected}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
