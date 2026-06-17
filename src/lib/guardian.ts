import type { GuardianRelationType } from "@/types/api";

export type GuardianRelationInput = "parent" | "guardian";

export function formatGuardianRelationLabel(
  value?: GuardianRelationType | null,
): string {
  if (!value) return "—";
  return value === "GUARDIAN" ? "Guardian" : "Parent";
}
