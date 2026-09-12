/**
 * Keep instructor praise warm but even — explosive openers make TTS jump
 * from high energy into the next calm teach line (client tone feedback).
 */
export function normalizeInstructorFeedbackTone(text: string): string {
  let out = String(text ?? "").trim();
  if (!out) return "";

  out = out
    .replace(/\bBOOM!?\s*/gi, "")
    .replace(/\bBoom!?\s*/g, "")
    .replace(/\bYOU DID IT!?\s*/gi, "Nice work. ")
    .replace(/\bYou did it!?\s*/gi, "Nice work. ")
    .replace(/Perfect!/g, "Perfect.")
    .replace(/!{2,}/g, "!")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();

  // Avoid leading punctuation left after stripping openers.
  out = out.replace(/^[.!?,;:\s]+/, "").trim();

  return out;
}
