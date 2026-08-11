"use client";

import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import NotificationsCenter from "@/components/shared/NotificationsCenter";

export default function ParentNotificationsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-0" />
        <div className="hidden md:block">
          <ParentUserDropdown />
        </div>
      </div>
      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/parent-dashboard", label: "Dashboard" },
          { href: "/parent-dashboard/notifications", label: "Notifications" },
        ]}
      />
      <div className="mt-4">
        <NotificationsCenter mode="parent" title="Notifications Center" />
      </div>
    </div>
  );
}
