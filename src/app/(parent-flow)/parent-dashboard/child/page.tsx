"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import OnboardingResultsPanel from "@/components/onboarding/OnboardingResultsPanel";
import StudentProgressOverview from "@/components/shared/StudentProgressOverview";
import {
  archiveParentChild,
  fetchParentChild,
  resetParentChildPin,
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
  const [activeTab, setActiveTab] = useState<"overview" | "preferences">("overview");
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: child, isLoading, isError } = useQuery({
    queryKey: ["parent-child", childId],
    queryFn: () => fetchParentChild(childId),
    enabled: Number.isFinite(childId) && childId > 0,
  });

  const archiveMutation = useMutation({
    mutationFn: () => archiveParentChild(childId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["parent-children"] });
      router.push("/parent-dashboard/children");
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

  if (!Number.isFinite(childId) || childId <= 0) {
    return (
      <div className="p-6 text-white/60" style={inter}>
        Invalid child.{" "}
        <Link href="/parent-dashboard/children" className="text-[#00CED1]">
          Back to children
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
        <Link href="/parent-dashboard/children" className="text-[#00CED1]">
          Back to children
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

  return (
    <div className="p-4 md:p-6 lg:p-10 overflow-y-auto">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/parent-dashboard/children"
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1
            className="uppercase"
            style={{ ...inter, fontWeight: 700, fontSize: "24px", letterSpacing: "0.8px", color: "#DCE6EC" }}
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
          Overview
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
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setActionError(null);
                setShowPinModal(true);
              }}
              className="rounded-[16px] px-5 py-2 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "14px", color: "#111023" }}
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
        <div className="rounded-[12px] p-5" style={{ backgroundColor: "#313044" }}>
          <OnboardingResultsPanel
            mode={{ portal: "parent-child", childId }}
            title={`${displayName}'s assessment results`}
            emptyMessage="This child has not completed an onboarding assessment yet."
          />
        </div>
      )}

      {showArchiveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowArchiveConfirm(false)} aria-hidden />
          <div className="relative w-full max-w-md rounded-[20px] border border-[#525162]/50 bg-[#313044] p-6" style={inter}>
            <h2 className="text-white text-lg font-semibold">Archive child?</h2>
            <p className="text-white/60 text-sm mt-2">
              This removes {displayName} from your account. They will no longer be able to sign in.
            </p>
            {actionError && (
              <p className="text-red-400 text-sm mt-3" role="alert">{actionError}</p>
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
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowPinModal(false)} aria-hidden />
          <div className="relative w-full max-w-md rounded-[20px] border border-[#525162]/50 bg-[#313044] p-6" style={inter}>
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
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="New PIN"
                className="w-full rounded-full px-5 py-3 bg-[#111023] border border-white/10 text-white text-sm outline-none focus:border-[#00CED1]/40"
              />
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Confirm PIN"
                className="w-full rounded-full px-5 py-3 bg-[#111023] border border-white/10 text-white text-sm outline-none focus:border-[#00CED1]/40"
              />
            </div>
            {actionError && (
              <p className="text-red-400 text-sm mt-3" role="alert">{actionError}</p>
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
