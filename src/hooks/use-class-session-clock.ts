"use client";

import { useEffect, useState } from "react";

export function formatSessionClock(totalSeconds: number) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type UseClassSessionClockOptions = {
  active: boolean;
  totalMinutes: number;
  teachUntilMinute: number;
};

export function useClassSessionClock({
  active,
  totalMinutes,
  teachUntilMinute,
}: UseClassSessionClockOptions) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!active) {
      setElapsedSeconds(0);
      return;
    }

    const timerId = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [active]);

  const teachSeconds = teachUntilMinute * 60;
  const totalSeconds = totalMinutes * 60;
  const phase = elapsedSeconds >= teachSeconds ? "assessment" : "teach";

  return {
    elapsedSeconds,
    phase,
    teachSeconds,
    totalSeconds,
    isTeachWindowOver: elapsedSeconds >= teachSeconds,
    isClassTimeOver: elapsedSeconds >= totalSeconds,
    elapsedLabel: formatSessionClock(elapsedSeconds),
    phaseRemainingLabel:
      phase === "teach"
        ? formatSessionClock(Math.max(0, teachSeconds - elapsedSeconds))
        : formatSessionClock(Math.max(0, totalSeconds - elapsedSeconds)),
    phaseLabel: phase === "teach" ? "Teaching" : "Assessment",
  };
}
