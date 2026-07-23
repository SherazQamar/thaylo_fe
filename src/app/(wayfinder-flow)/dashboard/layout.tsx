"use client";

import { usePathname } from "next/navigation";
import WayfinderAuthGuard from "@/components/wayfinder/WayfinderAuthGuard";
import WayfinderPresenceHeartbeat from "@/components/wayfinder/WayfinderPresenceHeartbeat";
import Sidebar from "@/components/wayfinder/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMessageRoute = pathname.startsWith("/dashboard/message");

  return (
    <WayfinderAuthGuard>
      <WayfinderPresenceHeartbeat />
      <div className="h-screen flex overflow-hidden bg-[#111023]">
        <Sidebar />
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
    </WayfinderAuthGuard>
  );
}
