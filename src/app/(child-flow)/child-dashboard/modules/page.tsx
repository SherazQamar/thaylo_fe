"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { useNotifyError } from "@/hooks/use-notify-error";
import {
  fetchChildModulesOverview,
  type ChildModuleFamily,
  type ChildModuleLesson,
} from "@/lib/curriculum-api";
import { navigateToChildClass } from "@/lib/start-child-class";
import { notify } from "@/lib/notify";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function statusLabel(status: ChildModuleLesson["status"]) {
  switch (status) {
    case "mastered":
      return "Mastered";
    case "current":
      return "Up next";
    case "available":
      return "Ready";
    default:
      return "Coming soon";
  }
}

function statusColor(status: ChildModuleLesson["status"]) {
  switch (status) {
    case "mastered":
      return "#60D624";
    case "current":
      return "#00CED1";
    case "available":
      return "#F59E0B";
    default:
      return "rgba(255,255,255,0.4)";
  }
}

function FamilyPanel({
  family,
  active,
  onSelect,
}: {
  family: ChildModuleFamily;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        "w-full rounded-2xl px-4 py-3 text-left transition-colors " +
        (active ? "bg-[#00CED1]/15 ring-1 ring-[#00CED1]/40" : "bg-[#313044] hover:bg-[#3a3954]")
      }
    >
      <div className="flex items-center justify-between gap-2">
        <p style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>
          {family.name}
        </p>
        <span style={{ ...inter, fontWeight: 600, fontSize: "12px", color: "#00CED1" }}>
          {family.progressPercent}%
        </span>
      </div>
      <p style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
        {family.masteredCount} of {family.lessonCount || family.lessons.length} in this track
      </p>
      <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#00CED1]"
          style={{ width: `${Math.min(100, family.progressPercent)}%` }}
        />
      </div>
    </button>
  );
}

