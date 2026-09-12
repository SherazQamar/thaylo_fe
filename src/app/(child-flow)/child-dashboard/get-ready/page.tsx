"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchChildPretest } from "@/lib/badge-api";
import { startChildClass } from "@/lib/curriculum-api";

export default function GetReadyForLessonPage() {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const pretest = await fetchChildPretest();
        if (cancelled) return;

        // If mastery is already strong enough, skip lesson entirely.
        if (pretest.available && pretest.questions.length > 0) {
          router.replace("/child-dashboard/pre-test");
          return;
        }

        // Otherwise start the lesson session immediately.
        const session = await startChildClass(pretest.curriculumId ?? undefined);
        router.replace(`/child-dashboard/lesson?sessionId=${session.sessionId}`);
      } catch {
        // If anything fails, fall back to the previous behavior (lesson start).
        const session = await startChildClass();
        router.replace(`/child-dashboard/lesson?sessionId=${session.sessionId}`);
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-transparent">
      {isChecking ? (
        <div className="absolute inset-0 z-20 flex items-end justify-center pb-[env(safe-area-inset-bottom,16px)] px-4 sm:items-center sm:pb-0 pointer-events-none">
          <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#111023]/60 px-4 py-2.5 text-white/60 sm:gap-3 sm:px-5 sm:py-3">
            <span className="inline-block h-2 w-2 rounded-full bg-[#00CED1] animate-pulse" />
            <span className="text-[13px] sm:text-sm">Personalizing your lesson…</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

