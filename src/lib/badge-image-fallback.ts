/**
 * Resolve badge image URL candidates.
 * Prefer compact badge-small artwork for card/garden/message previews.
 */
export function badgeImageCandidates(
  primaryUrl?: string | null,
  options?: { preferSmall?: boolean },
): string[] {
  const raw = primaryUrl?.trim();
  if (!raw) return [];

  const preferSmall = options?.preferSmall ?? false;
  const dedup = new Set<string>();
  const push = (value: string) => {
    if (value) dedup.add(value);
  };

  const toSmall = (url: string) => {
    let next = url;
    if (next.includes("/Badges/")) {
      next = next.replace("/Badges/", "/badge-small/");
    }
    // sprout-streak.png -> sprout-streak-small.png
    next = next.replace(
      /\/([^/]+?)(?:-small)?\.(png|jpe?g)($|\?)/i,
      "/$1-small.$2$3",
    );
    return next;
  };

  const toOriginal = (url: string) => {
    let next = url;
    if (next.includes("/badge-small/")) {
      next = next.replace("/badge-small/", "/Badges/");
    }
    next = next.replace(/-small\.(png|jpe?g)($|\?)/i, ".$1$2");
    return next;
  };

  if (preferSmall) {
    push(toSmall(raw));
    if (raw.includes("/badge-small/") || /-small\.(png|jpe?g)($|\?)/i.test(raw)) {
      push(raw);
    }
    // Keep PNG/JPG variants within badge-small only (do not fall back to full Badges).
    for (const url of Array.from(dedup)) {
      if (url.match(/\.png($|\?)/i)) {
        push(url.replace(/\.png($|\?)/i, ".jpg$1"));
        push(url.replace(/\.png($|\?)/i, ".jpeg$1"));
      } else if (url.match(/\.jpe?g($|\?)/i)) {
        push(url.replace(/\.jpe?g($|\?)/i, ".png$1"));
      }
    }
    return Array.from(dedup);
  }

  push(raw);
  push(toOriginal(raw));
  push(toSmall(raw));

  for (const url of Array.from(dedup)) {
    if (url.match(/\.png($|\?)/i)) {
      push(url.replace(/\.png($|\?)/i, ".jpg$1"));
      push(url.replace(/\.png($|\?)/i, ".jpeg$1"));
    } else if (url.match(/\.jpe?g($|\?)/i)) {
      push(url.replace(/\.jpe?g($|\?)/i, ".png$1"));
    }
  }

  return Array.from(dedup);
}
