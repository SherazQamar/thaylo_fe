/** Live session timer from admin AI settings (5–15 min). Lesson content is always 15 min. */
export const CLASS_SESSION_TIMER_MIN_MINUTES = 5;
export const CLASS_SESSION_TIMER_MAX_MINUTES = 15;
export const CLASS_SESSION_TIMER_DEFAULT_MINUTES = 15;

export function clampClassSessionTimerMinutes(value: number): number {
  if (!Number.isFinite(value)) {
    return CLASS_SESSION_TIMER_DEFAULT_MINUTES;
  }
  return Math.min(
    CLASS_SESSION_TIMER_MAX_MINUTES,
    Math.max(CLASS_SESSION_TIMER_MIN_MINUTES, Math.round(value)),
  );
}

/** Last 3 minutes of the live session are reserved for Quick Check. */
export function computeTeachUntilMinute(sessionTimerMinutes: number): number {
  const duration = clampClassSessionTimerMinutes(sessionTimerMinutes);
  return Math.max(2, duration - 3);
}
