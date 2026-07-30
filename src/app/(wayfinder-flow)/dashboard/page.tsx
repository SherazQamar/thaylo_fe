"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import InfoTooltip from "@/components/shared/InfoTooltip";
import PortalAvatar from "@/components/shared/PortalAvatar";
import { useNotifyError } from "@/hooks/use-notify-error";
import {
  fetchWayfinderDashboard,
  type WayfinderDashboardStudent,
  type WayfinderPriorityStudent,
  wayfinderQueryKeys,
} from "@/lib/wayfinder-api";
import { WAYFINDER_DASHBOARD_HINTS } from "@/lib/portal-help-text";
import {
  formatStudentGrade,
  formatWayfinderStudentName,
} from "@/lib/wayfinder-student";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function PrioritiesPanel({
  open,
  priorities,
  onClose,
}: {
  open: boolean;
  priorities: WayfinderPriorityStudent[];
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close priorities"
        onClick={onClose}
      />
      <div
        className="relative h-full w-full max-w-md overflow-y-auto p-5 md:p-6 shadow-2xl"
        style={{ backgroundColor: "#252338" }}
      >
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <h2 style={{ ...inter, fontWeight: 700, fontSize: "22px", color: "#FFFFFF" }}>
              Priorities
            </h2>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
              Students with red flags — open Alerts Center to act
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 text-white/70 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {priorities.length === 0 ? (
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)" }} className="py-8 text-center">
            No red-flag students right now.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {priorities.map((p) => (
              <Link
                key={`${p.source}-${p.childId}`}
                href="/dashboard/alerts"
                className="rounded-[12px] px-4 py-3 hover:bg-white/5 transition-colors"
                style={{ backgroundColor: "#313044" }}
                onClick={onClose}
              >
                <div className="flex items-center justify-between gap-2">
                  <p style={{ ...inter, fontWeight: 600, fontSize: "15px", color: "#FFFFFF" }}>
                    {p.name}
                  </p>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase"
                    style={{ backgroundColor: "#FF6F6F", color: "#111023" }}
                  >
                    Red
                  </span>
                </div>
                <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "4px" }}>
                  {p.grade ? `${formatStudentGrade(p.grade)} · ` : ""}
                  {p.reason}
                </p>
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/dashboard/alerts"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#00CED1] py-3 text-[#111023] hover:bg-[#00B8BB] transition-colors"
          style={{ ...inter, fontWeight: 700, fontSize: "14px" }}
          onClick={onClose}
        >
          Go to Alerts Center
        </Link>
      </div>
    </div>
  );
}

function DashboardStudentRow({ student }: { student: WayfinderDashboardStudent }) {
  const displayName = formatWayfinderStudentName(student);

  return (
    <Link
      href={`/dashboard/student?id=${student.id}`}
      className="md:grid md:grid-cols-[1.1fr_1fr_1.2fr_auto] items-center rounded-[12px] px-4 md:px-5 py-3 gap-3 md:gap-4 hover:bg-white/10 transition-colors flex flex-col"
      style={{ backgroundColor: "#313044" }}
    >
      <div className="flex items-center gap-2.5 w-full">
        <PortalAvatar name={displayName} avatarUrl={student.avatarUrl} size={36} />
        <div className="min-w-0">
          <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>
            {displayName}
          </p>
          <p style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "#858C94" }}>
            {formatStudentGrade(student.grade)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-full mt-2 md:mt-0">
        <div className="w-9 h-9 rounded-full bg-[#313044] border border-[#00CED1]/30 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22V8" />
            <path d="M5 12H2a10 10 0 0020 0h-3" />
            <path d="M8 5.2C9.2 3.6 10.5 3 12 3c1.5 0 2.8.6 4 2.2" />
          </svg>
        </div>
        <div>
          <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>
            {student.plantStage}
            <span style={{ ...inter, fontWeight: 500, fontSize: "11px", color: "rgba(255,255,255,0.45)", marginLeft: "6px" }}>
              · {student.contentArea}
            </span>
          </p>
          <p style={{ ...inter, fontWeight: 500, fontSize: "11px", lineHeight: "14px", color: "#00CED1" }}>
            {student.masteredLabel}
          </p>
        </div>
      </div>

      <div className="rounded-[20px] w-full mt-2 md:mt-0" style={{ backgroundColor: "#525162", padding: "8px 16px" }}>
        <p
          className="flex items-center gap-1.5"
          style={{ ...inter, fontWeight: 500, fontSize: "11px", color: "rgba(255,255,255,0.5)" }}
        >
          Focus
          <InfoTooltip content={WAYFINDER_DASHBOARD_HINTS.focus} align="left" />
        </p>
        <p style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF", marginTop: "2px" }}>
          {student.focusArea}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="flex items-center gap-1.5"
            style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "#FFFFFF" }}
          >
            Confidence
            <InfoTooltip content={WAYFINDER_DASHBOARD_HINTS.confidence} align="left" />
          </span>
          <span
            className="px-2 py-0.5 rounded-full"
            style={{
              ...inter,
              fontWeight: 500,
              fontSize: "10px",
              color: "#111023",
              backgroundColor:
                student.confidence === "High"
                  ? "#00DCAB"
                  : student.confidence === "Medium"
                    ? "#F59E0B"
                    : "#858C94",
            }}
          >
            {student.confidence}
          </span>
        </div>
      </div>

      <span
        className="uppercase flex-shrink-0 whitespace-nowrap mt-2 md:mt-0 self-start md:self-center"
        style={{ ...inter, fontWeight: 700, fontSize: "13.5px", lineHeight: "18px", letterSpacing: "0.8px", color: "#00CED1" }}
      >
        View
      </span>
    </Link>
  );
}

