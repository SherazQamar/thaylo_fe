"use client";

import { usePathname } from "next/navigation";
import ParentAuthGuard from "@/components/parent/ParentAuthGuard";
import ParentSidebar from "@/components/parent/ParentSidebar";
import OnboardingGate from "@/components/onboarding/OnboardingGate";

export default function ParentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMessageRoute = pathname.startsWith("/parent-dashboard/message");

  return (
    <ParentAuthGuard>
      <OnboardingGate portal="parent" onboardingPath="/parent-onboarding">
        <div className="h-screen flex overflow-hidden bg-[#111023]">
          <ParentSidebar />
          <main
            className={
              isMessageRoute
                ? "flex-1 min-h-0 overflow-hidden flex flex-col pt-[56px] pb-[72px] md:pt-0 md:pb-0"
                : "flex-1 overflow-y-auto pt-[56px] pb-[72px] md:pt-0 md:pb-0"
            }
          >
            {children}
          </main>
        </div>
      </OnboardingGate>
    </ParentAuthGuard>
  );
}
