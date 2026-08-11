"use client";

import UserDropdown from "@/components/wayfinder/UserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import NotificationsCenter from "@/components/shared/NotificationsCenter";

export default function WayfinderNotificationsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-0" />
        <div className="hidden md:block">
          <UserDropdown />
        </div>
      </div>
      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/dashboard/notifications", label: "Notifications" },
        ]}
      />
      <div className="mt-4">
        <NotificationsCenter mode="wayfinder" />
      </div>
    </div>
  );
}
