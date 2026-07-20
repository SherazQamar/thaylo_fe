/** Suggested interest chips students/parents can pick (custom tags still allowed). */
export const CHILD_INTEREST_SUGGESTIONS = [
  "Animals",
  "Art",
  "Cooking",
  "Dance",
  "Games",
  "History",
  "Music",
  "Nature",
  "Outer Space",
  "Reading",
  "Science",
  "Sports",
  "Technology",
] as const;

/** Client-side filter for inappropriate custom interest text. */
const INAPPROPRIATE_PATTERNS: RegExp[] = [
  /\b(fuck|shit|bitch|asshole|bastard|cunt|dick|pussy|cock|slut|whore)\b/i,
  /\b(nigg(?:a|er)|fag(?:got)?|retard(?:ed)?)\b/i,
  /\b(kill\s+(?:myself|yourself|him|her|them)|suicide|self[\s-]?harm)\b/i,
  /\b(rape|molest|pedophil|porn|xxx|onlyfans)\b/i,
  /\b(cocaine|heroin|meth(?:amphetamine)?|weed\b|marijuana)\b/i,
  /https?:\/\//i,
  /www\./i,
];

export function isInappropriateInterest(raw: string): boolean {
  const text = raw.trim();
  if (!text) return false;
  return INAPPROPRIATE_PATTERNS.some((pattern) => pattern.test(text));
}

export function isInappropriateNote(raw: string): boolean {
  return isInappropriateInterest(raw);
}
