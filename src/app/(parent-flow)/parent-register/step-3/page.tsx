"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
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
import {
  useRegisterWizardStore,
  type RegisterChildDraft,
} from "@/stores/register-wizard.store";

function UploadSection({ child }: { child: RegisterChildDraft }) {
  const setChildFiles = useRegisterWizardStore((s) => s.setChildFiles);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(fileList: FileList) {
    const newFiles = Array.from(fileList);
    setChildFiles(child.localId, [...child.files, ...newFiles]);
  }

  return (
    <div>
      <p
        className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {child.userName} Documents
      </p>

      <div className="rounded-[12px] border border-dashed border-[#525162]/50 overflow-hidden">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileRef.current?.click()}
          className={`py-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? "bg-[#00CED1]/5" : "bg-[#313044]/30"
          }`}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-3">
            <path d="M16 4v20M8 12l8-8 8 8" stroke="#525162" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 24v4h24v-4" stroke="#525162" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-white/50 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Drag and Drop or{" "}
            <span className="text-[#00CED1] font-medium">browse</span>
          </p>
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>

        {child.files.length > 0 && (
          <div className="px-3 py-2 space-y-1">
            {child.files.map((f, i) => (
              <div
                key={`${f.name}-${i}`}
                className="flex items-center justify-between text-white/50 text-xs"
              >
                <span className="truncate pr-2">{f.name}</span>
                <span className="shrink-0">{(f.size / 1024).toFixed(1)} KB</span>
              </div>
            ))}
          </div>
        )}

        <div>
          <span className="text-white/50 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Or Add a File{" "}
            <span className="text-[#00CED1] font-medium">URL</span>
          </span>
        </div>
      </div>
    </div>
  );
}

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
          <div className="flex items-center gap-2.5">
            <Image src="/assets/logo.png" alt="Thaylo" width={48} height={48} className="w-12 h-12 object-contain" />
            <div className="leading-none">
              <span className="block text-[20px] font-medium tracking-[0.08em]" style={{ background: "linear-gradient(90deg, #60D624, #00A19A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                THAYLO
              </span>
              <span className="block text-[8px] tracking-[0.2em] text-[#60D624]/70 uppercase mt-0.5">
                GLOBAL AI SCHOOL
              </span>
            </div>
          </div>
          <h1 className="text-white text-[36px] font-semibold leading-[1.1] tracking-tight max-w-[400px] mt-6" style={{ fontFamily: "Inter, sans-serif" }}>
            Track Progress &<br />Succeed
          </h1>
          <p className="text-white/70 text-lg mt-3 max-w-[350px]" style={{ fontFamily: "Inter, sans-serif" }}>
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
          <div className="lg:hidden mb-3 flex items-center gap-2.5">
            <Image src="/assets/logo.png" alt="Thaylo" width={40} height={40} className="w-10 h-10 object-contain" />
            <div className="leading-none">
              <span className="block text-[18px] font-medium tracking-[0.08em]" style={{ background: "linear-gradient(90deg, #60D624, #00A19A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>THAYLO</span>
            </div>
          </div>

          <div className="w-full max-w-[420px] lg:max-w-[560px] mx-auto mb-4">
            <div className="w-full h-[6px] bg-[#313044] rounded-full overflow-hidden mb-3">
              <div className="h-full w-3/4 bg-[#00CED1] rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => router.back()} className="text-white/70 hover:text-white text-2xl cursor-pointer" style={{ fontFamily: "Inter, sans-serif" }}>&#8249;</button>
              <div className="text-right">
                <span className="block text-white/70 text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>STEP 03/04</span>
                <span className="block text-[#00CED1] text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>Add student</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[420px] lg:max-w-[560px] mx-auto">
            <div className="rounded-[16px] p-5 border border-[#525162]/50 lg:bg-transparent lg:rounded-[19px] lg:border lg:border-[#525162]/50 lg:px-8 lg:py-6">
              <h2 className="text-white text-base sm:text-lg font-semibold mb-1 tracking-wide uppercase text-center" style={{ fontFamily: "Inter, sans-serif" }}>
                Upload Documents of Your Child
              </h2>
              <p className="text-white/40 text-xs text-center mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                Optional — you can skip this step and continue without uploading
              </p>

              <div className="space-y-5">
                {children.map((child) => (
                  <UploadSection key={child.localId} child={child} />
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
                style={{ fontFamily: "Inter, sans-serif" }}
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
