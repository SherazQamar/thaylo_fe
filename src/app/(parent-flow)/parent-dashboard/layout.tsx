import ParentAuthGuard from "@/components/parent/ParentAuthGuard";
import ParentSidebar from "@/components/parent/ParentSidebar";
import OnboardingGate from "@/components/onboarding/OnboardingGate";

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ParentAuthGuard>
      <OnboardingGate portal="parent" onboardingPath="/parent-onboarding">
        <div className="h-screen flex overflow-hidden bg-[#111023]">
          <ParentSidebar />
          <main className="flex-1 overflow-y-auto pt-[56px] pb-[72px] md:pt-0 md:pb-0">
            {children}
          </main>
        </div>
      </OnboardingGate>
    </ParentAuthGuard>
  );
}
