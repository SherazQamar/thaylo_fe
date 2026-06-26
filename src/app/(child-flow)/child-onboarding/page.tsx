"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChildAuthGuard from "@/components/child/ChildAuthGuard";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

function ChildOnboardingContent() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const dashboardPath =
    returnTo === "lesson" ? "/child-dashboard/lesson" : "/child-dashboard";

  return (
    <ChildAuthGuard>
      <OnboardingFlow portal="child" dashboardPath={dashboardPath} />
    </ChildAuthGuard>
  );
}

function ChildOnboardingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111023]">
      <div className="w-10 h-10 border-2 border-[#00CED1] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function ChildOnboardingPage() {
  return (
    <Suspense fallback={<ChildOnboardingLoading />}>
      <ChildOnboardingContent />
    </Suspense>
  );
}
