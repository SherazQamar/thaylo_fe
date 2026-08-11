"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { needsOnboardingBeforeClass } from "@/lib/onboarding-api";
import { fetchBloomBuddyStatus } from "@/lib/bloom-buddy-api";
import { fetchChildPretest } from "@/lib/badge-api";
import { startChildClass } from "@/lib/curriculum-api";
import { getStartClassErrorMessage } from "@/lib/child-class-messages";
import { useChildAssignedClasses } from "@/hooks/use-child-assigned-classes";
import { notify } from "@/lib/notify";

/**
 * Instant landing after Pathway "Start".
 * Child leaves Pathway immediately; this page runs gate checks and redirects.
 */
export default function ChildClassLaunchPage() {
  const router = useRouter();
  const { hasAssignedClass, isLoading: classesLoading } = useChildAssignedClasses();
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    if (classesLoading) return;

    let cancelled = false;

    async function run() {
      if (!hasAssignedClass) {
        router.replace("/child-dashboard");
        return;
      }

      try {
        try {
          const needsAssessment = await needsOnboardingBeforeClass();
          if (cancelled) return;
          if (needsAssessment) {
            router.replace("/child-onboarding?returnTo=lesson");
            return;
          }
        } catch {
          // Continue if onboarding status fails.
        }

        try {
          const bloomStatus = await fetchBloomBuddyStatus("BEFORE_LESSON");
          if (cancelled) return;
          if (bloomStatus.needsCheckIn) {
            router.replace("/child-dashboard/check-in");
            return;
          }
        } catch {
          // Continue if Bloom Buddy is unavailable.
        }

        try {
          const pretest = await fetchChildPretest();
          if (cancelled) return;
          if (pretest.available && pretest.questions.length > 0) {
            router.replace("/child-dashboard/pre-test");
            return;
          }
          const session = await startChildClass(pretest.curriculumId ?? undefined);
          if (cancelled) return;
          router.replace(`/child-dashboard/lesson?sessionId=${session.sessionId}`);
          return;
        } catch {
          // Fall through to plain lesson start.
        }

        const session = await startChildClass();
        if (cancelled) return;
        router.replace(`/child-dashboard/lesson?sessionId=${session.sessionId}`);
      } catch (err) {
        if (cancelled) return;
        notify.error(err, getStartClassErrorMessage(err));
        setHasFailed(true);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [router, hasAssignedClass, classesLoading]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#111023] px-4">
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        {hasFailed ? (
          <>
            <p className="text-sm text-white/60">We couldn&apos;t start your lesson.</p>
            <button
              type="button"
              onClick={() => router.replace("/child-dashboard")}
              className="rounded-full bg-[#00CED1] px-5 py-2.5 text-sm font-semibold text-[#111023]"
            >
              Back to Pathway
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#313044]/80 px-5 py-3 text-white/70">
            <span className="inline-block h-2 w-2 rounded-full bg-[#00CED1] animate-pulse" />
            <span className="text-sm">Getting your lesson ready…</span>
          </div>
        )}
      </div>
    </div>
  );
}
