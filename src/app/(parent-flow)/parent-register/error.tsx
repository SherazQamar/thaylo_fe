"use client";

import { useEffect } from "react";
import { RegisterStepError } from "@/components/parent/RegisterStepLoading";

export default function ParentRegisterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Parent register error:", error);
  }, [error]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#111023] px-6 gap-4">
      <RegisterStepError
        message={
          error.message ||
          "Something went wrong loading this step. Please try again."
        }
      />
      <button
        type="button"
        onClick={reset}
        className="px-6 py-3 rounded-full bg-[#00CED1] text-[#111023] text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        Try again
      </button>
    </div>
  );
}
