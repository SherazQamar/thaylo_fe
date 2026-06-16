export const AUTH_AGENT_KEY = "thaylo_agent";

export type PortalAgent = "parent" | "wayfinder" | "child";

export const PORTAL_SIGN_IN_PATHS: Record<PortalAgent, string> = {
  parent: "/parent-sign-in",
  wayfinder: "/wayfinder-sign-in",
  child: "/child-sign-in",
};

const VALID_AGENTS = new Set<PortalAgent>(["parent", "wayfinder", "child"]);

export function setAuthAgent(agent: PortalAgent): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_AGENT_KEY, agent);
}

export function getAuthAgent(): PortalAgent | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(AUTH_AGENT_KEY);
  if (value && VALID_AGENTS.has(value as PortalAgent)) {
    return value as PortalAgent;
  }
  return null;
}

export function clearAuthAgent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_AGENT_KEY);
}

export function hasAuthAgent(): boolean {
  return getAuthAgent() !== null;
}

export function isAuthAgent(agent: PortalAgent): boolean {
  return getAuthAgent() === agent;
}
