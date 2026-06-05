import {
  clearAllAuthTokens,
  clearChildToken,
  clearLegacyAuthStorage,
  clearUserToken,
  setChildToken,
  setUserToken,
} from "@/lib/auth-cookies";
import { useAuthStore } from "@/stores/auth.store";
import { useChildAuthStore } from "@/stores/child-auth.store";
import { useRegisterWizardStore } from "@/stores/register-wizard.store";
import type { Child, User } from "@/types/api";

export function setUserSession(accessToken: string, user: User): void {
  clearLegacyAuthStorage();
  setUserToken(accessToken);
  useAuthStore.getState().setUser(user);
}

export function clearUserSession(): void {
  clearUserToken();
  useAuthStore.getState().clearUser();
  clearLegacyAuthStorage();
}

export function setChildSession(accessToken: string, child: Child): void {
  clearLegacyAuthStorage();
  setChildToken(accessToken);
  useChildAuthStore.getState().setChild(child);
}

export function clearChildSession(): void {
  clearChildToken();
  useChildAuthStore.getState().clearChild();
  clearLegacyAuthStorage();
}

/** Parent logout: cookies, in-memory user, wizard drafts, legacy storage. */
export function logoutParent(): void {
  clearAllAuthTokens();
  useAuthStore.getState().clearUser();
  useRegisterWizardStore.getState().reset();
  clearLegacyAuthStorage();
}

/** Child logout: cookies, in-memory child, legacy storage. */
export function logoutChild(): void {
  clearChildSession();
}

/** Wayfinder / generic user logout. */
export function logoutUser(): void {
  clearUserSession();
}
