"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetchOnboardingStatus } from "@/lib/onboarding-api";

type Portal = "parent" | "child";

interface OnboardingGateProps {
  portal: Portal;
  onboardingPath: string;
  children: React.ReactNode;
}

/** Design-preview escape hatch: set NEXT_PUBLIC_DISABLE_PARENT_AUTH=true in .env.local. */
const parentAuthDisabled =
  process.env.NEXT_PUBLIC_DISABLE_PARENT_AUTH === "true";

export default function OnboardingGate({
  portal,
  onboardingPath,
  children,
}: OnboardingGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const bypass = parentAuthDisabled && portal === "parent";
  const [ready, setReady] = useState(bypass);

  useEffect(() => {
    if (bypass) return;

    let cancelled = false;

    fetchOnboardingStatus(portal)
      .then((status) => {
        if (cancelled) return;

        if (!status.isComplete && !pathname.startsWith(onboardingPath)) {
          router.replace(onboardingPath);
          return;
        }

        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [bypass, portal, onboardingPath, pathname, router]);

  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#111023]">
        <div className="w-8 h-8 border-2 border-[#00CED1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
