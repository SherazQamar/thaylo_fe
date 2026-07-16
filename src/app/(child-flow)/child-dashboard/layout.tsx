"use client";

import { usePathname } from "next/navigation";
import ChildAuthGuard from "@/components/child/ChildAuthGuard";
import ChildSidebar from "@/components/child/ChildSidebar";
import OnboardingGate from "@/components/onboarding/OnboardingGate";

export default function ChildDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLessonRoute = pathname.startsWith("/child-dashboard/lesson");

  return (
    <ChildAuthGuard>
      <OnboardingGate portal="child" onboardingPath="/child-onboarding">
        <div className="h-screen flex overflow-hidden bg-[#111023]">
          {!isLessonRoute && <ChildSidebar />}
          <main
            className={
              "flex-1 overflow-hidden " +
              (isLessonRoute ? "" : "overflow-y-auto pt-[56px] pb-[72px] md:pt-0 md:pb-0")
            }
          >
            {children}
          </main>
        </div>
      </OnboardingGate>
    </ChildAuthGuard>
  );
}
