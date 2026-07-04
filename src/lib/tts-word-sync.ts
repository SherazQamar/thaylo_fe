export function splitSpeakWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

export function estimateSpeakDurationMs(text: string, wordMs = 55): number {
  const count = splitSpeakWords(text).length;
  return Math.max(800, count * wordMs);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function revealWordsOnSchedule(
  words: string[],
  onWord: (index: number, word: string) => void,
  totalMs: number,
  isCancelled?: () => boolean,
): Promise<void> {
  if (words.length === 0) return;

  const perWord = totalMs / words.length;
  onWord(0, words[0]);

  for (let i = 1; i < words.length; i += 1) {
    await delay(perWord);
    if (isCancelled?.()) return;
    onWord(i, words[i]);
  }
}

type AudioSlot = { current: HTMLAudioElement | null };

export async function playAudioBlobWithWordSync(
  blob: Blob,
  words: string[],
  onWord: ((index: number, word: string) => void) | undefined,
  fallbackWordMs: number,
  isCancelled?: () => boolean,
  audioSlot?: AudioSlot,
): Promise<boolean> {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  if (audioSlot) {
    audioSlot.current?.pause();
    audioSlot.current = audio;
  }

  let wordTimer: ReturnType<typeof setInterval> | null = null;
  let startedPlaying = false;

  const clearWordTimer = () => {
    if (wordTimer) {
      clearInterval(wordTimer);
      wordTimer = null;
    }
  };

  const detachAudio = () => {
    if (audioSlot?.current === audio) {
      audioSlot.current = null;
    }
  };

  const fallbackDuration = estimateSpeakDurationMs(words.join(" "), fallbackWordMs);

  try {
    return await new Promise<boolean>((resolve) => {
      let settled = false;

      const finish = (played: boolean) => {
        if (settled) return;
        settled = true;
        clearWordTimer();
        audio.pause();
        detachAudio();
        URL.revokeObjectURL(url);
        resolve(played || startedPlaying);
      };

      const startWordSync = (durationMs: number) => {
        if (!onWord || words.length === 0 || isCancelled?.()) return;

        onWord(0, words[0]);
        if (words.length === 1) return;

        const msPerWord = durationMs / words.length;
        let idx = 1;
        wordTimer = setInterval(() => {
          if (isCancelled?.() || idx >= words.length) {
            clearWordTimer();
            return;
          }
          onWord(idx, words[idx]);
          idx += 1;
        }, msPerWord);
      };

      audio.onplaying = () => {
        startedPlaying = true;
      };

      audio.onloadedmetadata = () => {
        const durationMs =
          Number.isFinite(audio.duration) && audio.duration > 0
            ? audio.duration * 1000
            : fallbackDuration;
        startWordSync(durationMs);
      };

      audio.onended = () => finish(true);
      audio.onerror = () => finish(startedPlaying);

      void audio.play().catch(() => finish(false));

      setTimeout(
        () => finish(startedPlaying),
        Math.max(fallbackDuration * 3, 120_000),
      );
    });
  } catch {
    clearWordTimer();
    audio.pause();
    detachAudio();
    URL.revokeObjectURL(url);
    return false;
  }
}

export function stopAudioSlot(audioSlot?: AudioSlot) {
  if (!audioSlot?.current) return;
  audioSlot.current.pause();
  audioSlot.current = null;
}
