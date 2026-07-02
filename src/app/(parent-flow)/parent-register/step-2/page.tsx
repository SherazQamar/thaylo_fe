"use client";

import React, { useState, useRef, FormEvent, Suspense } from "react";
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
import { useAuthStore } from "@/stores/auth.store";
import type { Child } from "@/types/api";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import ThayloBrandLink from "@/components/shared/ThayloBrandLink";

const EMPTY_CHILDREN: Child[] = [];
const DEFAULT_GRADE = "K4";
const USERNAME_REGEX = /^[a-z0-9]{5,12}$/;

function ParentRegisterStep2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAddMode = isAddChildWizardMode(searchParams);
  const { status, error } = useParentRegisterAccess(!isAddMode);
  const children = useRegisterWizardStore((s) => s.children);
  const addChild = useRegisterWizardStore((s) => s.addChild);
  const updateChild = useRegisterWizardStore((s) => s.updateChild);
  const removeChild = useRegisterWizardStore((s) => s.removeChild);
  const existingChildren = useAuthStore(
    (s) => s.user?.children ?? EMPTY_CHILDREN,
  );
  const [showModal, setShowModal] = useState(false);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentSecondName, setStudentSecondName] = useState("");
  const [studentUserName, setStudentUserName] = useState("");
  const [grade, setGrade] = useState(DEFAULT_GRADE);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [modalError, setModalError] = useState<string | null>(null);
  const pinRef0 = useRef<HTMLInputElement>(null);
  const pinRef1 = useRef<HTMLInputElement>(null);
  const pinRef2 = useRef<HTMLInputElement>(null);
  const pinRef3 = useRef<HTMLInputElement>(null);
  const pinRef4 = useRef<HTMLInputElement>(null);
  const pinRef5 = useRef<HTMLInputElement>(null);
  const pinRefs = [pinRef0, pinRef1, pinRef2, pinRef3, pinRef4, pinRef5];

  function resetModalForm() {
    setStudentFirstName("");
    setStudentSecondName("");
    setStudentUserName("");
    setGrade(DEFAULT_GRADE);
    setPin(["", "", "", "", "", ""]);
    setModalError(null);
    setEditingChildId(null);
  }

  function closeModal() {
    resetModalForm();
    setShowModal(false);
  }

  function handlePinChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < pinRefs.length - 1) {
      pinRefs[index + 1].current?.focus();
    }
  }

  function handlePinKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  }

  function handleSaveChild(e: FormEvent) {
    e.preventDefault();
    setModalError(null);

    const firstName = studentFirstName.trim();
    const secondName = studentSecondName.trim();
    const userName = studentUserName.trim();
    const pinStr = pin.join("");

    if (!firstName) {
      setModalError("Student first name is required");
      return;
    }
    if (!secondName) {
      setModalError("Student second name is required");
      return;
    }
    if (!userName) {
      setModalError("Student user name is required");
      return;
    }
    if (!USERNAME_REGEX.test(userName)) {
      setModalError(
        "Student user name must be 5-12 characters and contain only lowercase letters and numbers",
      );
      return;
    }
    if (!grade) {
      setModalError("Grade is required");
      return;
    }
    if (pinStr.length !== 6) {
      setModalError("PIN must be 6 digits");
      return;
    }

    const duplicate = children.some(
      (c) =>
        c.userName.toLowerCase() === userName.toLowerCase() &&
        c.localId !== editingChildId,
    );
    const duplicateExisting = existingChildren.some(
      (c) => c.userName.toLowerCase() === userName.toLowerCase(),
    );
    if (duplicate || duplicateExisting) {
      setModalError("A child with this user name already exists");
      return;
    }

    if (editingChildId) {
      updateChild(editingChildId, {
        firstName,
        secondName,
        userName,
        grade,
        pin: pinStr,
      });
    } else {
      addChild({
        firstName,
        secondName,
        userName,
        grade,
        pin: pinStr,
      });
    }

    closeModal();
  }

  function handleContinue() {
    if (children.length === 0) return;
    router.push(
      isAddMode
        ? withAddChildWizardMode("/parent-register/step-3")
        : "/parent-register/step-3",
    );
  }

  function handleBack() {
    if (isAddMode) {
      router.push("/parent-dashboard/children");
      return;
    }
    router.back();
  }

  function openAddModal() {
    resetModalForm();
    setShowModal(true);
  }

  function openEditModal(child: RegisterChildDraft) {
    setEditingChildId(child.localId);
    setStudentFirstName(child.firstName ?? "");
    setStudentSecondName(child.secondName ?? "");
    setStudentUserName(child.userName);
    setGrade(child.grade || DEFAULT_GRADE);
    setPin(child.pin.split("").concat(["", "", "", "", "", ""]).slice(0, 6));
    setModalError(null);
    setShowModal(true);
  }

  const isEditing = editingChildId !== null;

  const grades = ["K4", "K5", "K6", "K7", "K8", "K9", "K10", "K11", "K12"];

  if (status === "loading") {
    return <RegisterStepLoading />;
  }

  if (status === "error") {
    return <RegisterStepError message={error ?? "Please try again later."} />;
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-[#111023]">
      {/* Left Half */}
      <div className="relative hidden lg:flex w-1/2 bg-[#313044] flex-col pt-16 px-16 pb-0 overflow-hidden">
        <div className="relative z-10">
          <ThayloBrandLink />
          <h1
            className="text-white text-[36px] font-semibold leading-[1.1] tracking-tight max-w-[400px] mt-6"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Track Progress &
            <br />
            Succeed
          </h1>
          <p
            className="text-white/70 text-lg mt-3 max-w-[350px]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Monitor your student&apos;s learning journey and, celebrate every milestone they achieve.
          </p>
        </div>

        <div className="relative z-10 flex justify-start mt-auto mb-0">
          <Image
            src="/assets/Parent P1.png"
            alt="Parent character"
            width={320}
            height={360}
            className="w-[280px] max-h-[50vh] object-contain object-bottom"
          />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00CED1]/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Right Half */}
      <div className="w-full lg:w-1/2 flex-1 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-[480px] lg:max-w-none px-6 pt-4 pb-6 sm:p-8 lg:px-20 lg:py-6">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-3">
            <ThayloBrandLink size="sm" />
          </div>

          {isAddMode && (
            <div className="w-full max-w-[420px] lg:max-w-[560px] mx-auto mb-4 flex items-center justify-between">
              <h2 className="text-white text-base sm:text-lg font-semibold uppercase tracking-[0.12em]" style={{ fontFamily: "Inter, sans-serif" }}>
                Add Child
              </h2>
              <div className="hidden md:block">
                <ParentUserDropdown />
              </div>
            </div>
          )}

          {/* Step Progress Bar */}
          <div className="w-full max-w-[420px] lg:max-w-[560px] mx-auto mb-4">
            <div className="w-full h-[6px] bg-[#313044] rounded-full overflow-hidden mb-3">
              <div className="h-full w-2/4 bg-[#00CED1] rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="text-white/70 hover:text-white text-2xl cursor-pointer"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                &#8249;
              </button>
              <div className="text-right">
                <span
                  className="block text-white/70 text-sm font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  STEP 02/04
                </span>
                <span
                  className="block text-[#00CED1] text-sm font-medium"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Add Child
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[420px] lg:max-w-[560px] mx-auto">
            {/* Form Card */}
            <div className="rounded-[16px] p-6 border border-[#525162]/50 lg:bg-transparent lg:rounded-[19px] lg:border lg:border-[#525162]/50 lg:px-8 lg:py-8">
              <h2
                className="text-white text-lg sm:text-xl font-semibold mb-6 tracking-wide uppercase text-center"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Add Child
              </h2>

              {children.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center py-8">
                  <div className="mb-4 text-5xl opacity-60" aria-hidden>
                    👶
                  </div>
                  <p
                    className="text-white/40 text-sm"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    No child yet!
                  </p>
                </div>
              ) : (
                /* Children List */
                <div className="space-y-3 mb-6">
                  {children.map((child) => (
                    <div key={child.localId} className="flex items-center justify-between rounded-[16px] bg-[#313044] border border-[#525162]/50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#525162] flex items-center justify-center text-lg">
                          🧒
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>{child.userName}</p>
                          <p className="text-white/50 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                            {child.firstName} {child.secondName}
                          </p>
                          <p className="text-white/50 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>Grade {child.grade ?? "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            removeChild(child.localId);
                          }}
                          className="text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 5h12M7 5V3h4v2M5 5v10h8V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(child)}
                          className="text-white/40 hover:text-[#00CED1] transition-colors cursor-pointer"
                          aria-label={`Edit ${child.userName}`}
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M11 3l4 4-9 9H2v-4l9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={children.length === 0}
                className={`w-full py-4 rounded-[16px] text-sm font-semibold uppercase tracking-wide transition-colors cursor-pointer ${
                  children.length > 0
                    ? "bg-[#00CED1] text-white hover:bg-[#00B8BB]"
                    : "bg-[#525162]/50 text-white/30 cursor-not-allowed"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Continue
              </button>

              {/* Add Child Link */}
              <p className="text-center mt-4">
                <button
                  onClick={openAddModal}
                  className="text-[#00CED1] text-sm font-medium underline cursor-pointer"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Add child
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Child Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
          <div
            className="relative w-full max-w-[360px] lg:max-w-[500px] rounded-[19px] p-6 lg:p-8 border border-[#525162]/50"
            style={{ backgroundColor: "#313044", fontFamily: "Inter, sans-serif" }}
          >
            <h3 className="text-white text-lg font-semibold uppercase tracking-wide text-center mb-6">
              {isEditing ? "Edit Child" : "Add Child"}
            </h3>

            <form onSubmit={handleSaveChild} className="space-y-5">
              {/* Student First Name */}
              <div>
                <label className="block text-[14px] font-semibold text-white mb-1.5">
                  Student First Name
                </label>
                <input
                  type="text"
                  value={studentFirstName}
                  onChange={(e) => setStudentFirstName(e.target.value)}
                  placeholder="Alex"
                  required
                  className="w-full rounded-[40px] bg-[#111023] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
                  style={{ padding: "12px 20px", height: "44px" }}
                />
              </div>

              {/* Student Second Name */}
              <div>
                <label className="block text-[14px] font-semibold text-white mb-1.5">
                  Student Second Name
                </label>
                <input
                  type="text"
                  value={studentSecondName}
                  onChange={(e) => setStudentSecondName(e.target.value)}
                  placeholder="Smith"
                  required
                  className="w-full rounded-[40px] bg-[#111023] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
                  style={{ padding: "12px 20px", height: "44px" }}
                />
              </div>

              {/* Student User Name */}
              <div>
                <label className="block text-[14px] font-semibold text-white mb-1.5">
                  Student User Name
                </label>
                <input
                  type="text"
                  value={studentUserName}
                  onChange={(e) =>
                    setStudentUserName(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12))
                  }
                  placeholder="alex01"
                  minLength={5}
                  maxLength={12}
                  required
                  className="w-full rounded-[40px] bg-[#111023] text-white text-sm outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
                  style={{ padding: "12px 20px", height: "44px" }}
                />
                <p className="mt-1 text-xs text-white/50">
                  5-12 characters, letters and numbers only.
                </p>
              </div>

              {/* Grade - fixed to K4 */}
              <div>
                <label className="block text-[14px] font-semibold text-white mb-1.5">
                  Grade
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {grades.map((g) => (
                    <button
                      key={g}
                      type="button"
                      disabled={g !== DEFAULT_GRADE}
                      aria-disabled={g !== DEFAULT_GRADE}
                      className={`flex items-center justify-center gap-1.5 rounded-[40px] py-2.5 text-xs font-medium transition-colors ${
                        grade === g
                          ? "bg-[#111023] text-white border border-[#00CED1]"
                          : "bg-[#111023] text-white/40 border border-transparent"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full border-2 ${grade === g ? "border-[#00CED1] bg-[#00CED1]" : "border-white/30"}`} />
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pin */}
              <div>
                <label className="block text-[14px] font-semibold text-white mb-1.5">
                  Pin
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {pin.map((digit, i) => (
                    <input
                      key={i}
                      ref={pinRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(i, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(i, e)}
                      placeholder="-"
                      className="w-full text-center rounded-[12px] bg-[#111023] text-white text-lg font-medium outline-none border border-transparent focus:border-[#00CED1]/40 transition-colors placeholder:text-white/30"
                      style={{ padding: "10px 0", height: "48px" }}
                    />
                  ))}
                </div>
              </div>

              {modalError && (
                <p className="text-sm text-red-400 text-center" role="alert">
                  {modalError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-[16px] bg-[#00CED1] text-white text-sm font-semibold uppercase tracking-wide hover:bg-[#00B8BB] transition-colors cursor-pointer"
              >
                {isEditing ? "Save changes" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ParentRegisterStep2() {
  return (
    <Suspense fallback={<RegisterStepLoading />}>
      <ParentRegisterStep2Content />
    </Suspense>
  );
}
