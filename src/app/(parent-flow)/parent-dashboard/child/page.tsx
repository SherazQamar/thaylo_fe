"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import OnboardingResultsPanel from "@/components/onboarding/OnboardingResultsPanel";
import StudentProgressOverview from "@/components/shared/StudentProgressOverview";
import { CHILD_INTEREST_SUGGESTIONS } from "@/constants/child-interest-areas";
import {
  archiveParentChild,
  fetchParentChild,
  resetParentChildPin,
  updateParentChild,
} from "@/lib/parent-api";
import { getApiErrorMessage } from "@/lib/auth-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

function ChildDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const childId = Number(searchParams.get("id"));
  const fromProfile = searchParams.get("from") === "profile";
  const backHref = fromProfile
    ? "/parent-dashboard/profile"
    : "/parent-dashboard/children";
  const backLabel = fromProfile ? "Back to profile" : "Back to children";

  const [activeTab, setActiveTab] = useState<"overview" | "preferences">(
    "overview",
  );
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const [editingInterests, setEditingInterests] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [interestError, setInterestError] = useState<string | null>(null);
  const [interestSaved, setInterestSaved] = useState(false);

  const { data: child, isLoading, isError } = useQuery({
    queryKey: ["parent-child", childId],
    queryFn: () => fetchParentChild(childId),
    enabled: Number.isFinite(childId) && childId > 0,
  });

  useEffect(() => {
    if (!child) return;
    setSelectedInterests(child.interestAreas ?? []);
    setEditingInterests(false);
    setInterestError(null);
    setInterestSaved(false);
  }, [child]);

  const archiveMutation = useMutation({
    mutationFn: () => archiveParentChild(childId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["parent-children"] });
      router.push(backHref);
    },
    onError: (err) => setActionError(getApiErrorMessage(err)),
  });

  const resetPinMutation = useMutation({
    mutationFn: (pin: string) => resetParentChildPin(childId, pin),
    onSuccess: () => {
      setShowPinModal(false);
      setNewPin("");
      setConfirmPin("");
      setActionError(null);
    },
    onError: (err) => setActionError(getApiErrorMessage(err)),
  });

  const interestsMutation = useMutation({
    mutationFn: (interestAreas: string[]) =>
      updateParentChild(childId, { interestAreas }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["parent-child", childId] }),
        queryClient.invalidateQueries({ queryKey: ["parent-children"] }),
      ]);
      setEditingInterests(false);
      setInterestError(null);
      setInterestSaved(true);
      setTimeout(() => setInterestSaved(false), 2500);
    },
    onError: (err) => setInterestError(getApiErrorMessage(err)),
  });

  if (!Number.isFinite(childId) || childId <= 0) {
    return (
      <div className="p-6 text-white/60" style={inter}>
        Invalid child.{" "}
        <Link href={backHref} className="text-[#00CED1]">
          {backLabel}
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="w-10 h-10 border-2 border-[#00CED1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !child) {
    return (
      <div className="p-6 text-white/60" style={inter}>
        Child not found.{" "}
        <Link href={backHref} className="text-[#00CED1]">
          {backLabel}
        </Link>
      </div>
    );
  }

  const displayName =
    [child.firstName, child.secondName].filter(Boolean).join(" ").trim() ||
    child.userName;

  function handleResetPin() {
    setActionError(null);
    if (!/^\d{6}$/.test(newPin)) {
      setActionError("PIN must be exactly 6 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      setActionError("PINs do not match.");
      return;
    }
    resetPinMutation.mutate(newPin);
  }

  function toggleInterest(label: string) {
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
    toggleInterest(trimmed);
    setCustomInterest("");
  }

  function handleSaveInterests() {
    setInterestError(null);
    interestsMutation.mutate(selectedInterests);
  }

  function cancelEditInterests() {
    setSelectedInterests(child?.interestAreas ?? []);
    setEditingInterests(false);
    setInterestError(null);
    setCustomInterest("");
  }

  const suggestionSet = new Set(
    CHILD_INTEREST_SUGGESTIONS.map((s) => s.toLowerCase()),
  );
  const customSelected = selectedInterests.filter(
    (item) => !suggestionSet.has(item.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 lg:p-10 overflow-y-auto">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="text-white/60 hover:text-white transition-colors"
            aria-label={backLabel}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1
            className="uppercase"
            style={{
              ...inter,
              fontWeight: 700,
              fontSize: "24px",
              letterSpacing: "0.8px",
              color: "#DCE6EC",
            }}
          >
            {displayName}
          </h1>
        </div>
        <div className="hidden md:block">
          <ParentUserDropdown />
        </div>
      </div>

      <div className="flex gap-6 mb-6 border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-2.5 cursor-pointer transition-colors ${activeTab === "overview" ? "border-b-2 border-[#00CED1] text-[#00CED1]" : "text-white/40 hover:text-white/60"}`}
          style={{ ...inter, fontWeight: 500, fontSize: "14px" }}
        >
          Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preferences")}
          className={`pb-2.5 cursor-pointer transition-colors ${activeTab === "preferences" ? "border-b-2 border-[#00CED1] text-[#00CED1]" : "text-white/40 hover:text-white/60"}`}
          style={{ ...inter, fontWeight: 500, fontSize: "14px" }}
        >
          Learning Preferences
        </button>
      </div>

      {activeTab === "overview" ? (
        <>
          <div
            className="rounded-[12px] p-5 md:p-6 mb-6"
            style={{ backgroundColor: "#313044" }}
          >
            <h2
              style={{
                ...inter,
                fontWeight: 700,
                fontSize: "18px",
                color: "#FFFFFF",
                marginBottom: "16px",
              }}
            >
              Child profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProfileField label="Username" value={child.userName} />
              <ProfileField
                label="Name"
                value={
                  [child.firstName, child.secondName]
                    .filter(Boolean)
                    .join(" ")
                    .trim() || "—"
                }
              />
              <ProfileField
                label="Grade"
                value={formatChildGrade(child.grade)}
              />
              <ProfileField
                label="Member since"
                value={new Date(child.createdAt).toLocaleDateString()}
              />
            </div>
          </div>

          <div
            className="rounded-[12px] p-5 md:p-6 mb-6"
            style={{ backgroundColor: "#313044" }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2
                  style={{
                    ...inter,
                    fontWeight: 700,
                    fontSize: "18px",
                    color: "#FFFFFF",
                    marginBottom: "4px",
                  }}
                >
                  Interest areas
                </h2>
                <p
                  style={{
                    ...inter,
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Topics this child enjoys — used to personalize learning.
                </p>
              </div>
              {!editingInterests && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingInterests(true);
                    setInterestSaved(false);
                    setInterestError(null);
                  }}
                  className="shrink-0 rounded-full px-4 py-2 cursor-pointer hover:opacity-90"
                  style={{
                    backgroundColor: "#00CED1",
                    ...inter,
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "#111023",
                  }}
                >
                  Edit
                </button>
              )}
            </div>

            {!editingInterests ? (
              (child.interestAreas?.length ?? 0) === 0 ? (
                <p
                  style={{
                    ...inter,
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  No interest areas yet. Click Edit to add some.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {child.interestAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full px-3 py-1.5"
                      style={{
                        backgroundColor: "rgba(0,206,209,0.15)",
                        border: "1px solid rgba(0,206,209,0.35)",
                        ...inter,
                        fontSize: "13px",
                        color: "#00CED1",
                      }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )
            ) : (
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {CHILD_INTEREST_SUGGESTIONS.map((suggestion) => {
                    const selected = selectedInterests.some(
                      (item) =>
                        item.toLowerCase() === suggestion.toLowerCase(),
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

                <form
                  onSubmit={addCustomInterest}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  <input
                    type="text"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    maxLength={60}
                    placeholder="Add a custom interest"
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

                <div className="flex flex-wrap gap-3">
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
                  <button
                    type="button"
                    onClick={cancelEditInterests}
                    disabled={interestsMutation.isPending}
                    className="rounded-full px-5 py-2.5 cursor-pointer hover:bg-white/10 disabled:opacity-50"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      ...inter,
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#FFFFFF",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {interestSaved && !editingInterests && (
              <p
                className="mt-3"
                style={{ ...inter, fontSize: "13px", color: "#22C55E" }}
              >
                Interest areas saved.
              </p>
            )}
          </div>

          <div
            className="rounded-[12px] p-5 md:p-6 mb-6"
            style={{ backgroundColor: "#313044" }}
          >
            <h2
              style={{
                ...inter,
                fontWeight: 700,
                fontSize: "18px",
                color: "#FFFFFF",
                marginBottom: "4px",
              }}
            >
              Notes from child
            </h2>
            <p
              style={{
                ...inter,
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "14px",
              }}
            >
              Messages your child writes for you on their profile.
            </p>
            {child.notesForParent?.trim() ? (
              <p
                className="whitespace-pre-wrap"
                style={{
                  ...inter,
                  fontSize: "14px",
                  lineHeight: "22px",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {child.notesForParent}
              </p>
            ) : (
              <p
                style={{
                  ...inter,
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                No notes from this child yet.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setActionError(null);
                setShowPinModal(true);
              }}
              className="rounded-[16px] px-5 py-2 cursor-pointer hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "#00CED1",
                ...inter,
                fontWeight: 600,
                fontSize: "14px",
                color: "#111023",
              }}
            >
              Reset PIN
            </button>
            <button
              type="button"
              onClick={() => {
                setActionError(null);
                setShowArchiveConfirm(true);
              }}
              className="rounded-[16px] px-5 py-2 cursor-pointer hover:opacity-90 transition-opacity border border-red-400/40 text-red-300"
              style={{ ...inter, fontWeight: 600, fontSize: "14px" }}
            >
              Archive
            </button>
          </div>
          {actionError && !showPinModal && !showArchiveConfirm && (
            <p className="text-red-400 text-sm mb-4" role="alert" style={inter}>
              {actionError}
            </p>
          )}
          <StudentProgressOverview
            displayName={displayName}
            gradeLabel={formatChildGrade(child.grade)}
            messagesHref="/parent-dashboard/message"
          />
        </>
      ) : (
        <div
          className="rounded-[12px] p-5"
          style={{ backgroundColor: "#313044" }}
        >
          <OnboardingResultsPanel
            mode={{ portal: "parent-child", childId }}
            title={`${displayName}'s assessment results`}
            emptyMessage="This child has not completed an onboarding assessment yet."
          />
        </div>
      )}

      {showArchiveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowArchiveConfirm(false)}
            aria-hidden
          />
          <div
            className="relative w-full max-w-md rounded-[20px] border border-[#525162]/50 bg-[#313044] p-6"
            style={inter}
          >
            <h2 className="text-white text-lg font-semibold">Archive child?</h2>
            <p className="text-white/60 text-sm mt-2">
              This removes {displayName} from your account. They will no longer
              be able to sign in.
            </p>
            {actionError && (
              <p className="text-red-400 text-sm mt-3" role="alert">
                {actionError}
              </p>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowArchiveConfirm(false)}
                className="px-4 py-2 rounded-full text-white/70 border border-white/15"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={archiveMutation.isPending}
                onClick={() => archiveMutation.mutate()}
                className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold disabled:opacity-60"
              >
                {archiveMutation.isPending ? "Archiving…" : "Archive child"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowPinModal(false)}
            aria-hidden
          />
          <div
            className="relative w-full max-w-md rounded-[20px] border border-[#525162]/50 bg-[#313044] p-6"
            style={inter}
          >
            <h2 className="text-white text-lg font-semibold">Reset child PIN</h2>
            <p className="text-white/60 text-sm mt-2">
              Set a new 6-digit PIN for {displayName} to use at child sign-in.
            </p>
            <div className="space-y-3 mt-4">
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={newPin}
                onChange={(e) =>
                  setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="New PIN"
                className="w-full rounded-full px-5 py-3 bg-[#111023] border border-white/10 text-white text-sm outline-none focus:border-[#00CED1]/40"
              />
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Confirm PIN"
                className="w-full rounded-full px-5 py-3 bg-[#111023] border border-white/10 text-white text-sm outline-none focus:border-[#00CED1]/40"
              />
            </div>
            {actionError && (
              <p className="text-red-400 text-sm mt-3" role="alert">
                {actionError}
              </p>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="px-4 py-2 rounded-full text-white/70 border border-white/15"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resetPinMutation.isPending}
                onClick={handleResetPin}
                className="px-4 py-2 rounded-full bg-[#00CED1] text-[#111023] font-semibold disabled:opacity-60"
              >
                {resetPinMutation.isPending ? "Saving…" : "Save PIN"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-[12px] p-4"
      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    >
      <p
        style={{
          ...inter,
          fontSize: "12px",
          color: "rgba(255,255,255,0.45)",
          marginBottom: "6px",
        }}
      >
        {label}
      </p>
      <p style={{ ...inter, fontWeight: 600, fontSize: "15px", color: "#FFFFFF" }}>
        {value}
      </p>
    </div>
  );
}

export default function ChildDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 flex justify-center">
          <div className="w-10 h-10 border-2 border-[#00CED1] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ChildDetailContent />
    </Suspense>
  );
}
