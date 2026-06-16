import {
  clearAllAuthTokens,
  clearChildToken,
  clearLegacyAuthStorage,
  clearUserToken,
  setChildToken,
  setUserToken,
} from "@/lib/auth-cookies";
import {
  clearAuthAgent,
  PORTAL_SIGN_IN_PATHS,
  setAuthAgent,
  type PortalAgent,
} from "@/lib/auth-agent";
import { useAuthStore } from "@/stores/auth.store";
import { useChildAuthStore } from "@/stores/child-auth.store";
import { useRegisterWizardStore } from "@/stores/register-wizard.store";
import type { Child, User } from "@/types/api";

function redirectTo(path: string): void {
  if (typeof window === "undefined") return;
  window.location.href = path;
}

export function setParentSession(accessToken: string, user: User): void {
  clearLegacyAuthStorage();
  clearChildToken();
  setUserToken(accessToken);
  useAuthStore.getState().setUser(user);
  setAuthAgent("parent");
}

export function setWayfinderSession(accessToken: string, user: User): void {
  clearLegacyAuthStorage();
  clearChildToken();
  setUserToken(accessToken);
  useAuthStore.getState().setUser(user);
  setAuthAgent("wayfinder");
}

/** @deprecated Use setParentSession or setWayfinderSession */
export function setUserSession(accessToken: string, user: User): void {
  setParentSession(accessToken, user);
}

export function clearUserSession(): void {
  clearUserToken();
  useAuthStore.getState().clearUser();
  clearLegacyAuthStorage();
  clearAuthAgent();
}

export function setChildSession(accessToken: string, child: Child): void {
  clearLegacyAuthStorage();
  clearUserToken();
  useAuthStore.getState().clearUser();
  setChildToken(accessToken);
  useChildAuthStore.getState().setChild(child);
  setAuthAgent("child");
}

export function clearChildSession(): void {
  clearChildToken();
  useChildAuthStore.getState().clearChild();
  clearLegacyAuthStorage();
  clearAuthAgent();
}

export function logoutParent(redirect = false): void {
  clearAllAuthTokens();
  useAuthStore.getState().clearUser();
  useRegisterWizardStore.getState().reset();
  clearLegacyAuthStorage();
  clearAuthAgent();
  if (redirect) {
    redirectTo(PORTAL_SIGN_IN_PATHS.parent);
  }
}

export function logoutChild(redirect = false): void {
  clearChildSession();
  if (redirect) {
    redirectTo(PORTAL_SIGN_IN_PATHS.child);
  }
}

export function logoutUser(redirect = false): void {
  clearUserSession();
  if (redirect) {
    redirectTo(PORTAL_SIGN_IN_PATHS.wayfinder);
  }
}

export function logoutPortal(agent: PortalAgent, redirect = true): void {
  switch (agent) {
    case "parent":
      logoutParent(redirect);
      break;
    case "wayfinder":
      logoutUser(redirect);
      break;
    case "child":
      logoutChild(redirect);
      break;
  }
}
