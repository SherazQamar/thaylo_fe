"use client";

import { usePathname } from "next/navigation";
import ChildAuthGuard from "@/components/child/ChildAuthGuard";
import ChildSidebar from "@/components/child/ChildSidebar";
import OnboardingGate from "@/components/onboarding/OnboardingGate";

export default function ChildDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLessonRoute = pathname.startsWith("/child-dashboard/lesson");
  const isMessageRoute = pathname.startsWith("/child-dashboard/message");
  const isCheckInRoute = pathname.startsWith("/child-dashboard/check-in");
  const isImmersiveRoute = isLessonRoute || isMessageRoute || isCheckInRoute;

  return (
    <ChildAuthGuard>
      <OnboardingGate portal="child" onboardingPath="/child-onboarding">
        <div className="h-screen flex overflow-hidden bg-[#111023]">
          {!isImmersiveRoute && <ChildSidebar />}
          <main
            className={
              isImmersiveRoute
                ? "flex-1 min-h-0 overflow-hidden flex flex-col" +
                  (isMessageRoute
                    ? " pt-[calc(env(safe-area-inset-top,0px)+76px)] pb-[calc(env(safe-area-inset-bottom,0px)+72px)] md:pt-0 md:pb-0"
                    : "")
                : "flex-1 overflow-hidden overflow-y-auto pt-[calc(env(safe-area-inset-top,0px)+76px)] pb-[calc(env(safe-area-inset-bottom,0px)+72px)] md:pt-0 md:pb-0"
            }
          >
            {children}
          </main>
        </div>
      </OnboardingGate>
    </ChildAuthGuard>
  );
}
