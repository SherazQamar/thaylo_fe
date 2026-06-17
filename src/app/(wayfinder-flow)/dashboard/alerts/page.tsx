"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import AlertDetailDrawer from "@/components/wayfinder/AlertDetailDrawer";
import AlertChatDrawer from "@/components/wayfinder/AlertChatDrawer";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { WAYFINDER_ALERTS, type WayfinderAlert } from "@/lib/wayfinder-alerts";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function PriorityBadge({ priority, accent }: { priority: string; accent: string }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full border"
      style={{
        borderColor: accent,
        color: accent,
        backgroundColor: `${accent}15`,
        fontWeight: 500,
        fontSize: "12px",
        padding: "5px 12px",
      }}
    >
      {priority}
    </span>
  );
}

function ViewButton({ onClick }: { onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:bg-[#00B8BB] transition-colors cursor-pointer"
      style={{
        backgroundColor: "#00CED1",
        borderRadius: "12px",
        padding: "6px 16px",
        width: "111.25px",
        height: "28px",
        fontWeight: 500,
        fontSize: "11px",
        lineHeight: "16px",
        color: "#111023",
      }}
    >
      View
    </button>
  );
}

function AlertCard({
  alert,
  onView,
  onClick,
}: {
  alert: WayfinderAlert;
  onView: () => void;
  onClick: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="relative overflow-hidden rounded-2xl flex items-center cursor-pointer hover:bg-white/[0.02] transition-colors"
      style={{ backgroundColor: "#313044", minHeight: "88px" }}
    >
      <span
        className="absolute left-0 top-0 bottom-0"
        style={{ width: "5px", backgroundColor: alert.accent }}
      />

      <div className="flex-1 px-7 py-5">
        <p className="text-white text-base font-semibold leading-tight">{alert.title}</p>
        <p className="text-white/60 text-sm mt-1">{alert.text}</p>
        <p className="text-white/40 text-xs mt-2">{alert.date}</p>
      </div>

      <div className="flex items-center gap-3 pr-6">
        {alert.priority && <PriorityBadge priority={alert.priority} accent={alert.accent} />}
        <ViewButton
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
        />
      </div>
    </div>
  );
}

export default function AlertsCenterPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<WayfinderAlert | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  function handleCardClick(alert: WayfinderAlert) {
    if (alert.type === "message") {
      setChatOpen(true);
    } else {
      setSelected(alert);
    }
  }

  function handleView(alert: WayfinderAlert) {
    if (alert.type === "message") {
      setChatOpen(true);
      return;
    }
    router.push("/dashboard/alerts/insights");
  }

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h1
          className="uppercase"
          style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
        >
          Alerts Center
        </h1>
        <div className="hidden md:block">
          <UserDropdown />
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/dashboard", label: "Wayfinder Dashboard" },
          { href: "/dashboard/alerts", label: "Alerts Center" },
        ]}
      />

      <div className="mt-6 space-y-2">
        <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight">Alerts Center</h2>
        <p className="text-white/50 text-sm">All active alerts requiring attention.</p>
      </div>

      <div className="flex flex-col gap-4 mt-6">
        {WAYFINDER_ALERTS.map((alert) => (
          <AlertCard
            key={alert.title}
            alert={alert}
            onClick={() => handleCardClick(alert)}
            onView={() => handleView(alert)}
          />
        ))}
      </div>

      <AlertDetailDrawer
        open={!!selected}
        alert={selected}
        onClose={() => setSelected(null)}
        onMessageParent={() => {
          setSelected(null);
          setChatOpen(true);
        }}
      />
      <AlertChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
