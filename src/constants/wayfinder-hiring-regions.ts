/**
 * Hiring / coverage regions for US Wayfinders.
 * Timezone follows the region they were hired for (operational hours),
 * not necessarily where they live.
 */
export const WAYFINDER_HIRING_REGIONS = [
  {
    code: "US-Pacific",
    label: "US Pacific (West Coast hours)",
    timeZone: "America/Los_Angeles",
    timeZoneLabel: "Pacific Time (PT)",
  },
  {
    code: "US-Mountain",
    label: "US Mountain",
    timeZone: "America/Denver",
    timeZoneLabel: "Mountain Time (MT)",
  },
  {
    code: "US-Arizona",
    label: "US Arizona (no DST)",
    timeZone: "America/Phoenix",
    timeZoneLabel: "Mountain Time — Arizona (no DST)",
  },
  {
    code: "US-Central",
    label: "US Central",
    timeZone: "America/Chicago",
    timeZoneLabel: "Central Time (CT)",
  },
  {
    code: "US-Eastern",
    label: "US Eastern (East Coast hours)",
    timeZone: "America/New_York",
    timeZoneLabel: "Eastern Time (ET)",
  },
  {
    code: "US-Alaska",
    label: "US Alaska",
    timeZone: "America/Anchorage",
    timeZoneLabel: "Alaska Time (AKT)",
  },
  {
    code: "US-Hawaii",
    label: "US Hawaii",
    timeZone: "Pacific/Honolulu",
    timeZoneLabel: "Hawaii Time (HT)",
  },
] as const;

export function hiringRegionByCode(code: string | null | undefined) {
  if (!code?.trim()) return null;
  const normalized = code.trim();
  return (
    WAYFINDER_HIRING_REGIONS.find(
      (r) => r.code.toLowerCase() === normalized.toLowerCase(),
    ) ?? null
  );
}

/** Best-effort match for legacy Wayfinders who only have timeZone set. */
export function hiringRegionByTimeZone(timeZone: string | null | undefined) {
  if (!timeZone?.trim()) return null;
  const normalized = timeZone.trim();
  return (
    WAYFINDER_HIRING_REGIONS.find((r) => r.timeZone === normalized) ?? null
  );
}

export function formatHiringRegionLabel(
  region: string | null | undefined,
  timeZone?: string | null,
): string {
  const fromRegion = hiringRegionByCode(region);
  if (fromRegion) return fromRegion.label;
  const fromTz = hiringRegionByTimeZone(timeZone);
  if (fromTz) return fromTz.label;
  return region?.trim() ? region.trim() : "—";
}

export function formatHiringTimezoneLabel(
  region: string | null | undefined,
  timeZone: string | null | undefined,
): string {
  const fromRegion = hiringRegionByCode(region);
  if (fromRegion) return fromRegion.timeZoneLabel;
  const fromTz = hiringRegionByTimeZone(timeZone);
  if (fromTz) return fromTz.timeZoneLabel;
  return timeZone?.trim() || "—";
}
