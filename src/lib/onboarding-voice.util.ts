function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenOverlapScore(spoken: string, option: string) {
  const spokenTokens = new Set(normalize(spoken).split(" ").filter(Boolean));
  const optionTokens = normalize(option).split(" ").filter(Boolean);
  if (optionTokens.length === 0) return 0;
  const hits = optionTokens.filter((token) => spokenTokens.has(token)).length;
  return hits / optionTokens.length;
}

export function matchSpokenToOption(
  spoken: string,
  options: string[],
): string | null {
  if (!spoken.trim() || options.length === 0) return null;

  const normalizedSpoken = normalize(spoken);

  const exact = options.find((option) => normalize(option) === normalizedSpoken);
  if (exact) return exact;

  const contains = options.find((option) => {
    const normalizedOption = normalize(option);
    return (
      normalizedSpoken.includes(normalizedOption) ||
      normalizedOption.includes(normalizedSpoken)
    );
  });
  if (contains) return contains;

  let best: { option: string; score: number } | null = null;
  for (const option of options) {
    const score = tokenOverlapScore(spoken, option);
    if (!best || score > best.score) {
      best = { option, score };
    }
  }

  return best && best.score >= 0.5 ? best.option : null;
}

export function matchSpokenToMatrixItems(
  spoken: string,
  items: string[],
): string[] {
  if (!spoken.trim() || items.length === 0) return [];

  const matched = items.filter((item) => {
    const normalizedItem = normalize(item);
    const normalizedSpoken = normalize(spoken);
    return (
      normalizedSpoken.includes(normalizedItem) ||
      tokenOverlapScore(spoken, item) >= 0.6
    );
  });

  return matched.length > 0 ? matched : [];
}

export function applyVoiceToDraft(
  spoken: string,
  questionType: string,
  draft: {
    selectedOption?: string;
    text?: string;
    selectedOptions?: string[];
  },
  options: string[] = [],
  matrixItems: string[] = [],
) {
  const trimmed = spoken.trim();
  if (!trimmed) return draft;

  switch (questionType) {
    case "MCQ": {
      const matched = matchSpokenToOption(trimmed, options);
      return matched ? { ...draft, selectedOption: matched } : draft;
    }
    case "OPEN_TEXT":
      return { ...draft, text: trimmed };
    case "OPEN_THEN_MCQ": {
      if (options.length > 0) {
        const matched = matchSpokenToOption(trimmed, options);
        if (matched) {
          return { ...draft, selectedOption: matched };
        }
      }
      return { ...draft, text: trimmed };
    }
    case "ICON_MATRIX": {
      const matched = matchSpokenToMatrixItems(trimmed, matrixItems);
      if (matched.length === 0) return draft;
      const existing = new Set(draft.selectedOptions ?? []);
      matched.forEach((item) => existing.add(item));
      return { ...draft, selectedOptions: Array.from(existing) };
    }
    default:
      return { ...draft, text: trimmed };
  }
}
