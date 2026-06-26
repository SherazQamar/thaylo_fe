"use client";

import OnboardingAssistant from "@/components/onboarding/OnboardingAssistant";

type Portal = "parent" | "child";

interface OnboardingFlowProps {
  portal: Portal;
  dashboardPath: string;
}

export default function OnboardingFlow({
  portal,
  dashboardPath,
}: OnboardingFlowProps) {
  return (
    <OnboardingAssistant portal={portal} dashboardPath={dashboardPath} />
  );
}
