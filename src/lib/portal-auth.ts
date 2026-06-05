import type { PortalUserRole } from "@/types/api";

export function getSignInPathForRole(role?: PortalUserRole | string): string {
  if (role === "WAY_FINDER") return "/wayfinder-sign-in";
  return "/parent-sign-in";
}

export function getDashboardPathForRole(role?: PortalUserRole | string): string {
  if (role === "WAY_FINDER") return "/dashboard";
  return "/parent-dashboard";
}
