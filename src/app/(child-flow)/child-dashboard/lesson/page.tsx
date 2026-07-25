"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ClassLiveRoom from "@/components/child/class/ClassLiveRoom";
import { fetchChildClassSession, type ChildClassSession } from "@/lib/curriculum-api";

function LessonPageContent() {
  const searchParams = useSearchParams();
  const sessionId = Number(searchParams.get("sessionId"));
  const [session, setSession] = useState<ChildClassSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(sessionId)) {
      setLoadError("No class session found. Start a class from your learning path.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    fetchChildClassSession(sessionId)
      .then((data) => {
        if (!cancelled) {
          setSession(data);
          setLoadError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError("Unable to load your class session.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <ClassLiveRoom session={session} isLoading={isLoading} loadError={loadError} />
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-white/50 text-sm">
          Loading class…
        </div>
      }
    >
      <LessonPageContent />
    </Suspense>
  );
}
