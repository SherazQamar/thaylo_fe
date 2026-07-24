"use client";

import React, { useState } from "react";
import SectionLabel from "@/components/ui/SectionLabel";

const faqs = [
  {
    question: "Do I need prior experience to enroll?",
    answer:
      "No prior experience is required. Thaylo’s current pilot is designed for Grade 4 learners and begins with foundational instruction that adapts based on each student’s understanding. As Thaylo expands, the same mastery-based approach will support learners across additional grade levels.",
  },
  {
    question: "How long are daily lessons ?",
    answer:
      "Daily lessons are designed to be completed in approximately 45-60 minutes, with flexibility built in to accommodate different learning paces.",
  },
  {
    question: "How does the AI Instructor work?",
    answer:
      "The AI Instructor delivers structured lessons using proven instructional strategies, adapting in real time while staying aligned to human-designed curriculum and learning goals.",
  },
  {
    question: "How does Bloom Buddy support emotional wellbeing ?",
    answer:
      "Calyx, your Bloom Buddy, supports focus and reflection through simple check-ins that help students notice how they're feeling so they can fully engage with learning.",
  },
  {
    question: "Is there a real teacher involved?",
    answer:
      "Yes. A real educator (Wayfinder) oversees progress, intervenes when learning stalls, and partners with families when human attention is needed.",
  },
  {
    question: "Is Thaylo self-paced or scheduled?",
    answer:
      "Thaylo combines both approaches—students move at their own pace within a structured curriculum framework, ensuring flexibility without sacrificing rigor.",
  },
  {
    question: "Is this a full academic program?",
    answer:
      "Yes. Thaylo offers a full academic-year course load including core subjects and electives, all aligned to mastery-based progression standards.",
  },
  {
    question: "What happens if my child finishes early?",
    answer:
      "Students who demonstrate mastery early can explore enrichment content, electives, or advanced modules—always guided by the same quality instruction.",
  },
];

/** Mobile Home Figma shows the first 5 questions only; desktop shows all 8. */
const MOBILE_FAQ_COUNT = 5;

export type FAQItem = { question: string; answer: string };

/** Contact Us Figma — 4 questions (desktop + mobile). */
export const contactFaqs: FAQItem[] = [
  {
    question: "Do I need prior experience to join the course?",
    answer:
      "No experience is needed. The course starts with the basics and guides you step by step. You will learn through practical exercises and hands-on projects. By the end, you’ll be confident using AI tools in real scenarios.",
  },
  {
    question: "How long are daily lessons ?",
    answer:
      "Daily lessons are designed to be completed in approximately 45-60 minutes, with flexibility built in to accommodate different learning paces.",
  },
  {
    question: "How does the AI tutor work ?",
    answer:
      "The AI Instructor delivers structured lessons using proven instructional strategies, adapting in real time while staying aligned to human-designed curriculum and learning goals.",
  },
  {
    question: "How does Bloom Buddy support emotional wellbeing ?",
    answer:
      "Calyx, your Bloom Buddy, supports focus and reflection through simple check-ins that help students notice how they're feeling so they can fully engage with learning.",
  },
];

type FAQProps = {
  items?: FAQItem[];
  /** Hide items at this index and beyond on small screens. Omit to show all. */
  mobileCount?: number;
  /** Figma Home uses FAQS; Contact uses lowercase faqs */
  label?: string;
  labelUppercase?: boolean;
};

export default function FAQ({
  items,
  mobileCount,
  label = "FAQS",
  labelUppercase = true,
}: FAQProps = {}) {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const list = items ?? faqs;
  const hideAfter = mobileCount ?? (items ? undefined : MOBILE_FAQ_COUNT);

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white flex flex-col justify-center">
      <div className="max-w-[1320px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-20">
          <div className="flex flex-col justify-between">
            <div>
              <SectionLabel
                text={label}
                className="!justify-start"
                uppercase={labelUppercase}
              />
              <h2
                className="text-[20px] sm:text-2xl md:text-4xl font-normal text-[#1A2B3D] mt-4 mb-8 leading-[1.2] tracking-[-0.64px]"
                style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
              >
                Questions Parents Ask
              </h2>
            </div>

            <div
              className="mt-auto"
              style={{ backgroundColor: "#EBEEF2", borderRadius: "15px", padding: "30px" }}
            >
              <div style={{ marginBottom: "30px" }}>
                <p
                  className="font-normal text-[#606B68]"
                  style={{
                    fontFamily: "Inter, var(--font-inter), sans-serif",
                    fontSize: "18px",
                    lineHeight: "27px",
                    letterSpacing: "-0.48px",
                    marginBottom: "4px",
                  }}
                >
                  24/7 Support
                </p>
                <div className="flex items-center justify-between">
                  <p
                    className="font-medium text-[#0C211D]"
                    style={{ fontSize: "26px", lineHeight: "31.2px", letterSpacing: "-0.48px" }}
                  >
                    (252) 769-4545
                  </p>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#14B8A6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0"
                  >
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </div>
              </div>
              <div className="border-t border-gray-200" style={{ paddingTop: "30px" }}>
                <p
                  className="font-normal text-[#606B68]"
                  style={{
                    fontFamily: "Inter, var(--font-inter), sans-serif",
                    fontSize: "18px",
                    lineHeight: "27px",
                    letterSpacing: "-0.48px",
                    marginBottom: "4px",
                  }}
                >
                  Technical Support
                </p>
                <div className="flex items-center justify-between">
                  <p
                    className="font-medium text-[#0C211D]"
                    style={{ fontSize: "20px", lineHeight: "31.2px", letterSpacing: "-0.48px" }}
                  >
                    info@thayloglobal.com
                  </p>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#14B8A6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {list.map((faq, index) => {
              const mobileHidden =
                hideAfter !== undefined && index >= hideAfter;
              return (
                <div
                  key={index}
                  className={`py-7 ${mobileHidden ? "hidden sm:block" : ""}`}
                >
                  <button
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                    onClick={() => setOpenIndex(index)}
                    type="button"
                  >
                    <span
                      className="text-lg md:text-xl font-semibold text-[#1A2B3D] pr-4"
                      style={{ fontSize: "20px", lineHeight: "28px", letterSpacing: "-0.48px" }}
                    >
                      {faq.question}
                    </span>
                    <span
                      className="flex-shrink-0 flex items-center justify-center text-[#1A2B3D] font-light"
                      style={{ fontSize: "28px", lineHeight: "1", width: "28px", height: "28px" }}
                    >
                      {openIndex === index ? "−" : "+"}
                    </span>
                  </button>
                  {openIndex === index && (
                    <p
                      className="mt-3 text-[#606B68] pr-8 font-normal"
                      style={{
                        fontFamily: "Inter, var(--font-inter), sans-serif",
                        fontSize: "16px",
                        lineHeight: "26px",
                        letterSpacing: "-0.32px",
                      }}
                    >
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
