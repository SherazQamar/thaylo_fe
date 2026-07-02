"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ClassLiveRoom from "@/components/child/class/ClassLiveRoom";
import { fetchChildClassSession, type ChildClassSession } from "@/lib/curriculum-api";

export default function LessonPage() {
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
