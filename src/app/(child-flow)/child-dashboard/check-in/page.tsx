"use client";

import { useRouter, useSearchParams } from "next/navigation";
import BloomBuddyCheckIn from "@/components/child/bloom-buddy/BloomBuddyCheckIn";
import type { SelCheckInTiming } from "@/lib/bloom-buddy-api";
import { navigateToChildClass } from "@/lib/start-child-class";

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
    void navigateToChildClass(router, true, { skipBloomBuddy: true });
  };

  return (
    <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden px-3 py-3 sm:px-6 sm:py-6">
      <div className="w-full max-w-xl">
        <BloomBuddyCheckIn timing={timing} onComplete={handleComplete} onSkip={handleComplete} />
      </div>
    </div>
  );
}
