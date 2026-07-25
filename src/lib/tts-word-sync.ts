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

/**
 * Reveal board words paced to a speak promise (e.g. LiveAvatar).
 * Uses minTotalMs as the target timeline; if speech ends early, remaining
 * words flush; if speech runs longer, we wait after the last word.
 */
export async function revealWordsAlignedToPromise(
  words: string[],
  onWord: (index: number, word: string) => void,
  speakPromise: Promise<unknown>,
  minTotalMs: number,
  isCancelled?: () => boolean,
): Promise<void> {
  let finished = false;
  const speakDone = Promise.resolve(speakPromise).finally(() => {
    finished = true;
  });

  if (words.length === 0) {
    await speakDone.catch(() => undefined);
    return;
  }

  const flushFrom = (startIndex: number) => {
    for (let j = startIndex; j < words.length; j += 1) {
      onWord(j, words[j]);
    }
  };

  onWord(0, words[0]);
  const start = Date.now();
  const safeTotalMs = Math.max(800, minTotalMs);

  for (let i = 1; i < words.length; i += 1) {
    if (isCancelled?.()) {
      await speakDone.catch(() => undefined);
      return;
    }
    if (finished) {
      flushFrom(i);
      await speakDone.catch(() => undefined);
      return;
    }

    const targetAt = (i / words.length) * safeTotalMs;
    const waitMs = Math.max(0, targetAt - (Date.now() - start));
    if (waitMs > 0) {
      await Promise.race([delay(waitMs), speakDone.then(() => undefined)]);
    }

    if (isCancelled?.()) {
      await speakDone.catch(() => undefined);
      return;
    }
    if (finished) {
      flushFrom(i);
      await speakDone.catch(() => undefined);
      return;
    }
    onWord(i, words[i]);
  }

  await speakDone.catch(() => undefined);
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
