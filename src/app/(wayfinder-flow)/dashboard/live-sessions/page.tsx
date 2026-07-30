"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import InfoTooltip from "@/components/shared/InfoTooltip";
import PortalAvatar from "@/components/shared/PortalAvatar";
import { useNotifyError } from "@/hooks/use-notify-error";
import {
  fetchWayfinderLiveSessions,
  type WayfinderLiveSession,
  wayfinderQueryKeys,
} from "@/lib/wayfinder-api";
import { WAYFINDER_LIVE_HINTS } from "@/lib/portal-help-text";
import {
  formatElapsedTimer,
  formatLastActiveLabel,
  formatStudentGrade,
  formatWayfinderStudentName,
  riskBadgeColor,
} from "@/lib/wayfinder-student";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function LiveSessionRow({
  session,
  nowMs,
}: {
  session: WayfinderLiveSession;
  nowMs: number;
}) {
  const displayName = formatWayfinderStudentName(session);
  const startedMs = new Date(session.startedAt).getTime();
  const elapsedSeconds = Number.isFinite(startedMs)
    ? Math.max(0, Math.floor((nowMs - startedMs) / 1000))
    : session.elapsedSeconds;

  return (
    <div
      className="md:grid md:grid-cols-[1fr_1fr_1.3fr_1fr_auto] md:items-center rounded-[12px] px-4 md:px-5 py-3 gap-3 md:gap-4 flex flex-col"
      style={{ backgroundColor: "#313044" }}
    >
      <div className="flex items-center gap-2.5">
        <PortalAvatar name={displayName} avatarUrl={session.avatarUrl} size={36} />
        <div className="min-w-0">
          <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>
            {displayName}
          </p>
          <p style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "#858C94" }}>
            {formatStudentGrade(session.grade)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mt-2 md:mt-0">
        <div className="w-9 h-9 rounded-full bg-[#313044] border border-[#00CED1]/30 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22V8" />
            <path d="M5 12H2a10 10 0 0020 0h-3" />
            <path d="M8 5.2C9.2 3.6 10.5 3 12 3c1.5 0 2.8.6 4 2.2" />
          </svg>
        </div>
        <div>
          <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>
            {session.plantStage}
            <span style={{ ...inter, fontWeight: 500, fontSize: "11px", color: "rgba(255,255,255,0.45)", marginLeft: "6px" }}>
              · {session.contentArea}
            </span>
          </p>
          <p style={{ ...inter, fontWeight: 500, fontSize: "11px", lineHeight: "14px", color: "#00CED1" }}>
            {session.masteredLabel}
          </p>
        </div>
      </div>

      <div
        className="flex items-center min-h-[60px] md:min-h-[72px] rounded-[24px] mt-2 md:mt-0"
        style={{ backgroundColor: "#525162", padding: "10px 20px" }}
      >
        <div className="min-w-0">
          <div className="flex items-start gap-2.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00CED1] mt-1.5 flex-shrink-0" />
            <div className="min-w-0">
              <p style={{ ...inter, fontWeight: 500, fontSize: "11px", lineHeight: "14px", color: "rgba(255,255,255,0.5)" }}>
                In lesson
              </p>
              <p
                style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "18px", color: "#FFFFFF" }}
                title={session.currentLessonTitle}
                className="truncate"
              >
                {session.currentLessonTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 pl-5">
            <span
              className="flex items-center gap-1.5"
              style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}
            >
              Risk
              <InfoTooltip content={WAYFINDER_LIVE_HINTS.risk} align="left" />
            </span>
            <span
              className="rounded-full px-2.5 py-0.5"
              style={{
                backgroundColor: riskBadgeColor(session.risk),
                ...inter,
                fontWeight: 500,
                fontSize: "10px",
                lineHeight: "14px",
                color: "#111023",
              }}
            >
              {session.risk}
            </span>
          </div>
        </div>
      </div>

      <div
        className="flex items-center h-[60px] md:h-[72px] rounded-[24px] mt-2 md:mt-0"
        style={{ backgroundColor: "#525162", padding: "10px 24px" }}
      >
        <div>
          <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>
            Timer: {formatElapsedTimer(elapsedSeconds)}
          </p>
          <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>
            {formatLastActiveLabel(session.lastActiveAt)}
          </p>
        </div>
      </div>

      <Link
        href={`/dashboard/message?studentId=${session.childId}&contact=child`}
        className="uppercase flex-shrink-0 hover:opacity-80 transition-opacity whitespace-nowrap mt-2 md:mt-0 self-start md:self-center"
        style={{ ...inter, fontWeight: 700, fontSize: "13.5px", lineHeight: "18px", letterSpacing: "0.8px", color: "#00CED1" }}
      >
        Open Chat
      </Link>
    </div>
  );
}

