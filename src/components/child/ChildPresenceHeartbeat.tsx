"use client";

import { useEffect, useRef } from "react";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

/** Keep presence fresh while the tab is visible; server online window is ~90s. */
const HEARTBEAT_INTERVAL_MS = 30_000;

async function sendChildHeartbeat() {
  await api.post<
    ApiResponse<{
      id: number;
      lastSeenAt: string;
      onlineWindowMs: number;
      isOnline: boolean;
    }>
  >("/child/presence/heartbeat", {}, { authMode: "child" });
}

/**
 * Marks the signed-in child Online for Wayfinder while they use the portal.
 * Stops when the tab is hidden so they fall to Idle after the server window.
 */
export default function ChildPresenceHeartbeat() {
  const inFlight = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const beat = async () => {
      if (cancelled || inFlight.current) return;
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }

      inFlight.current = true;
      try {
        await sendChildHeartbeat();
      } catch {
        // Non-blocking; auth failures handled by api interceptor.
      } finally {
        inFlight.current = false;
      }
    };

    void beat();
    const intervalId = window.setInterval(() => {
      void beat();
    }, HEARTBEAT_INTERVAL_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void beat();
      }
    };

    const onFocus = () => {
      void beat();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return null;
}
