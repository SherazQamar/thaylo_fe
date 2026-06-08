const STORAGE_KEY = "thaylo_pending_verification";

export interface PendingVerification {
  userId: number;
  email: string;
}

export function setPendingVerification(data: PendingVerification): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getPendingVerification(): PendingVerification | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingVerification;
  } catch {
    return null;
  }
}

export function clearPendingVerification(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

const RESEND_COOLDOWN_KEY = "thaylo_verify_resend_until";
export const RESEND_COOLDOWN_SECONDS = 90;

export function startResendCooldown(seconds = RESEND_COOLDOWN_SECONDS): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    RESEND_COOLDOWN_KEY,
    String(Date.now() + seconds * 1000),
  );
}

/** Starts the 90s wait once per visit; keeps an active countdown if already running. */
export function ensureInitialResendCooldown(
  seconds = RESEND_COOLDOWN_SECONDS,
): void {
  if (typeof window === "undefined") return;
  const until = sessionStorage.getItem(RESEND_COOLDOWN_KEY);
  if (!until) {
    startResendCooldown(seconds);
    return;
  }
  if (getResendCooldownRemainingSeconds() > 0) return;
  // Cooldown finished earlier — leave expired so resend button can show.
}

export function getResendCooldownRemainingSeconds(): number {
  if (typeof window === "undefined") return 0;
  const until = sessionStorage.getItem(RESEND_COOLDOWN_KEY);
  if (!until) return 0;
  return Math.max(0, Math.ceil((Number(until) - Date.now()) / 1000));
}

export function clearResendCooldown(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RESEND_COOLDOWN_KEY);
}

export function formatCooldown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
