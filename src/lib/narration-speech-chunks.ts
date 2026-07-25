/**
 * Split instructor narration into LiveAvatar-friendly speak chunks.
 * Long single repeat() calls feel laggy; short sentences sync better with lips.
 */
export function splitNarrationForSpeech(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const parts = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  if (!parts?.length) return [trimmed];

  const sentences = parts.map((part) => part.trim()).filter(Boolean);
  if (sentences.length <= 1) return sentences;

  // Merge very short fragments so we don't over-chop ("Yes." + "Next.").
  const chunks: string[] = [];
  let buffer = "";
  for (const sentence of sentences) {
    const next = buffer ? `${buffer} ${sentence}` : sentence;
    const wordCount = next.split(/\s+/).filter(Boolean).length;
    if (buffer && wordCount > 28) {
      chunks.push(buffer);
      buffer = sentence;
    } else {
      buffer = next;
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks;
}