export default function DashboardPage() {
  const [prioritiesOpen, setPrioritiesOpen] = useState(false);

  const dashboardQuery = useQuery({
    queryKey: wayfinderQueryKeys.dashboard(),
    queryFn: fetchWayfinderDashboard,
    refetchInterval: 30_000,
  });

  const data = dashboardQuery.data;
  const students = data?.students ?? [];
  const priorities = data?.priorities ?? [];
  const stats = data?.stats ?? [];
  const totalStudents = data?.totalStudents ?? students.length;

  useNotifyError(dashboardQuery.error, dashboardQuery.isError);

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h1
          className="uppercase"
          style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
        >
          Wayfinder Dashboard
        </h1>
        <div className="hidden md:block">
          <UserDropdown />
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[{ href: "/dashboard", label: "Wayfinder Dashboard" }]}
      />

      {dashboardQuery.isLoading && (
        <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)" }} className="py-8">
          Loading dashboard…
        </p>
      )}

      {!dashboardQuery.isLoading && !dashboardQuery.isError && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
            {stats.map((stat) => {
              const fallbackHint =
                stat.key === "masteryTrend"
                  ? WAYFINDER_DASHBOARD_HINTS.masteryTrend
                  : stat.key === "timeThisWeek"
                    ? WAYFINDER_DASHBOARD_HINTS.timeThisWeek
                    : stat.key === "selSummary"
                      ? WAYFINDER_DASHBOARD_HINTS.selSummary
                      : undefined;
              const hint = stat.hint?.trim() || fallbackHint;

              return (
                <div
                  key={stat.key}
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
                    <p
                      className="flex items-center gap-1.5"
                      style={{ ...inter, fontWeight: 500, fontSize: "11px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}
                    >
                      {stat.label}
                      {hint ? <InfoTooltip content={hint} align="left" /> : null}
                    </p>
                    <p style={{ ...inter, fontWeight: 600, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-[12px] p-4 md:p-6" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-5">
              <div>
                <h2 style={{ ...inter, fontWeight: 700, fontSize: "22px", lineHeight: "22px", color: "#FFFFFF" }}>
                  Student List
                </h2>
                <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.45)", marginTop: "4px" }}>
                  {totalStudents} assigned {totalStudents === 1 ? "student" : "students"} · pilot content area: ELA (60 lessons)
                </p>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPrioritiesOpen(true)}
                    className="relative uppercase rounded-full px-4 py-2 hover:opacity-90 transition-opacity"
                    style={{
                      ...inter,
                      fontWeight: 700,
                      fontSize: "13px",
                      letterSpacing: "0.6px",
                      color: "#111023",
                      backgroundColor: priorities.length > 0 ? "#FF6F6F" : "#00CED1",
                    }}
                  >
                    Priorities
                    {priorities.length > 0 && (
                      <span className="ml-2 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-[#111023] text-[#FF6F6F] text-[10px]">
                        {priorities.length}
                      </span>
                    )}
                  </button>
                  <InfoTooltip content={WAYFINDER_DASHBOARD_HINTS.priorities} align="right" />
                </div>
                {totalStudents > 0 && (
                  <Link
                    href="/dashboard/students"
                    className="uppercase hover:opacity-80 transition-opacity"
                    style={{ ...inter, fontWeight: 700, fontSize: "13.5px", lineHeight: "18px", letterSpacing: "0.8px", color: "#00CED1" }}
                  >
                    View All
                  </Link>
                )}
              </div>
            </div>

            {students.length === 0 ? (
              <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)" }} className="py-8 text-center">
                No students assigned to you yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {students.map((student) => (
                  <DashboardStudentRow key={student.id} student={student} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <PrioritiesPanel
        open={prioritiesOpen}
        priorities={priorities}
        onClose={() => setPrioritiesOpen(false)}
      />
    </div>
  );
}
