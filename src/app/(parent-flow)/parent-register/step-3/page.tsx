"use client";

import React, { useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import RegisterStepLoading, {
  RegisterStepError,
} from "@/components/parent/RegisterStepLoading";
import { useParentRegisterAccess } from "@/hooks/use-parent-register-access";
import {
  isAddChildWizardMode,
  withAddChildWizardMode,
} from "@/lib/parent-registration";
import { useRegisterWizardStore } from "@/stores/register-wizard.store";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import ThayloBrandLink from "@/components/shared/ThayloBrandLink";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function ParentRegisterStep3Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAddMode = isAddChildWizardMode(searchParams);
  const { status, error } = useParentRegisterAccess(!isAddMode);
  const children = useRegisterWizardStore((s) => s.children);

  useEffect(() => {
    if (status !== "ready") return;
    if (children.length === 0) {
      router.replace(
        isAddMode
          ? withAddChildWizardMode("/parent-register/step-2")
          : "/parent-register/step-2",
      );
    }
  }, [router, children.length, isAddMode, status]);

  if (status === "loading") {
    return <RegisterStepLoading />;
  }

  if (status === "error") {
    return <RegisterStepError message={error ?? "Please try again later."} />;
  }

  if (children.length === 0) {
    return <RegisterStepLoading />;
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-[#111023]">
      <div className="relative hidden lg:flex w-1/2 bg-[#313044] flex-col pt-16 px-16 pb-0 overflow-hidden">
        <div className="relative z-10">
          <ThayloBrandLink />
          <h1 className="text-white text-[36px] font-semibold leading-[1.1] tracking-tight max-w-[400px] mt-6" style={inter}>
            Track Progress &<br />Succeed
          </h1>
          <p className="text-white/70 text-lg mt-3 max-w-[350px]" style={inter}>
            Set goals, monitor your learning journey, and celebrate every milestone you achieve.
          </p>
        </div>
        <div className="relative z-10 flex justify-start mt-auto mb-0">
          <Image src="/assets/Parent P1.png" alt="Parent character" width={320} height={360} className="w-[280px] max-h-[50vh] object-contain object-bottom" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00CED1]/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="w-full lg:w-1/2 flex-1 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-[480px] lg:max-w-none px-6 pt-4 pb-6 sm:p-8 lg:px-20 lg:py-6">
          <div className="lg:hidden mb-3">
            <ThayloBrandLink size="sm" />
          </div>

          {isAddMode && (
            <div className="w-full max-w-[420px] lg:max-w-[560px] mx-auto mb-4 flex items-center justify-between">
              <h2 className="text-white text-base sm:text-lg font-semibold uppercase tracking-[0.12em]" style={inter}>
                Add Child
              </h2>
              <div className="hidden md:block">
                <ParentUserDropdown />
              </div>
            </div>
          )}

          <div className="w-full max-w-[420px] lg:max-w-[560px] mx-auto mb-4">
            <div className="w-full h-[6px] bg-[#313044] rounded-full overflow-hidden mb-3">
              <div className="h-full w-3/4 bg-[#00CED1] rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => router.back()} className="text-white/70 hover:text-white text-2xl cursor-pointer" style={inter}>&#8249;</button>
              <div className="text-right">
                <span className="block text-white/70 text-sm font-medium" style={inter}>STEP 03/04</span>
                <span className="block text-[#00CED1] text-sm font-medium" style={inter}>Add student</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[420px] lg:max-w-[560px] mx-auto">
            <div className="rounded-[16px] p-5 border border-[#525162]/50 lg:bg-transparent lg:rounded-[19px] lg:border lg:border-[#525162]/50 lg:px-8 lg:py-6">
              <h2 className="text-white text-base sm:text-lg font-semibold mb-1 tracking-wide uppercase text-center" style={inter}>
                Student documents
              </h2>
              <p className="text-white/40 text-xs text-center mb-5" style={inter}>
                Document upload is not required right now. Continue to finish adding your student.
              </p>

              <div className="rounded-[12px] border border-[#525162]/50 bg-[#313044]/30 px-4 py-5 space-y-3">
                {children.map((child) => (
                  <div
                    key={child.localId}
                    className="flex items-center justify-between rounded-[10px] bg-[#313044] px-4 py-3"
                  >
                    <span className="text-white text-sm font-medium" style={inter}>
                      {child.userName}
                    </span>
                    <span className="text-white/40 text-xs" style={inter}>
                      Ready to continue
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    isAddMode
                      ? withAddChildWizardMode("/parent-register/step-4")
                      : "/parent-register/step-4",
                  )
                }
                className="w-full py-4 rounded-[16px] bg-[#00CED1] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors cursor-pointer mt-6"
                style={inter}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParentRegisterStep3() {
  return (
    <Suspense fallback={<RegisterStepLoading />}>
      <ParentRegisterStep3Content />
    </Suspense>
  );
}
