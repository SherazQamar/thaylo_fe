"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { fetchParentDashboardStats } from "@/lib/parent-api";
import { useAuthStore } from "@/stores/auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function buildStatCards(stats?: {
  totalChildren: number;
  activeToday: number;
  avgWeeklyTimeMinutes: number;
  masteredSkills: number;
}) {
  return [
    {
      label: "Total Children",
      value: stats != null ? String(stats.totalChildren) : "—",
    },
    {
      label: "Active Today",
      value: stats != null ? String(stats.activeToday) : "—",
    },
    {
      label: "Avg Weekly Time",
      value: stats != null ? `${stats.avgWeeklyTimeMinutes} min` : "—",
    },
    {
      label: "Mastered Skills",
      value: stats != null ? String(stats.masteredSkills) : "—",
    },
  ];
}

const ZERO_PROGRESS_COLOR = "#858C94";

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

function confidenceBadgeColor(confidence: string): string {
  const normalized = confidence.toLowerCase();
  if (normalized === "high") return "bg-[#22C55E]";
  if (normalized === "medium") return "bg-[#F59E0B]";
  if (normalized === "low") return "bg-[#EF4444]";
  return "bg-[#858C94]";
}

export default function ParentDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: dashboardStats } = useQuery({
    queryKey: ["parent-dashboard-stats"],
    queryFn: fetchParentDashboardStats,
  });

  const stats = buildStatCards(dashboardStats);
  const greetingName = user?.name?.trim() || "Parent";
  const progressBars = dashboardStats?.masteryProgressBars ?? [];
  const masteryStudents = dashboardStats?.childrenMastery ?? [];
  const firstChildName = masteryStudents[0]?.userName ?? user?.children?.[0]?.userName;

  return (
    <div className="p-4 md:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h1
          className="uppercase"
          style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
        >
          Parent Dashboard
        </h1>
        <div className="hidden md:block">
          <ParentUserDropdown />
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[{ href: "/parent-dashboard", label: "Parent Dashboard" }]}
      />

      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 style={{ ...inter, fontWeight: 700, fontSize: "22px", lineHeight: "30px", color: "#FFFFFF" }}>
            Hello, {greetingName}
          </h2>
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.5)" }}>
            {firstChildName
              ? `Here is how ${firstChildName} is doing today.`
              : "Here is your family learning overview."}
          </p>
        </div>
        <Link
          href="/parent-dashboard/children"
          className="rounded-full px-6 py-2.5 cursor-pointer hover:opacity-90 transition-opacity self-start sm:self-auto"
          style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#111023" }}
        >
          Add Child
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-[24px] px-5 md:px-6 py-[10px] h-[72px]"
            style={{ backgroundColor: "#525162" }}
          >
            <div className="w-10 h-10 rounded-full bg-[#00CED1]/20 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ ...inter, fontWeight: 500, fontSize: "11px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>{stat.label}</p>
              <p style={{ ...inter, fontWeight: 600, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mastery Progress + SEL Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Mastery Progress Card */}
        <div className="rounded-[12px] p-5 md:p-6" style={{ backgroundColor: "#313044" }}>
          <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "20px" }}>Mastery Progress</h3>
          <div className="flex flex-col gap-5">
            {progressBars.length === 0 ? (
              <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.5)" }}>
                No children yet. Add a child to see mastery progress.
              </p>
            ) : (
              progressBars.map((bar) => (
                <div key={bar.childId}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "rgba(255,255,255,0.7)" }}>{bar.label}</span>
                    <span style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: ZERO_PROGRESS_COLOR }}>{bar.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#525162]">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${bar.progressPercent}%`, backgroundColor: ZERO_PROGRESS_COLOR }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SEL Overview Card */}
        <div className="rounded-[12px] p-5 md:p-6" style={{ backgroundColor: "#313044" }}>
          <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF", marginBottom: "20px" }}>SEL Overview</h3>
          <div className="flex items-center justify-center py-4">
            <div className="relative" style={{ width: "280px", height: "180px" }}>
              {/* Happy circle - green */}
              <div
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  width: "140px",
                  height: "140px",
                  backgroundColor: "rgba(34,197,94,0.25)",
                  border: "2px solid rgba(34,197,94,0.5)",
                  left: "0px",
                  top: "20px",
                }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-1">😊</span>
                  <span style={{ ...inter, fontWeight: 600, fontSize: "13px", color: "#22C55E" }}>Happy</span>
                  <span style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#FFFFFF" }}>7</span>
                </div>
              </div>
              {/* Confuse circle - pink */}
              <div
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  width: "110px",
                  height: "110px",
                  backgroundColor: "rgba(236,72,153,0.25)",
                  border: "2px solid rgba(236,72,153,0.5)",
                  left: "100px",
                  top: "10px",
                }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">😕</span>
                  <span style={{ ...inter, fontWeight: 600, fontSize: "12px", color: "#EC4899" }}>Confuse</span>
                  <span style={{ ...inter, fontWeight: 700, fontSize: "18px", color: "#FFFFFF" }}>3</span>
                </div>
              </div>
              {/* Sad circle - teal */}
              <div
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  width: "90px",
                  height: "90px",
                  backgroundColor: "rgba(0,206,209,0.25)",
                  border: "2px solid rgba(0,206,209,0.5)",
                  left: "180px",
                  top: "60px",
                }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-xl mb-1">😢</span>
                  <span style={{ ...inter, fontWeight: 600, fontSize: "11px", color: "#00CED1" }}>Sad</span>
                  <span style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mastery Progress Table */}
      <div className="rounded-[12px] p-4 md:p-6" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <h2 style={{ ...inter, fontWeight: 700, fontSize: "22px", lineHeight: "22px", color: "#FFFFFF" }}>Mastery Progress</h2>
          <button className="uppercase cursor-pointer hover:opacity-80 transition-opacity" style={{ ...inter, fontWeight: 700, fontSize: "13.5px", lineHeight: "18px", letterSpacing: "0.8px", color: "#00CED1" }}>
            View All
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {masteryStudents.length === 0 ? (
            <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.5)" }}>
              No children registered yet.
            </p>
          ) : (
            masteryStudents.map((student) => (
              <div
                key={student.id}
                className="md:grid md:grid-cols-[1fr_1fr_1fr_auto] items-center rounded-[12px] px-4 md:px-5 py-3 gap-3 md:gap-4 hover:bg-white/10 transition-colors flex flex-col"
                style={{ backgroundColor: "#313044" }}
              >
                {/* Student Info */}
                <div className="flex items-center gap-2.5 w-full">
                  <div className="w-9 h-9 rounded-full bg-[#525162] overflow-hidden flex-shrink-0">
                    <Image src="/assets/wayfinder Em.png" alt={student.userName} width={36} height={36} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>{student.userName}</p>
                    <p style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "#858C94" }}>{formatChildGrade(student.grade)}</p>
                  </div>
                </div>

                {/* Plant Stage */}
                <div className="flex items-center gap-2.5 w-full mt-2 md:mt-0">
                  <div className="w-9 h-9 rounded-full bg-[#313044] border border-[#00CED1]/30 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22V8" /><path d="M5 12H2a10 10 0 0020 0h-3" /><path d="M8 5.2C9.2 3.6 10.5 3 12 3c1.5 0 2.8.6 4 2.2" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>{student.plantStage}</p>
                    <p style={{ ...inter, fontWeight: 500, fontSize: "11px", lineHeight: "14px", color: "#00CED1" }}>{student.masteredLabel}</p>
                  </div>
                </div>

                {/* Focus */}
                <div className="rounded-[20px] w-full mt-2 md:mt-0" style={{ backgroundColor: "#525162", padding: "8px 16px" }}>
                  <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>{student.focusArea}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "#FFFFFF" }}>Confidence</span>
                    <span className={`px-2 py-0.5 rounded-full ${confidenceBadgeColor(student.confidence)}`} style={{ ...inter, fontWeight: 500, fontSize: "10px", lineHeight: "10px", color: "#111023" }}>{student.confidence}</span>
                  </div>
                </div>

                {/* Open Chat */}
                <button className="uppercase flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap mt-2 md:mt-0 self-start md:self-center" style={{ ...inter, fontWeight: 700, fontSize: "13.5px", lineHeight: "18px", letterSpacing: "0.8px", color: "#00CED1" }}>
                  Open Chat
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
