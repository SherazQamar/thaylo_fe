"use client";

import type { OnboardingStatus } from "@/lib/onboarding-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type OnboardingBlockingModalProps = {
  displayName: string;
  portal: "parent" | "child";
  status: OnboardingStatus;
  onStart: () => void;
};

function getAssessmentTitle(status: OnboardingStatus) {
  const pending = status.walkthroughs.find(
    (item) => item.progressStatus !== "completed",
  );
  return pending?.title?.trim() || "Onboarding assessment";
}

export default function OnboardingBlockingModal({
  displayName,
  portal,
  status,
  onStart,
}: OnboardingBlockingModalProps) {
  const assessmentTitle = getAssessmentTitle(status);
  const progressLabel =
    status.requiredWalkthroughCount > 1
      ? `${status.completedWalkthroughCount} of ${status.requiredWalkthroughCount} assessments complete`
      : null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#111023]/30 px-4 py-8 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-blocking-title"
    >
      <div
        className="relative w-full max-w-[440px] overflow-hidden rounded-[24px] border p-8 text-center shadow-2xl"
        style={{
          backgroundColor: "#313044",
          borderColor: "rgba(0, 206, 209, 0.35)",
          boxShadow: "0 24px 80px rgba(0, 206, 209, 0.12)",
        }}
      >
        <div
          className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(0, 206, 209, 0.18)" }}
        />

        <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#00CED1]/30 bg-[#00CED1]/10">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00CED1"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 12h6" />
            <path d="M9 16h4" />
          </svg>
        </div>

        <p
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00CED1]"
          style={inter}
        >
          Onboarding assessment
        </p>

        <h2
          id="onboarding-blocking-title"
          className="mt-3 text-2xl font-bold leading-tight text-white"
          style={inter}
        >
          Hey {displayName},
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-white/70" style={inter}>
          You have an onboarding assessment to complete first before you can move on
          to your {portal === "parent" ? "parent" : "student"} dashboard.
        </p>

        <div
          className="mt-5 rounded-2xl border border-white/10 bg-[#111023]/80 px-4 py-3 text-left"
          style={inter}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Up next
          </p>
          <p className="mt-1 text-sm font-medium text-white">{assessmentTitle}</p>
          {progressLabel ? (
            <p className="mt-2 text-xs text-[#00CED1]">{progressLabel}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-7 w-full rounded-full bg-[#00CED1] px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-[#111023] transition-colors hover:bg-[#00B8BB]"
          style={inter}
        >
          Start now
        </button>

        <p className="mt-4 text-xs text-white/40" style={inter}>
          Complete this assessment to unlock your dashboard.
        </p>
      </div>
    </div>
  );
}
