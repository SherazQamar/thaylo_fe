"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import MasterySparkline from "@/components/wayfinder/MasterySparkline";
import { useNotifyError } from "@/hooks/use-notify-error";
import { notify } from "@/lib/notify";
import {
  downloadAnalyticsLightCsv,
  downloadAnalyticsLightPdf,
  fetchWayfinderAnalyticsLight,
  wayfinderQueryKeys,
  type AnalyticsLightPoint,
} from "@/lib/wayfinder-api";
import { formatStudentGrade } from "@/lib/wayfinder-student";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function MiniBarChart({
  points,
  color,
  unitSuffix = "",
}: {
  points: AnalyticsLightPoint[];
  color: string;
  unitSuffix?: string;
}) {
  const max = Math.max(...points.map((p) => p.value), 1);
  return (
    <div className="mt-4 flex items-end gap-1 h-28">
      {points.map((point) => {
        const heightPct = Math.max(4, Math.round((point.value / max) * 100));
        return (
          <div
            key={point.date}
            className="flex-1 flex flex-col items-center justify-end gap-1 min-w-0"
            title={`${point.date}: ${point.value}${unitSuffix}`}
          >
            <div
              className="w-full rounded-t-sm"
              style={{
                height: `${heightPct}%`,
                backgroundColor: color,
                minHeight: point.value > 0 ? 4 : 2,
                opacity: point.value > 0 ? 1 : 0.25,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function SelDonut({
  green,
  amber,
  red,
}: {
  green: number;
  amber: number;
  red: number;
}) {
  const total = Math.max(1, green + amber + red);
  const g = (green / total) * 100;
  const a = (amber / total) * 100;
  const r = (red / total) * 100;
  return (
    <div className="flex items-center gap-4 mt-4">
      <div
        className="h-24 w-24 rounded-full"
        style={{
          background: `conic-gradient(#00DCAB 0 ${g}%, #F59E0B ${g}% ${g + a}%, #FF6F6F ${g + a}% ${g + a + r}%)`,
        }}
        aria-hidden
      />
      <div className="space-y-1.5 text-sm">
        <p className="text-[#00DCAB]">Green · {green}</p>
        <p className="text-[#F59E0B]">Amber · {amber}</p>
        <p className="text-[#FF6F6F]">Red · {red}</p>
      </div>
    </div>
  );
}

export default function AnalyticsLightPage() {
  const [days, setDays] = useState(14);
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);

  const query = useQuery({
    queryKey: wayfinderQueryKeys.analyticsLight(days),
    queryFn: () => fetchWayfinderAnalyticsLight(days),
  });

  useNotifyError(query.error, query.isError);

  const data = query.data;
  const seriesPreview = useMemo(
    () => data?.masteryTrend.map((p) => p.value) ?? [],
    [data],
  );

  const handleExport = async (kind: "csv" | "pdf") => {
    setExporting(kind);
    try {
      const file =
        kind === "csv"
          ? await downloadAnalyticsLightCsv(days)
          : await downloadAnalyticsLightPdf(days);
      triggerBlobDownload(file.blob, file.filename);
      notify.success(kind === "csv" ? "CSV downloaded" : "PDF downloaded");
    } catch (err) {
      notify.error(err, "Export failed");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-10" style={inter}>
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-wide uppercase">
            Analytics Light
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Mastery, reteach, engagement, and SEL flags for your caseload
          </p>
        </div>
        <div className="hidden md:block">
          <UserDropdown />
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/dashboard/alerts", label: "Alerts" },
          { href: "/dashboard/alerts/insights", label: "Analytics Light" },
        ]}
      />

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {[7, 14, 30].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setDays(option)}
            className={
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
              (days === option
                ? "bg-[#00CED1] text-[#111023]"
                : "bg-white/5 text-white/70 hover:bg-white/10")
            }
          >
            Last {option} days
          </button>
        ))}
        <div className="flex-1" />
        <button
          type="button"
          disabled={!!exporting || !data}
          onClick={() => void handleExport("csv")}
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/5 disabled:opacity-50"
        >
          {exporting === "csv" ? "Exporting…" : "Export CSV"}
        </button>
        <button
          type="button"
          disabled={!!exporting || !data}
          onClick={() => void handleExport("pdf")}
          className="rounded-full bg-[#60D624] px-4 py-2 text-sm font-semibold text-[#111023] disabled:opacity-50"
        >
          {exporting === "pdf" ? "Exporting…" : "Export PDF"}
        </button>
      </div>

      {query.isLoading ? (
        <p className="mt-10 text-center text-white/50 text-sm">Loading analytics…</p>
      ) : !data ? (
        <p className="mt-10 text-center text-white/50 text-sm">No analytics data yet.</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Mastery passes",
                value: String(data.summary.masteryPasses),
                color: "#00CED1",
              },
              {
                label: "Reteach sessions",
                value: String(data.summary.reteachSessions),
                color: "#F59E0B",
              },
              {
                label: "Engagement time",
                value: `${data.summary.engagementMinutes} min`,
                color: "#60D624",
              },
              {
                label: "SEL flags",
                value: `${data.summary.selAmber + data.summary.selRed}`,
                color: "#FF6F6F",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-4"
                style={{ backgroundColor: "#313044" }}
              >
                <p className="text-white/55 text-xs">{stat.label}</p>
                <p className="text-white text-2xl font-bold mt-1" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#313044" }}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-white font-semibold">Mastery trend over time</h2>
                <MasterySparkline series={seriesPreview} width={88} height={28} />
              </div>
              <MiniBarChart points={data.masteryTrend} color="#00CED1" unitSuffix=" passes" />
            </div>
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#313044" }}>
              <h2 className="text-white font-semibold">Reteach frequency</h2>
              <MiniBarChart points={data.reteachFrequency} color="#F59E0B" unitSuffix=" reteach" />
            </div>
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#313044" }}>
              <h2 className="text-white font-semibold">Engagement time</h2>
              <MiniBarChart points={data.engagementTime} color="#60D624" unitSuffix=" min" />
            </div>
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#313044" }}>
              <h2 className="text-white font-semibold">SEL flag counts</h2>
              <SelDonut
                green={data.selFlagCounts.green}
                amber={data.selFlagCounts.amber}
                red={data.selFlagCounts.red}
              />
            </div>
          </div>

          <div className="mt-4 rounded-2xl overflow-hidden" style={{ backgroundColor: "#313044" }}>
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-white font-semibold">Student breakdown</h2>
              <Link
                href="/dashboard/students"
                className="text-[#00CED1] text-sm font-semibold hover:underline"
              >
                Open students
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-white/45 text-xs uppercase tracking-wide">
                    <th className="px-5 py-3 font-semibold">Student</th>
                    <th className="px-3 py-3 font-semibold">Passes</th>
                    <th className="px-3 py-3 font-semibold">Trend</th>
                    <th className="px-3 py-3 font-semibold">Reteach</th>
                    <th className="px-3 py-3 font-semibold">Engagement</th>
                    <th className="px-3 py-3 font-semibold">SEL</th>
                  </tr>
                </thead>
                <tbody>
                  {data.students.map((row) => (
                    <tr key={row.childId} className="border-t border-white/5 text-white/85">
                      <td className="px-5 py-3">
                        <Link
                          href={`/dashboard/student?id=${row.childId}`}
                          className="font-semibold text-white hover:text-[#00CED1]"
                        >
                          {row.name}
                        </Link>
                        <p className="text-white/40 text-xs">
                          {formatStudentGrade(row.grade)}
                        </p>
                      </td>
                      <td className="px-3 py-3">{row.masteryPasses}</td>
                      <td className="px-3 py-3">{row.masteryTrendLabel}</td>
                      <td className="px-3 py-3">{row.reteachCount}</td>
                      <td className="px-3 py-3">{row.engagementMinutes}m</td>
                      <td className="px-3 py-3">
                        <span
                          className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-[#111023]"
                          style={{
                            backgroundColor:
                              row.selFlag === "RED"
                                ? "#FF6F6F"
                                : row.selFlag === "AMBER"
                                  ? "#F59E0B"
                                  : "#00DCAB",
                          }}
                        >
                          {row.selFlag}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {data.students.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-white/45">
                        No caseload activity in this range yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