export default function LiveSessionsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const tick = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  const liveQuery = useQuery({
    queryKey: wayfinderQueryKeys.liveSessions({ search: debouncedSearch || undefined }),
    queryFn: () => fetchWayfinderLiveSessions({ search: debouncedSearch || undefined }),
    refetchInterval: 15_000,
  });

  const items = liveQuery.data?.items ?? [];

  const gradeOptions = useMemo(() => {
    const grades = new Set(items.map((s) => s.grade).filter(Boolean) as string[]);
    return [...grades].sort();
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((s) => {
      if (gradeFilter && s.grade !== gradeFilter) return false;
      if (riskFilter && s.risk !== riskFilter) return false;
      return true;
    });
  }, [items, gradeFilter, riskFilter]);

  useNotifyError(liveQuery.error, liveQuery.isError);

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h1
          className="uppercase"
          style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
        >
          Live Sessions
        </h1>
        <div className="hidden md:block">
          <UserDropdown />
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/dashboard", label: "Wayfinder Dashboard" },
          { href: "/dashboard/live-sessions", label: "Live Sessions" },
        ]}
      />

      <div className="rounded-[12px] p-4 md:p-6 mt-6 md:mt-8" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-5">
          <div>
            <h2 style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "24px", color: "#FFFFFF" }}>
              Student List
            </h2>
            <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "4px" }}>
              {filtered.length} live {filtered.length === 1 ? "session" : "sessions"}
              {liveQuery.isFetching ? " · updating…" : ""}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
            <div
              className="rounded-full px-5 py-3 flex items-center gap-2.5 flex-1 sm:flex-none"
              style={{ backgroundColor: "#313044", border: "1px solid #525162" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                placeholder="Search Students"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-white/80 placeholder-white/40 w-full md:w-[220px]"
                style={{ ...inter, fontWeight: 400, fontSize: "14px" }}
              />
            </div>
            <div className="flex gap-2">
              <label className="rounded-full px-4 py-2.5 flex items-center gap-2 cursor-pointer flex-1 sm:flex-none" style={{ backgroundColor: "#313044", border: "1px solid #525162" }}>
                <span style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>Risk</span>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="bg-transparent outline-none text-white/80"
                  style={{ ...inter, fontWeight: 500, fontSize: "13px" }}
                >
                  <option value="">All</option>
                  <option value="Clear">Clear</option>
                  <option value="Amber">Amber</option>
                  <option value="Orange">Orange</option>
                  <option value="Red">Red</option>
                </select>
              </label>
              <label className="rounded-full px-4 py-2.5 flex items-center gap-2 cursor-pointer flex-1 sm:flex-none" style={{ backgroundColor: "#313044", border: "1px solid #525162" }}>
                <span style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>Grade</span>
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="bg-transparent outline-none text-white/80"
                  style={{ ...inter, fontWeight: 500, fontSize: "13px" }}
                >
                  <option value="">All</option>
                  {gradeOptions.map((g) => (
                    <option key={g} value={g}>
                      {formatStudentGrade(g)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        {liveQuery.isLoading && (
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)" }} className="py-10 text-center">
            Loading live sessions…
          </p>
        )}

        {!liveQuery.isLoading && !liveQuery.isError && filtered.length === 0 && (
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)" }} className="py-10 text-center">
            {debouncedSearch || gradeFilter || riskFilter
              ? "No live sessions match your filters."
              : "No students are in a lesson right now."}
          </p>
        )}

        <div className="flex flex-col gap-3 md:gap-2">
          {filtered.map((session) => (
            <LiveSessionRow key={session.sessionId} session={session} nowMs={nowMs} />
          ))}
        </div>
      </div>
    </div>
  );
}
