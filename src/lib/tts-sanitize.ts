/**
 * Strip symbols that screen readers / TTS engines speak aloud (arrows, bullets, etc.).
 * Display text stays unchanged — use this only before speech synthesis.
 */
export function sanitizeTextForSpeech(text: string): string {
  return text
    .replace(/→/g, " to ")
    .replace(/->/g, " to ")
    .replace(/=>/g, " to ")
    .replace(/·/g, ", ")
    .replace(/•/g, "")
    .replace(/—/g, " ")
    .replace(/–/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
