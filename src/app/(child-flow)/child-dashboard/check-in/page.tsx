"use client";

import { useRouter, useSearchParams } from "next/navigation";
import BloomBuddyCheckIn from "@/components/child/bloom-buddy/BloomBuddyCheckIn";
import type { SelCheckInTiming } from "@/lib/bloom-buddy-api";

export default function BloomBuddyCheckInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timing: SelCheckInTiming =
    searchParams.get("timing") === "AFTER_LESSON" ? "AFTER_LESSON" : "BEFORE_LESSON";

  const handleComplete = () => {
    if (timing === "AFTER_LESSON") {
      router.push("/child-dashboard");
      return;
    }

    // Bloom Buddy completed — next step is the camera "Get ready" screen,
    // where we decide whether Pre-test is required.
    router.push("/child-dashboard/get-ready");
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {timing === "BEFORE_LESSON" ? (
        <BloomBuddyCameraBackdrop />
      ) : (
        <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden px-3 py-3 sm:px-6 sm:py-6">
          <div className="w-full max-w-xl">
            <BloomBuddyCheckIn timing={timing} onComplete={handleComplete} />
          </div>
        </div>
      )}

      {/* Bloom Buddy popup overlay for BEFORE_LESSON */}
      {timing === "BEFORE_LESSON" ? (
        <BloomBuddyOverlay onComplete={handleComplete} />
      ) : null}
    </div>
  );
}

function BloomBuddyOverlay({
  onComplete,
}: {
  onComplete: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center overflow-y-auto px-2 py-2 sm:px-6 sm:py-6 pointer-events-auto">
      <div className="w-full max-w-xl my-auto">
        <BloomBuddyCheckIn timing={"BEFORE_LESSON"} onComplete={onComplete} />
      </div>
    </div>
  );
}

function BloomBuddyCameraBackdrop() {
  return (
    // Keep it visually clean while Bloom Buddy is showing.
    // Camera/video will be handled later by the pre-test / get-ready flow.
    <div className="absolute inset-0 z-0 bg-[#111023]" />
  );
}
