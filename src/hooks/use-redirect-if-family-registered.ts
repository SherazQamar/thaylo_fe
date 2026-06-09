import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserToken } from "@/lib/auth-cookies";
import { refreshParentSession } from "@/lib/auth-api";
import { hasCompletedFamilyRegistration } from "@/lib/parent-registration";

/** Sends parents who already have children to the dashboard instead of the wizard. */
export function useRedirectIfFamilyRegistered(enabled = true) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled || !getUserToken()) return;

    let cancelled = false;
    refreshParentSession()
      .then((profile) => {
        if (cancelled) return;
        if (hasCompletedFamilyRegistration(profile)) {
          router.replace("/parent-dashboard");
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [router, enabled]);
}