export default function ChildModulesPage() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);

  const modulesQuery = useQuery({
    queryKey: ["child", "classes", "modules"],
    queryFn: fetchChildModulesOverview,
  });
  useNotifyError(modulesQuery.error, modulesQuery.isError);

  const data = modulesQuery.data;
  const familiesWithLessons = useMemo(
    () => (data?.families ?? []).filter((f) => f.lessons.length > 0),
    [data],
  );
  const [activeFamily, setActiveFamily] = useState<string | null>(null);

  const selectedFamily =
    familiesWithLessons.find((f) => f.name === activeFamily) ??
    familiesWithLessons.find((f) => f.lessons.some((l) => l.status === "current")) ??
    familiesWithLessons[0] ??
    null;

  const handleContinue = async () => {
    if (starting || !data?.curriculumId) return;
    setStarting(true);
    try {
      await navigateToChildClass(router, false);
    } catch (err) {
      notify.error(err, "Unable to start the next lesson.");
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h1
          className="uppercase"
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "25px",
            letterSpacing: "0.8px",
            color: "#DCE6EC",
          }}
        >
          Modules
        </h1>
        <div className="hidden md:block">
          <ChildUserDropdown />
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/child-dashboard", label: "Pathway" },
          { href: "/child-dashboard/modules", label: "Modules" },
        ]}
      />

      {modulesQuery.isLoading ? (
        <p className="mt-10 text-center text-white/50 text-sm">Loading your modules…</p>
      ) : !data ? (
        <p className="mt-10 text-center text-white/50 text-sm">No curriculum assigned yet.</p>
      ) : (
        <>
          <div
            className="mt-6 rounded-2xl p-5 md:p-6"
            style={{ backgroundColor: "#313044" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p
                  style={{
                    ...inter,
                    fontWeight: 500,
                    fontSize: "11px",
                    letterSpacing: "0.8px",
                    color: "#00CED1",
                    textTransform: "uppercase",
                  }}
                >
                  Grade {data.gradeLevel} · {data.subject}
                </p>
                <h2
                  style={{
                    ...inter,
                    fontWeight: 700,
                    fontSize: "22px",
                    color: "#FFFFFF",
                    marginTop: 6,
                  }}
                >
                  {data.title}
                </h2>
                <p
                  style={{
                    ...inter,
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.55)",
                    marginTop: 6,
                  }}
                >
                  {data.completedLessonCount} of {data.publishedLessonCount} lessons mastered
                  {data.catalogLessonCount > data.publishedLessonCount
                    ? ` · full track has ${data.catalogLessonCount}`
                    : ""}
                </p>
              </div>
              <div className="text-right">
                <p style={{ ...inter, fontWeight: 700, fontSize: "28px", color: "#00CED1" }}>
                  {data.overallProgressPercent}%
                </p>
                <p style={{ ...inter, fontWeight: 500, fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                  Overall progress
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#60D624]"
                style={{ width: `${Math.min(100, data.overallProgressPercent)}%` }}
              />
            </div>

            {data.nextLessonTitle ? (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                    {data.needsRetake ? "Retake next" : "Continue with"}
                    {data.focusArea ? ` · ${data.focusArea}` : ""}
                  </p>
                  <p style={{ ...inter, fontWeight: 600, fontSize: "15px", color: "#FFFFFF", marginTop: 2 }}>
                    {data.nextLessonTitle}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={starting || !data.curriculumId}
                  onClick={() => void handleContinue()}
                  className="rounded-full bg-[#00CED1] px-5 py-2.5 text-sm font-semibold text-[#111023] disabled:opacity-50"
                >
                  {starting ? "Starting…" : data.needsRetake ? "Retake lesson" : "Continue"}
                </button>
              </div>
            ) : (
              <p className="mt-5 text-sm text-[#60D624]" style={inter}>
                You finished every lesson in this track. Great work!
              </p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
            <div className="flex flex-col gap-2">
              <p
                style={{
                  ...inter,
                  fontWeight: 600,
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              >
                Skill families
              </p>
              {familiesWithLessons.map((family) => (
                <FamilyPanel
                  key={family.name}
                  family={family}
                  active={selectedFamily?.name === family.name}
                  onSelect={() => setActiveFamily(family.name)}
                />
              ))}
            </div>

            <div className="rounded-2xl p-4 md:p-5" style={{ backgroundColor: "#313044" }}>
              <h3 style={{ ...inter, fontWeight: 700, fontSize: "18px", color: "#FFFFFF" }}>
                {selectedFamily?.name ?? "Lessons"}
              </h3>
              <p
                style={{
                  ...inter,
                  fontWeight: 400,
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                  marginTop: 4,
                  marginBottom: 16,
                }}
              >
                Lessons in your published track are ready. Locked items unlock when more of the
                full {data.catalogLessonCount}-lesson path is released.
              </p>

              <div className="flex flex-col gap-2">
                {(selectedFamily?.lessons ?? []).map((lesson) => {
                  const canStart =
                    lesson.status === "current" || lesson.status === "available";
                  return (
                    <div
                      key={lesson.key}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3"
                      style={{ backgroundColor: "#252338" }}
                    >
                      <div className="min-w-0">
                        <p style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>
                          Lesson {lesson.order}: {lesson.title}
                        </p>
                        <p
                          style={{
                            ...inter,
                            fontWeight: 500,
                            fontSize: "11px",
                            color: statusColor(lesson.status),
                            marginTop: 2,
                          }}
                        >
                          {statusLabel(lesson.status)}
                          {lesson.status !== "locked"
                            ? ` · ~${lesson.estimatedMinutes} min`
                            : ""}
                        </p>
                      </div>
                      {canStart ? (
                        <button
                          type="button"
                          disabled={starting}
                          onClick={() => void handleContinue()}
                          className="shrink-0 rounded-full border border-[#00CED1]/40 px-3 py-1.5 text-xs font-semibold text-[#00CED1] hover:bg-[#00CED1]/10 disabled:opacity-50"
                        >
                          {lesson.status === "current" ? "Start" : "Open path"}
                        </button>
                      ) : null}
                    </div>
                  );
                })}
                {(selectedFamily?.lessons.length ?? 0) === 0 ? (
                  <p className="text-sm text-white/45 py-6 text-center">
                    No lessons in this family for the current track yet.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
