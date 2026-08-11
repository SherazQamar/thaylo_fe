"use client";

import { useQuery } from "@tanstack/react-query";
import { useNotifyError } from "@/hooks/use-notify-error";
import { formatOnboardingAnswerValue } from "@/lib/format-onboarding-answer";
import {
  fetchChildOnboardingResultsForParent,
  fetchOnboardingResults,
  type OnboardingResultItem,
} from "@/lib/onboarding-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ResultsMode =
  | { portal: "parent" }
  | { portal: "child" }
  | { portal: "parent-child"; childId: number };

interface OnboardingResultsPanelProps {
  mode: ResultsMode;
  title?: string;
  emptyMessage?: string;
}

function useOnboardingResults(mode: ResultsMode) {
  return useQuery({
    queryKey: [
      "onboarding-results",
      mode.portal,
      mode.portal === "parent-child" ? mode.childId : null,
    ],
    queryFn: () => {
      if (mode.portal === "parent-child") {
        return fetchChildOnboardingResultsForParent(mode.childId);
      }
      return fetchOnboardingResults(mode.portal);
    },
  });
}

function formatCompletedDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ResultCard({ item }: { item: OnboardingResultItem }) {
  return (
    <div
      className="rounded-[16px] p-5 space-y-4"
      style={{ backgroundColor: "#313044" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <p
            className="text-white font-semibold text-base"
            style={inter}
          >
            {item.walkthroughTitle}
          </p>
          <p className="text-white/50 text-sm mt-1" style={inter}>
            Answered by {item.respondentLabel}
            {item.audience === "STUDENT" ? " (student section)" : " (parent section)"}
          </p>
        </div>
        <p className="text-[#00CED1] text-xs font-medium shrink-0" style={inter}>
          Completed {formatCompletedDate(item.completedAt)}
        </p>
      </div>

      <div className="space-y-3">
        {item.answers.map((answer) => (
          <div
            key={`${item.sessionId}-${answer.questionKey}`}
            className="rounded-xl border border-white/10 bg-[#252436] px-4 py-3"
          >
            <p className="text-white/70 text-sm" style={inter}>
              {answer.questionTitle}
            </p>
            <p className="text-white font-medium text-sm mt-1" style={inter}>
              {formatOnboardingAnswerValue(answer.questionType, answer.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingResultsPanel({
  mode,
  title = "Assessment results",
  emptyMessage = "No completed assessments yet.",
}: OnboardingResultsPanelProps) {
  const { data, isLoading, isError, error } = useOnboardingResults(mode);
  const results = data?.results ?? [];

  useNotifyError(error, isError);

  return (
    <div className="space-y-4">
      <div>
        <h3
          className="text-white font-semibold text-base"
          style={inter}
        >
          {title}
        </h3>
        <p className="text-white/50 text-sm mt-1" style={inter}>
          Review answers from completed onboarding assessments.
        </p>
      </div>

      {isLoading && (
        <p className="text-white/50 text-sm" style={inter}>
          Loading assessment results…
        </p>
      )}

      {!isLoading && results.length === 0 && (
        <div
          className="rounded-[16px] px-5 py-8 text-center"
          style={{ backgroundColor: "#313044" }}
        >
          <p className="text-white/50 text-sm" style={inter}>
            {emptyMessage}
          </p>
        </div>
      )}

      {results.map((item) => (
        <ResultCard key={`${item.sessionId}-${item.walkthroughId}`} item={item} />
      ))}
    </div>
  );
}
