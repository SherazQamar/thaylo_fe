import ParentAuthGuard from "@/components/parent/ParentAuthGuard";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export default function ParentOnboardingPage() {
  return (
    <ParentAuthGuard>
      <OnboardingFlow portal="parent" dashboardPath="/parent-dashboard" />
    </ParentAuthGuard>
  );
}
