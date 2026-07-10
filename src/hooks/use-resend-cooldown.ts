import { useCallback, useEffect, useState } from "react";
import {
  ensureInitialResendCooldown,
  getResendCooldownRemainingSeconds,
  RESEND_COOLDOWN_SECONDS,
  startResendCooldown,
} from "@/lib/pending-verification";

export function useResendCooldown(options?: { skipInitialCooldown?: boolean }) {
  const skipInitial = options?.skipInitialCooldown ?? false;

  const [remaining, setRemaining] = useState(() => {
    if (typeof window === "undefined") return skipInitial ? 0 : RESEND_COOLDOWN_SECONDS;
    if (skipInitial) return getResendCooldownRemainingSeconds();
    ensureInitialResendCooldown();
    return getResendCooldownRemainingSeconds();
  });

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
