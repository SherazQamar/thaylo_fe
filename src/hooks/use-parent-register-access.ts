import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getApiErrorMessage,
  refreshParentSession,
} from "@/lib/auth-api";
import { getUserToken } from "@/lib/auth-cookies";
import { hasCompletedFamilyRegistration } from "@/lib/parent-registration";
import { logoutParent } from "@/lib/auth-session";
import { isParentAccessTokenValid } from "@/lib/jwt";
import { useAuthStore } from "@/stores/auth.store";

type AccessStatus = "loading" | "ready" | "error";

export function useParentRegisterAccess(redirectIfRegistered = false) {
  const router = useRouter();
  const [status, setStatus] = useState<AccessStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function validateAccess() {
      const token = getUserToken();
      if (!token) {
        router.replace("/parent-sign-in");
        return;
      }

      if (!isParentAccessTokenValid(token)) {
        logoutParent();
        router.replace("/");
        return;
      }

      const cachedUser = useAuthStore.getState().user;
      if (cachedUser?.role === "PARENT") {
        if (
          redirectIfRegistered &&
          hasCompletedFamilyRegistration(cachedUser)
        ) {
          router.replace("/parent-dashboard");
          return;
        }

        // Parent just signed in — show the wizard while profile refreshes.
        setStatus("ready");
      }

      try {
        const profile = await refreshParentSession();
        if (cancelled) return;

        if (profile.role !== "PARENT") {
          logoutParent();
          router.replace("/");
          return;
        }

        if (
          redirectIfRegistered &&
          hasCompletedFamilyRegistration(profile)
        ) {
          router.replace("/parent-dashboard");
          return;
        }

        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        setError(getApiErrorMessage(err));
        setStatus("error");
      }
    }

    void validateAccess();

    return () => {
      cancelled = true;
    };
  }, [redirectIfRegistered]);

  return { status, error };
}
