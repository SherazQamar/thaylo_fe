"use client";

import { useEffect, useRef } from "react";
import { sendWayfinderHeartbeat } from "@/lib/wayfinder-api";

/** Keep presence fresh while the tab is visible; server online window is ~90s. */
const HEARTBEAT_INTERVAL_MS = 30_000;

/**
 * Keeps the authenticated wayfinder marked online while they use the dashboard.
 * Stops heartbeats when the tab is hidden; they fall offline after the server window.
 */
export default function WayfinderPresenceHeartbeat() {
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
        await sendWayfinderHeartbeat();
      } catch {
        // Non-blocking: next interval retries. Auth failures are handled by api interceptor.
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
