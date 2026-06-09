import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getApiErrorMessage,
  refreshParentSession,
} from "@/lib/auth-api";
import { getUserToken } from "@/lib/auth-cookies";
import { hasCompletedFamilyRegistration } from "@/lib/parent-registration";
import { logoutParent } from "@/lib/auth-session";

type AccessStatus = "loading" | "ready" | "error";

export function useParentRegisterAccess(options?: {
  redirectIfRegistered?: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<AccessStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getUserToken()) {
      router.replace("/parent-sign-in");
      return;
    }

    let cancelled = false;

    refreshParentSession()
      .then((profile) => {
        if (cancelled) return;

        if (profile.role !== "PARENT") {
          logoutParent();
          router.replace("/parent-sign-in");
          return;
        }

        if (
          options?.redirectIfRegistered &&
          hasCompletedFamilyRegistration(profile)
        ) {
          router.replace("/parent-dashboard");
          return;
        }

        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getApiErrorMessage(err));
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [router, options?.redirectIfRegistered]);

  return { status, error };
}
