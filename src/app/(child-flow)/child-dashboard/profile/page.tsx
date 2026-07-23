"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import {
  CHILD_INTEREST_SUGGESTIONS,
  isInappropriateInterest,
  isInappropriateNote,
} from "@/constants/child-interest-areas";
import { getApiErrorMessage } from "@/lib/auth-api";
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

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [interestError, setInterestError] = useState<string | null>(null);
  const [interestSaved, setInterestSaved] = useState(false);

  const [notesForParent, setNotesForParent] = useState("");
  const [notesError, setNotesError] = useState<string | null>(null);
  const [notesSaved, setNotesSaved] = useState(false);

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
        setInterestError(
          "Some words were blocked because they are not school-appropriate. Everything else was saved.",
        );
      } else {
        setInterestError(null);
        setInterestSaved(true);
        setTimeout(() => setInterestSaved(false), 2500);
      }
    },
    onError: (err) => setInterestError(getApiErrorMessage(err)),
  });

  const notesMutation = useMutation({
    mutationFn: (notes: string) => updateChildNotesForParent(notes),
    onSuccess: (updated) => {
      setNotesForParent(updated.notesForParent ?? "");
      setNotesError(null);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2500);
    },
    onError: (err) => setNotesError(getApiErrorMessage(err)),
  });

  function toggleInterest(label: string) {
    setInterestSaved(false);
    setInterestError(null);
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
      setInterestError(
        "That interest was blocked. Please choose a school-appropriate interest.",
      );
      setCustomInterest("");
      return;
    }

    toggleInterest(trimmed);
    setCustomInterest("");
  }

  function handleSaveInterests() {
    setInterestError(null);
    interestsMutation.mutate(selectedInterests);
  }

  function handleSaveNotes() {
    setNotesSaved(false);
    const trimmed = notesForParent.trim();
    if (trimmed && isInappropriateNote(trimmed)) {
      setNotesError(
        "That note was blocked. Please write something school-appropriate.",
      );
      return;
    }
    setNotesError(null);
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
            onChange={(e) => {
              setCustomInterest(e.target.value);
              setInterestError(null);
            }}
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

        {interestError && (
          <p
            className="text-sm text-red-400 mb-3"
            role="alert"
            style={inter}
          >
            {interestError}
          </p>
        )}
        {interestSaved && !interestError && (
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
            setNotesError(null);
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

        {notesError && (
          <p className="text-sm text-red-400 mb-3" role="alert" style={inter}>
            {notesError}
          </p>
        )}
        {notesSaved && !notesError && (
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
            fontWeight: 700,
            fontSize: "20px",
            color: "#FFFFFF",
            marginBottom: "12px",
          }}
        >
          Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div
            className="rounded-[12px] py-3 flex items-center justify-center gap-2"
            style={{ border: "1px solid #525162" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00CED1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22V8" />
              <path d="M5 12H2a10 10 0 0020 0h-3" />
            </svg>
            <span
              style={{
                ...inter,
                fontWeight: 700,
                fontSize: "16px",
                color: "#FFFFFF",
              }}
            >
              0 Lessons
            </span>
          </div>
          <div
            className="rounded-[12px] py-3 flex items-center justify-center gap-2"
            style={{ border: "1px solid #525162" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00CED1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 15l-2 5-3-1 1.5-4M12 15l2 5 3-1-1.5-4M6 9a6 6 0 1012 0 6 6 0 00-12 0z" />
            </svg>
            <span
              style={{
                ...inter,
                fontWeight: 700,
                fontSize: "16px",
                color: "#FFFFFF",
              }}
            >
              {badgesEarned} Badge{badgesEarned === 1 ? "" : "s"}
            </span>
          </div>
        </div>
        <p
          style={{
            ...inter,
            fontWeight: 400,
            fontSize: "12px",
            color: "rgba(255,255,255,0.4)",
            marginTop: "10px",
          }}
        >
          {badgesQuery.data
            ? `${badgesQuery.data.plantStatus} · ${badgesQuery.data.masteredCount} of ${badgesQuery.data.totalLessons} lessons mastered`
            : "Lesson and badge counts update as you complete activities."}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3
            style={{
              ...inter,
              fontWeight: 700,
              fontSize: "20px",
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
              fontSize: "13px",
              color: "#00CED1",
              cursor: "pointer",
            }}
          >
            See all
          </Link>
        </div>
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
      </div>
    </div>
  );
}
