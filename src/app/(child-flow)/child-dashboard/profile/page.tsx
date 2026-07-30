"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { BadgeShield } from "@/components/shared/BadgeArtwork";
import {
  CHILD_INTEREST_SUGGESTIONS,
  isInappropriateInterest,
  isInappropriateNote,
} from "@/constants/child-interest-areas";
import { notify } from "@/lib/notify";
import { useNotifyError } from "@/hooks/use-notify-error";
import {
  updateChildInterestAreas,
  updateChildNotesForParent,
} from "@/lib/child-api";
import { fetchChildBadges } from "@/lib/badge-api";
import { useChildAuthStore } from "@/stores/child-auth.store";
import AvatarPicker from "@/components/shared/AvatarPicker";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

function formatJoinedDate(createdAt: string | undefined): string {
  if (!createdAt) return "—";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "—";
  return `Joined ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
}

export default function ChildProfilePage() {
  const child = useChildAuthStore((state) => state.child);
  const setChild = useChildAuthStore((state) => state.setChild);
  const displayName = child?.userName?.trim() || "Student";

  const badgesQuery = useQuery({
    queryKey: ["child", "badges"],
    queryFn: fetchChildBadges,
  });
  const badgesEarned = badgesQuery.data?.badgesEarned ?? 0;
  const lessonsCompleted = badgesQuery.data?.masteredCount ?? 0;
  const allBadges = badgesQuery.data?.badges ?? [];
  const previewBadges = useMemo(() => {
    const earned = allBadges.filter((b) => b.count > 0);
    const locked = allBadges.filter((b) => b.count <= 0);
    return [...earned, ...locked].slice(0, 4);
  }, [allBadges]);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [interestSaved, setInterestSaved] = useState(false);

  const [notesForParent, setNotesForParent] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  useNotifyError(badgesQuery.error, badgesQuery.isError);

  useEffect(() => {
    setSelectedInterests(child?.interestAreas ?? []);
  }, [child?.id, child?.interestAreas]);

  useEffect(() => {
    setNotesForParent(child?.notesForParent ?? "");
  }, [child?.id, child?.notesForParent]);

  const interestsMutation = useMutation({
    mutationFn: (interestAreas: string[]) =>
      updateChildInterestAreas(interestAreas),
    onSuccess: (result) => {
      setSelectedInterests(result.child.interestAreas ?? []);
      if (result.rejectedInterests.length > 0) {
        notify.warning(
          "Some words were blocked because they are not school-appropriate. Everything else was saved.",
        );
      } else {
        setInterestSaved(true);
        setTimeout(() => setInterestSaved(false), 2500);
      }
    },
    onError: (err) => notify.error(err),
  });

  const notesMutation = useMutation({
    mutationFn: (notes: string) => updateChildNotesForParent(notes),
    onSuccess: (updated) => {
      setNotesForParent(updated.notesForParent ?? "");
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2500);
    },
    onError: (err) => notify.error(err),
  });

  function toggleInterest(label: string) {
    setInterestSaved(false);
    setSelectedInterests((prev) => {
      const exists = prev.some(
        (item) => item.toLowerCase() === label.toLowerCase(),
      );
      if (exists) {
        return prev.filter(
          (item) => item.toLowerCase() !== label.toLowerCase(),
        );
      }
      if (prev.length >= 20) return prev;
      return [...prev, label];
    });
  }

  function addCustomInterest(e: FormEvent) {
    e.preventDefault();
    const trimmed = customInterest.trim();
    if (!trimmed) return;

    if (isInappropriateInterest(trimmed)) {
      notify.error(
        "That interest was blocked. Please choose a school-appropriate interest.",
      );
      setCustomInterest("");
      return;
    }

    toggleInterest(trimmed);
    setCustomInterest("");
  }

  function handleSaveInterests() {
    interestsMutation.mutate(selectedInterests);
  }

  function handleSaveNotes() {
    setNotesSaved(false);
    const trimmed = notesForParent.trim();
    if (trimmed && isInappropriateNote(trimmed)) {
      notify.error(
        "That note was blocked. Please write something school-appropriate.",
      );
      return;
    }
    notesMutation.mutate(notesForParent);
  }

  const suggestionSet = new Set(
    CHILD_INTEREST_SUGGESTIONS.map((s) => s.toLowerCase()),
  );
  const customSelected = selectedInterests.filter(
    (item) => !suggestionSet.has(item.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-5 lg:p-6 overflow-y-auto scrollbar-hide h-full">
      <div className="flex flex-col gap-1 mb-5">
        <div className="flex items-center justify-between">
          <h1
            className="uppercase"
            style={{
              ...inter,
              fontWeight: 700,
              fontSize: "22px",
              letterSpacing: "0.8px",
              color: "#DCE6EC",
            }}
          >
            Profile
          </h1>
          <div className="hidden md:block">
            <ChildUserDropdown />
          </div>
        </div>
        <Breadcrumbs
          showHome={false}
          items={[
            { href: "/child-dashboard", label: "Pathway" },
            { href: "/child-dashboard/profile", label: "Profile" },
          ]}
        />
      </div>

      <div
        className="rounded-[16px] p-6 mb-6"
        style={{ backgroundColor: "#313044" }}
      >
        <div className="relative mb-4">
          <div className="flex items-center gap-2 justify-end mb-3">
            <span
              className="hidden sm:inline"
              style={{
                ...inter,
                fontWeight: 400,
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Parent-managed settings
            </span>
          </div>
          <div className="flex justify-center">
            <AvatarPicker
              mode="child"
              displayName={displayName}
              currentAvatarUrl={child?.avatarUrl}
              size={100}
              onAvatarSaved={(avatarUrl, avatarKey) => {
                if (!child) return;
                setChild({ ...child, avatarUrl, avatarKey });
              }}
            />
          </div>
        </div>

        <div className="mt-2 text-center sm:text-left">
          <h2
            style={{
              ...inter,
              fontWeight: 700,
              fontSize: "22px",
              color: "#FFFFFF",
            }}
          >
            {displayName}
          </h2>
          <p
            style={{
              ...inter,
              fontWeight: 400,
              fontSize: "14px",
              color: "rgba(255,255,255,0.5)",
              marginTop: "2px",
            }}
          >
            @{displayName.replace(/\s+/g, "")}
          </p>
          <p
            style={{
              ...inter,
              fontWeight: 400,
              fontSize: "14px",
              color: "rgba(255,255,255,0.5)",
              marginTop: "2px",
            }}
          >
            {formatJoinedDate(child?.createdAt)}
          </p>
          <p
            style={{
              ...inter,
              fontWeight: 500,
              fontSize: "14px",
              color: "#00CED1",
              marginTop: "8px",
            }}
          >
            {formatChildGrade(child?.grade)}
          </p>
        </div>
      </div>

      {/* Interest areas */}
      <div
        className="rounded-[16px] p-5 md:p-6 mb-6"
        style={{ backgroundColor: "#313044" }}
      >
        <h3
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "20px",
            color: "#FFFFFF",
            marginBottom: "6px",
          }}
        >
          Interest areas
        </h3>
        <p
          style={{
            ...inter,
            fontWeight: 400,
            fontSize: "13px",
            lineHeight: "20px",
            color: "rgba(255,255,255,0.55)",
            marginBottom: "14px",
          }}
        >
          Tell us what you like. Pick ideas below or add your own. Your parent
          can also update these, and you&apos;ll both see the same list.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {CHILD_INTEREST_SUGGESTIONS.map((suggestion) => {
            const selected = selectedInterests.some(
              (item) => item.toLowerCase() === suggestion.toLowerCase(),
            );
            return (
              <button
                key={suggestion}
                type="button"
                onClick={() => toggleInterest(suggestion)}
                className="rounded-full px-3 py-1.5 cursor-pointer transition-colors"
                style={{
                  backgroundColor: selected
                    ? "rgba(0,206,209,0.25)"
                    : "rgba(255,255,255,0.06)",
                  border: selected
                    ? "1px solid #00CED1"
                    : "1px solid rgba(255,255,255,0.12)",
                  ...inter,
                  fontSize: "13px",
                  color: selected ? "#00CED1" : "rgba(255,255,255,0.75)",
                }}
              >
                {suggestion}
              </button>
            );
          })}
          {customSelected.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => toggleInterest(area)}
              className="rounded-full px-3 py-1.5 cursor-pointer"
              style={{
                backgroundColor: "rgba(0,206,209,0.25)",
                border: "1px solid #00CED1",
                ...inter,
                fontSize: "13px",
                color: "#00CED1",
              }}
            >
              {area} ×
            </button>
          ))}
        </div>

        <form onSubmit={addCustomInterest} className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            maxLength={60}
            placeholder="Add a new interest"
            className="flex-1 min-w-[180px] rounded-full px-4 py-2.5 outline-none text-white"
            style={{
              backgroundColor: "#525162",
              ...inter,
              fontSize: "14px",
            }}
          />
          <button
            type="submit"
            className="rounded-full px-4 py-2.5 cursor-pointer hover:bg-white/10"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              ...inter,
              fontWeight: 600,
              fontSize: "13px",
              color: "#FFFFFF",
            }}
          >
            Add
          </button>
        </form>

        {interestSaved && (
          <p
            className="mb-3"
            style={{ ...inter, fontSize: "13px", color: "#22C55E" }}
          >
            Interests saved.
          </p>
        )}

        <button
          type="button"
          onClick={handleSaveInterests}
          disabled={interestsMutation.isPending}
          className="rounded-full px-5 py-2.5 cursor-pointer hover:opacity-90 disabled:opacity-50"
          style={{
            backgroundColor: "#00CED1",
            ...inter,
            fontWeight: 600,
            fontSize: "14px",
            color: "#111023",
          }}
        >
          {interestsMutation.isPending ? "Saving…" : "Save interests"}
        </button>
      </div>

      {/* Notes for parents */}
      <div
        className="rounded-[16px] p-5 md:p-6 mb-6"
        style={{ backgroundColor: "#313044" }}
      >
        <h3
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "20px",
            color: "#FFFFFF",
            marginBottom: "6px",
          }}
        >
          Notes for parents
        </h3>
        <p
          style={{
            ...inter,
            fontWeight: 400,
            fontSize: "13px",
            lineHeight: "20px",
            color: "rgba(255,255,255,0.55)",
            marginBottom: "14px",
          }}
        >
          Write a message your parent can read on their side.
        </p>

        <div
          className="rounded-[12px] px-4 py-3 mb-4"
          style={{
            backgroundColor: "rgba(0,206,209,0.08)",
            border: "1px solid rgba(0,206,209,0.25)",
          }}
        >
          <p
            style={{
              ...inter,
              fontWeight: 500,
              fontSize: "13px",
              lineHeight: "18px",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Your parent can read anything you write in this note.
          </p>
        </div>

        <textarea
          value={notesForParent}
          onChange={(e) => {
            setNotesForParent(e.target.value);
            setNotesSaved(false);
          }}
          maxLength={2000}
          rows={4}
          placeholder="Share something with your parent…"
          className="w-full rounded-[12px] px-4 py-3 outline-none text-white resize-y mb-3"
          style={{
            backgroundColor: "#525162",
            ...inter,
            fontSize: "14px",
            lineHeight: "22px",
          }}
        />
        <p
          style={{
            ...inter,
            fontSize: "12px",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "12px",
          }}
        >
          {notesForParent.length}/2000
        </p>

        {notesSaved && (
          <p
            className="mb-3"
            style={{ ...inter, fontSize: "13px", color: "#22C55E" }}
          >
            Note saved.
          </p>
        )}

        <button
          type="button"
          onClick={handleSaveNotes}
          disabled={notesMutation.isPending}
          className="rounded-full px-5 py-2.5 cursor-pointer hover:opacity-90 disabled:opacity-50"
          style={{
            backgroundColor: "#00CED1",
            ...inter,
            fontWeight: 600,
            fontSize: "14px",
            color: "#111023",
          }}
        >
          {notesMutation.isPending ? "Saving…" : "Save note"}
        </button>
      </div>

      <div className="mb-6">
        <h3
          style={{
            ...inter,
            fontWeight: 600,
            fontSize: "26px",
            lineHeight: "32px",
            color: "#FFFFFF",
            marginBottom: "28px",
          }}
        >
          Statistics
        </h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div
            className="flex-1 rounded-[21px] py-6 px-8 flex items-center justify-center gap-2.5"
            style={{ backgroundColor: "#111023", border: "2px solid #858C94" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#00CED1"
              aria-hidden
            >
              <path d="M12 23c-1.5-1.2-5.5-4.7-7.2-8.2C3.2 11.3 4.1 7.8 7 6.4c1.6-.8 3.4-.4 4.5.8C12.6 6 14.4 5.6 16 6.4c2.9 1.4 3.8 4.9 2.2 8.4C16.5 18.3 13.5 21.8 12 23z" />
              <path
                d="M12 12.5c.8-1.6 2.7-2.2 4-1.2"
                fill="none"
                stroke="#111023"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <p style={{ ...inter, fontWeight: 600, fontSize: "23px", color: "#FFFFFF" }}>
              <span className="tabular-nums">{lessonsCompleted}</span>{" "}
              Lessons
            </p>
          </div>
          <div
            className="flex-1 rounded-[21px] py-6 px-8 flex items-center justify-center gap-2.5"
            style={{ backgroundColor: "#111023", border: "2px solid #858C94" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#00CED1"
              aria-hidden
            >
              <path d="M12 23c-1.5-1.2-5.5-4.7-7.2-8.2C3.2 11.3 4.1 7.8 7 6.4c1.6-.8 3.4-.4 4.5.8C12.6 6 14.4 5.6 16 6.4c2.9 1.4 3.8 4.9 2.2 8.4C16.5 18.3 13.5 21.8 12 23z" />
              <path
                d="M12 12.5c.8-1.6 2.7-2.2 4-1.2"
                fill="none"
                stroke="#111023"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <p style={{ ...inter, fontWeight: 600, fontSize: "23px", color: "#FFFFFF" }}>
              <span className="tabular-nums">{badgesEarned}</span>{" "}
              Badges
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3
            style={{
              ...inter,
              fontWeight: 600,
              fontSize: "26px",
              lineHeight: "32px",
              color: "#FFFFFF",
            }}
          >
            Badges
          </h3>
          <Link
            href="/child-dashboard/profile/badges"
            style={{
              ...inter,
              fontWeight: 600,
              fontSize: "16px",
              color: "#00CED1",
              cursor: "pointer",
            }}
          >
            See all
          </Link>
        </div>

        {badgesQuery.isLoading && (
          <div
            className="rounded-[12px] px-4 py-8 text-center"
            style={{ backgroundColor: "#313044" }}
          >
            <p style={{ ...inter, fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
              Loading badges…
            </p>
          </div>
        )}

        {!badgesQuery.isLoading && previewBadges.length === 0 && (
          <div
            className="rounded-[12px] px-4 py-8 text-center"
            style={{ backgroundColor: "#313044" }}
          >
            <p
              style={{
                ...inter,
                fontWeight: 400,
                fontSize: "14px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              No badges earned yet. Keep learning to unlock your first badge!
            </p>
          </div>
        )}

        {!badgesQuery.isLoading && previewBadges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewBadges.map((badge) => {
              const earned = badge.count > 0;
              return (
                <div
                  key={badge.kind}
                  className="rounded-[12px] px-4 py-4 flex items-center gap-4"
                  style={{ backgroundColor: "#313044" }}
                >
                  <div
                    className="size-[43px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: earned
                        ? "rgba(0,206,209,0.18)"
                        : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <BadgeShield
                      iconStyle={badge.iconStyle}
                      earned={earned}
                      imageUrl={badge.imageUrlSmall ?? badge.imageUrl}
                      alt={badge.name}
                      size={28}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className="truncate"
                        style={{
                          ...inter,
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#FFFFFF",
                        }}
                      >
                        {badge.name}
                      </span>
                      <span
                        style={{
                          ...inter,
                          fontWeight: 700,
                          fontSize: "13px",
                          color: earned ? "#00CED1" : "rgba(255,255,255,0.45)",
                        }}
                      >
                        {badge.count}
                        {badge.maxCount != null ? ` / ${badge.maxCount}` : ""}
                      </span>
                    </div>
                    {badge.maxCount != null && (
                      <div className="w-full h-3 bg-[#525162] rounded-full overflow-hidden mb-1.5">
                        <div
                          className="h-full bg-[#00CED1] rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (badge.count / Math.max(1, badge.maxCount)) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                    <p
                      className="truncate"
                      style={{
                        ...inter,
                        fontWeight: 400,
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
