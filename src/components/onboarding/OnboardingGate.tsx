"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import OnboardingBlockingModal from "@/components/onboarding/OnboardingBlockingModal";
import {
  fetchOnboardingStatus,
  type OnboardingStatus,
} from "@/lib/onboarding-api";
import { useAuthStore } from "@/stores/auth.store";
import { useChildAuthStore } from "@/stores/child-auth.store";

type Portal = "parent" | "child";

interface OnboardingGateProps {
  portal: Portal;
  onboardingPath: string;
  children: React.ReactNode;
}

function getDisplayName(portal: Portal) {
  if (portal === "parent") {
    const user = useAuthStore.getState().user;
    return user?.name?.trim() || user?.email?.split("@")[0] || "there";
  }

  const child = useChildAuthStore.getState().child;
  return (
    child?.firstName?.trim() ||
    child?.userName?.trim() ||
    "Student"
  );
}

export default function OnboardingGate({
  portal,
  onboardingPath,
  children,
}: OnboardingGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [displayName, setDisplayName] = useState("there");

  const refreshStatus = useCallback(async () => {
    if (pathname.startsWith(onboardingPath)) {
      setBlocked(false);
      setReady(true);
      return;
    }

    setReady(false);

    try {
      const nextStatus = await fetchOnboardingStatus(portal);
      setStatus(nextStatus);
      setDisplayName(getDisplayName(portal));
      setBlocked(!nextStatus.isComplete);
    } catch {
      setBlocked(false);
    } finally {
      setReady(true);
    }
  }, [onboardingPath, pathname, portal]);

  useEffect(() => {
    if (bypass) return;

    let cancelled = false;

    void refreshStatus().then(() => {
      if (cancelled) return;
    });

    return () => {
      cancelled = true;
    };
  }, [refreshStatus]);

  const handleStart = () => {
    const href =
      portal === "child"
        ? `${onboardingPath}?returnTo=dashboard`
        : onboardingPath;
    router.push(href);
  };

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#111023]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00CED1] border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div
        className={
          blocked
            ? "pointer-events-none h-screen overflow-hidden blur-md saturate-50"
            : "h-screen"
        }
        aria-hidden={blocked}
      >
        {children}
      </div>

      {blocked && status ? (
        <OnboardingBlockingModal
          displayName={displayName}
          portal={portal}
          status={status}
          onStart={handleStart}
        />
      ) : null}
    </>
  );
}
