import { useCallback, useEffect, useState } from "react";
import {
  ensureInitialResendCooldown,
  getResendCooldownRemainingSeconds,
  RESEND_COOLDOWN_SECONDS,
  startResendCooldown,
} from "@/lib/pending-verification";

function readCooldownSeconds(): number {
  if (typeof window === "undefined") return RESEND_COOLDOWN_SECONDS;
  ensureInitialResendCooldown();
  return getResendCooldownRemainingSeconds();
}

export function useResendCooldown() {
  const [remaining, setRemaining] = useState(readCooldownSeconds);

  const syncRemaining = useCallback(() => {
    setRemaining(getResendCooldownRemainingSeconds());
  }, []);

  const restartCooldown = useCallback(() => {
    startResendCooldown(RESEND_COOLDOWN_SECONDS);
    setRemaining(RESEND_COOLDOWN_SECONDS);
  }, []);

  useEffect(() => {
    syncRemaining();
    const id = window.setInterval(syncRemaining, 1000);
    return () => window.clearInterval(id);
  }, [syncRemaining]);

  const canResend = remaining <= 0;

  return { remaining, canResend, restartCooldown, syncRemaining };
}
