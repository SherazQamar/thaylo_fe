"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import AlertDetailDrawer from "@/components/wayfinder/AlertDetailDrawer";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import InfoTooltip from "@/components/shared/InfoTooltip";
import ListPagination from "@/components/shared/ListPagination";
import { notify } from "@/lib/notify";
import { ALERTS_CENTER_HINTS } from "@/lib/portal-help-text";
import { formatStudentGrade } from "@/lib/wayfinder-student";
import {
  flagMeta,
  groupAlertsByStudent,
  mapLessonAlertToCard,
  mapSelAlertToCard,
  type WayfinderAlertCard,
  type WayfinderFlagKind,
  type WayfinderStudentAlertGroup,
} from "@/lib/wayfinder-alerts";
import {
  fetchParentAlerts,
  type ParentAlertsParams,
} from "@/lib/parent-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const STATUS_FILTERS = [
  { value: "ACTIVE", label: "Active" },
  { value: "", label: "All statuses" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "DISMISSED", label: "Dismissed" },
] as const;

const SEVERITY_FILTERS = [
  { value: "", label: "All flags" },
  { value: "RED", label: "Red" },
  { value: "YELLOW", label: "Yellow" },
  { value: "ORANGE", label: "Orange" },
] as const;

function FlagPills({ flags }: { flags: WayfinderFlagKind[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {flags.map((flag) => {
        const meta = flagMeta(flag);
        return (
          <span
            key={flag}
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1"
            style={{
              borderColor: meta.accent,
              color: meta.accent,
              backgroundColor: `${meta.accent}18`,
              fontWeight: 600,
              fontSize: "11px",
            }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: meta.accent }}
            />
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}

function StudentAlertCard({
  group,
  onClick,
}: {
  group: WayfinderStudentAlertGroup;
  onClick: () => void;
}) {
  const accent = group.flags[0] ? flagMeta(group.flags[0]).accent : "#00CED1";

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
      className="relative overflow-hidden rounded-2xl flex items-stretch cursor-pointer hover:bg-white/[0.02] transition-colors"
      style={{ backgroundColor: "#313044", minHeight: "96px" }}
    >
      <span
        className="absolute left-0 top-0 bottom-0"
        style={{ width: "5px", backgroundColor: accent }}
      />

      <div className="flex-1 px-7 py-5 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <p className="text-white text-base font-semibold leading-tight truncate">
              {group.childName}
            </p>
            <p className="text-white/45 text-xs mt-1">
              {formatStudentGrade(group.grade)}
              {" · "}
              {group.cards.length} alert{group.cards.length === 1 ? "" : "s"}
            </p>
          </div>
          <FlagPills flags={group.flags} />
        </div>

        <ul className="mt-3 space-y-1">
          {group.summaryLines.map((line) => (
            <li key={line} className="text-white/60 text-sm leading-snug truncate">
              {line}
            </li>
          ))}
        </ul>

        <p className="text-white/35 text-xs mt-2">
          Latest {new Date(group.latestAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center pr-6">
        <span className="text-[#00CED1] text-xs font-semibold">View</span>
      </div>
    </div>
  );
}

export default function ParentAlertsPage() {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<WayfinderStudentAlertGroup | null>(null);
  const [selectedCard, setSelectedCard] = useState<WayfinderAlertCard | null>(null);
  const [cards, setCards] = useState<WayfinderAlertCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [severityFilter, setSeverityFilter] = useState("");
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState({ total: 0, lastPage: 1, currentPage: 1, activeCount: 0 });

  const queryParams = useMemo<ParentAlertsParams>(() => {
    return {
      page,
      limit: 50,
      ...(statusFilter
        ? { status: statusFilter as ParentAlertsParams["status"] }
        : {}),
      ...(severityFilter
        ? { severity: severityFilter as ParentAlertsParams["severity"] }
        : {}),
      ...(search.trim() ? { search: search.trim() } : {}),
    };
  }, [page, statusFilter, severityFilter, search]);

  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchParentAlerts(queryParams);
      const lessonCards = result.items.map(mapLessonAlertToCard);
      const selCards = (result.selAlerts ?? []).map(mapSelAlertToCard);
      setCards([...lessonCards, ...selCards]);
      setMeta({
        total: result.meta.total,
        lastPage: result.meta.lastPage,
        currentPage: result.meta.currentPage,
        activeCount: result.meta.activeCount ?? 0,
      });
    } catch (err) {
      notify.error(err, "Failed to load alerts");
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    void loadAlerts();
  }, [loadAlerts]);

  const studentGroups = useMemo(() => groupAlertsByStudent(cards), [cards]);

  function handleMessageWayfinder(childId: number) {
    setSelectedGroup(null);
    setSelectedCard(null);
    router.push(`/parent-dashboard/message?childId=${childId}`);
  }

  return (
    <div className="px-6 py-4 md:p-6 lg:p-10">
      <div className="hidden md:flex items-center justify-between mb-3">
        <h1
          className="uppercase"
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "25px",
            letterSpacing: "0.8px",
            color: "#DCE6EC",
          }}
        >
          Alerts
        </h1>
        <ParentUserDropdown />
      </div>

      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/parent-dashboard", label: "Parent Dashboard" },
          { href: "/parent-dashboard/alerts", label: "Alerts" },
        ]}
      />

      <div className="mt-6 space-y-2">
        <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight inline-flex items-center gap-2">
          Alerts
          <InfoTooltip
            content={ALERTS_CENTER_HINTS.parent}
            align="left"
            label="What are alerts?"
          />
        </h2>
        <p className="text-white/50 text-sm">
          Your action list when a child may need support. Use Notifications for a simple “what happened” inbox.
          {meta.activeCount > 0 && (
            <span className="text-[#00CED1] ml-2">
              {meta.activeCount} active
            </span>
          )}
        </p>
      </div>

      <div className="mt-6 flex flex-col lg:flex-row gap-3 lg:items-center">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search child…"
          className="flex-1 px-4 py-3 rounded-2xl bg-white/[0.05] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 placeholder:text-white/30"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-3 rounded-2xl bg-white/[0.05] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value || "all"} value={f.value} className="bg-[#313044]">
              {f.label}
            </option>
          ))}
        </select>
        <select
          value={severityFilter}
          onChange={(e) => {
            setSeverityFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-3 rounded-2xl bg-white/[0.05] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40"
        >
          {SEVERITY_FILTERS.map((f) => (
            <option key={f.value || "all"} value={f.value} className="bg-[#313044]">
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-white/40 text-sm mt-6">Loading alerts…</p>}

      {!isLoading && studentGroups.length === 0 && (
        <p className="text-white/40 text-sm mt-6">No alerts for your children yet.</p>
      )}

      <div className="mt-6 space-y-3">
        {studentGroups.map((group) => (
          <StudentAlertCard
            key={group.childId}
            group={group}
            onClick={() => {
              setSelectedGroup(group);
              setSelectedCard(group.cards[0] ?? null);
            }}
          />
        ))}
      </div>

      {meta.lastPage > 1 && (
        <div className="mt-8">
          <ListPagination
            meta={{
              total: meta.total,
              lastPage: meta.lastPage,
              currentPage: meta.currentPage,
              perPage: 50,
              prev: meta.currentPage > 1 ? meta.currentPage - 1 : null,
              next: meta.currentPage < meta.lastPage ? meta.currentPage + 1 : null,
            }}
            onPageChange={setPage}
            itemLabel="alerts"
          />
        </div>
      )}

      <AlertDetailDrawer
        open={!!selectedGroup}
        group={selectedGroup}
        card={selectedCard}
        onSelectCard={setSelectedCard}
        onClose={() => {
          setSelectedGroup(null);
          setSelectedCard(null);
        }}
        onStartChat={handleMessageWayfinder}
        readOnly
        title="Child alerts"
      />
    </div>
  );
}
