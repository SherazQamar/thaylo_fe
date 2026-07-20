"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import {
  getApiErrorMessage,
  isIgnorableRequestError,
} from "@/lib/auth-api";
import {
  downloadParentProgressReportPdf,
  fetchParentChildren,
  fetchParentProgressReport,
  type ParentProgressReport,
} from "@/lib/parent-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function defaultRange() {
  const until = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return {
    from: toDateInputValue(from),
    until: toDateInputValue(until),
  };
}

function formatMinutes(minutes: number): string {
  const rounded = Math.max(0, Math.round(minutes));
  if (rounded < 60) return `${rounded} min`;
  const h = Math.floor(rounded / 60);
  const m = rounded % 60;
  if (m === 0) return `${h} hr${h === 1 ? "" : "s"}`;
  return `${h} hr${h === 1 ? "" : "s"} ${m} min`;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 100);
}

export default function ParentReportsPage() {
  const initial = useMemo(() => defaultRange(), []);
  const [childId, setChildId] = useState<number | "">("");
  const [from, setFrom] = useState(initial.from);
  const [until, setUntil] = useState(initial.until);
  const [preview, setPreview] = useState<ParentProgressReport | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const downloadAbortRef = useRef<AbortController | null>(null);
  const downloadRequestIdRef = useRef(0);

  const childrenQuery = useQuery({
    queryKey: ["parent", "children"],
    queryFn: fetchParentChildren,
  });

  useEffect(() => {
    if (childId !== "" || !childrenQuery.data?.length) return;
    setChildId(childrenQuery.data[0].id);
  }, [childId, childrenQuery.data]);

  const previewMutation = useMutation({
    mutationFn: () => {
      if (childId === "") {
        throw new Error("Select a child first.");
      }
      if (!from || !until) {
        throw new Error("Choose both start and end dates.");
      }
      if (from > until) {
        throw new Error("Start date must be on or before end date.");
      }
      return fetchParentProgressReport({
        childId: Number(childId),
        from,
        until,
      });
    },
    onSuccess: (data) => {
      setPreview(data);
      setPreviewError(null);
      setDownloadError(null);
    },
    onError: (err) => {
      setPreview(null);
      setPreviewError(getApiErrorMessage(err));
    },
  });

  const downloadMutation = useMutation({
    scope: { id: "parent-progress-report-download" },
    onMutate: () => {
      downloadAbortRef.current?.abort();
      const controller = new AbortController();
      downloadAbortRef.current = controller;
      const requestId = ++downloadRequestIdRef.current;
      setDownloadError(null);
      return { requestId, signal: controller.signal };
    },
    mutationFn: async () => {
      if (childId === "") {
        throw new Error("Select a child first.");
      }

      const blob = await downloadParentProgressReportPdf(
        {
          childId: Number(childId),
          from,
          until,
        },
        { signal: downloadAbortRef.current?.signal },
      );

      const childName =
        preview?.childName?.replace(/\s+/g, "-").toLowerCase() || "child";

      return {
        blob,
        filename: `thaylo-progress-${childName}-${from}-to-${until}.pdf`,
        requestId: downloadRequestIdRef.current,
      };
    },
    onSuccess: (data) => {
      if (data.requestId !== downloadRequestIdRef.current) return;
      setDownloadError(null);
      setPreviewError(null);
      triggerBlobDownload(data.blob, data.filename);
    },
    onError: (err, _vars, context) => {
      if (isIgnorableRequestError(err)) return;
      if (context?.requestId !== downloadRequestIdRef.current) return;
      const message = getApiErrorMessage(err);
      if (message) setDownloadError(message);
    },
  });

  function handlePreview() {
    setPreviewError(null);
    previewMutation.mutate();
  }

  function handleDownload() {
    setDownloadError(null);
    downloadMutation.mutate();
  }

  return (
    <div className="p-4 md:p-5 lg:p-6 overflow-y-auto scrollbar-hide h-full">
      <div className="flex flex-col gap-1 mb-5">
        <div className="flex items-center justify-between">
          <h1
            className="uppercase"
            style={{
              ...inter,
              fontWeight: 700,
              fontSize: "22px",
              letterSpacing: "0.8px",
              color: "#DCE6EC",
            }}
          >
            Reports
          </h1>
          <div className="hidden md:block">
            <ParentUserDropdown />
          </div>
        </div>
        <Breadcrumbs
          showHome={false}
          items={[
            { href: "/parent-dashboard", label: "Parent Dashboard" },
            { href: "/parent-dashboard/reports", label: "Reports" },
          ]}
        />
      </div>

      <div className="mb-6">
        <h2
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "20px",
            color: "#FFFFFF",
            marginBottom: "4px",
          }}
        >
          PDF progress report
        </h2>
        <p
          style={{
            ...inter,
            fontWeight: 400,
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Choose a child and date range, preview the report, then download the
          PDF.
        </p>
      </div>

      <div
        className="rounded-[16px] p-5 md:p-6 mb-6"
        style={{ backgroundColor: "#313044" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label
              style={{
                ...inter,
                fontWeight: 500,
                fontSize: "13px",
                color: "rgba(255,255,255,0.7)",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Child
            </label>
            <select
              value={childId === "" ? "" : String(childId)}
              onChange={(e) => {
                setChildId(e.target.value ? Number(e.target.value) : "");
                setPreview(null);
              }}
              className="w-full rounded-full px-4 py-3 outline-none text-white"
              style={{
                backgroundColor: "#525162",
                ...inter,
                fontSize: "14px",
              }}
            >
              {(childrenQuery.data ?? []).map((child) => (
                <option key={child.id} value={child.id}>
                  {child.userName}
                  {child.grade ? ` · Grade ${child.grade}` : ""}
                </option>
              ))}
              {!childrenQuery.data?.length && (
                <option value="">No children yet</option>
              )}
            </select>
          </div>
          <div>
            <label
              style={{
                ...inter,
                fontWeight: 500,
                fontSize: "13px",
                color: "rgba(255,255,255,0.7)",
                display: "block",
                marginBottom: "6px",
              }}
            >
              From
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPreview(null);
              }}
              className="w-full rounded-full px-4 py-3 outline-none text-white"
              style={{
                backgroundColor: "#525162",
                ...inter,
                fontSize: "14px",
                colorScheme: "dark",
              }}
            />
          </div>
          <div>
            <label
              style={{
                ...inter,
                fontWeight: 500,
                fontSize: "13px",
                color: "rgba(255,255,255,0.7)",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Until
            </label>
            <input
              type="date"
              value={until}
              onChange={(e) => {
                setUntil(e.target.value);
                setPreview(null);
              }}
              className="w-full rounded-full px-4 py-3 outline-none text-white"
              style={{
                backgroundColor: "#525162",
                ...inter,
                fontSize: "14px",
                colorScheme: "dark",
              }}
            />
          </div>
        </div>

        {(previewError || downloadError) && (
          <div className="mb-4 space-y-2">
            {previewError && (
              <p className="text-sm text-red-400" role="alert" style={inter}>
                Preview: {previewError}
              </p>
            )}
            {downloadError && (
              <p className="text-sm text-red-400" role="alert" style={inter}>
                Download: {downloadError}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePreview}
            disabled={previewMutation.isPending || childId === ""}
            className="rounded-full px-5 py-2.5 cursor-pointer hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: "#00CED1",
              ...inter,
              fontWeight: 600,
              fontSize: "14px",
              color: "#111023",
            }}
          >
            {previewMutation.isPending ? "Loading preview…" : "Preview report"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={
              downloadMutation.isPending ||
              !preview ||
              !preview.pdfConsentGranted
            }
            className="rounded-full px-5 py-2.5 cursor-pointer hover:bg-white/10 disabled:opacity-50"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              ...inter,
              fontWeight: 600,
              fontSize: "14px",
              color: "#FFFFFF",
            }}
            title={
              preview && !preview.pdfConsentGranted
                ? "PDF export consent was not granted for this child"
                : undefined
            }
          >
            {downloadMutation.isPending ? "Downloading…" : "Download PDF"}
          </button>
        </div>
      </div>

      {preview && (
        <div
          className="rounded-[16px] p-5 md:p-6"
          style={{
            backgroundColor: "#FFFFFF",
            color: "#111023",
          }}
        >
          <p
            style={{
              ...inter,
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "0.6px",
              color: "#006680",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Preview
          </p>
          <h3
            style={{
              ...inter,
              fontWeight: 700,
              fontSize: "22px",
              color: "#00334D",
              marginBottom: "4px",
            }}
          >
            THAYLO progress report
          </h3>
          <p style={{ ...inter, fontSize: "14px", color: "#444", marginBottom: "18px" }}>
            {preview.childName}
            {preview.grade ? ` · Grade ${preview.grade}` : ""} · {preview.from}{" "}
            → {preview.until}
          </p>

          {!preview.pdfConsentGranted && (
            <p
              className="mb-4 rounded-[10px] px-3 py-2"
              style={{
                ...inter,
                fontSize: "13px",
                backgroundColor: "#FFF4E5",
                color: "#8A5A00",
              }}
            >
              PDF download is blocked because PDF progress report consent was
              not granted for this child.
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard
              label="Mastery of attempted"
              value={`${preview.masteryPercent}%`}
            />
            <StatCard
              label="Passed / attempted"
              value={`${preview.lessonsPassed} / ${preview.lessonsAttempted}`}
            />
            <StatCard
              label="Time in lessons"
              value={formatMinutes(preview.totalMinutes)}
            />
            <StatCard
              label="Avg assessment score"
              value={
                preview.averageScorePercent != null
                  ? `${preview.averageScorePercent}%`
                  : "—"
              }
            />
          </div>

          <p style={{ ...inter, fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>
            SEL check-ins
          </p>
          <p style={{ ...inter, fontSize: "14px", color: "#444", marginBottom: "18px" }}>
            Happy {preview.selHappy} · Uncertain {preview.selConfused} · Low
            mood {preview.selSad}
          </p>

          <p style={{ ...inter, fontWeight: 700, fontSize: "15px", marginBottom: "10px" }}>
            Lessons in range
          </p>
          {preview.lessons.length === 0 ? (
            <p style={{ ...inter, fontSize: "14px", color: "#666" }}>
              No lesson sessions in this date range.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={inter}>
                <thead>
                  <tr style={{ fontSize: "12px", color: "#666" }}>
                    <th className="py-2 pr-3 font-semibold">Lesson</th>
                    <th className="py-2 pr-3 font-semibold">Date</th>
                    <th className="py-2 pr-3 font-semibold">Status</th>
                    <th className="py-2 pr-3 font-semibold">Result</th>
                    <th className="py-2 pr-3 font-semibold">Score</th>
                    <th className="py-2 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.lessons.map((lesson) => (
                    <tr
                      key={`${lesson.lessonKey}-${lesson.startedAt}`}
                      style={{
                        fontSize: "13px",
                        borderTop: "1px solid #E8E8EE",
                      }}
                    >
                      <td className="py-2.5 pr-3">{lesson.lessonTitle}</td>
                      <td className="py-2.5 pr-3">
                        {new Date(lesson.startedAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 pr-3">{lesson.status}</td>
                      <td className="py-2.5 pr-3">
                        {lesson.passed === true
                          ? "Passed"
                          : lesson.passed === false
                            ? "Not passed"
                            : "—"}
                      </td>
                      <td className="py-2.5 pr-3">
                        {lesson.scoreCorrect != null &&
                        lesson.scoreTotal != null
                          ? `${lesson.scoreCorrect}/${lesson.scoreTotal}`
                          : "—"}
                      </td>
                      <td className="py-2.5">
                        {formatMinutes(lesson.durationMinutes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-[12px] px-3 py-3"
      style={{ backgroundColor: "#F4F7F9" }}
    >
      <p
        style={{
          ...inter,
          fontSize: "11px",
          color: "#667",
          marginBottom: "4px",
        }}
      >
        {label}
      </p>
      <p style={{ ...inter, fontWeight: 700, fontSize: "18px", color: "#00334D" }}>
        {value}
      </p>
    </div>
  );
}
