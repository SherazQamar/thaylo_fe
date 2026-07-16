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
    <div className="min-h-screen bg-[#111023] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <BloomBuddyCheckIn timing={timing} onComplete={handleComplete} onSkip={handleComplete} />
      </div>
    </div>
  );
}
