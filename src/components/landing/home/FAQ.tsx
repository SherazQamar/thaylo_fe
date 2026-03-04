"use client";

import React, { useState } from "react";
import SectionLabel from "@/components/ui/SectionLabel";

const faqs = [
  {
    question: "Do I need prior experience to join the course?",
    answer:
      "No experience is needed. The course starts with the basics and guides you step by step. You will learn through practical exercises and hands-on projects. By the end, you'll be confident using AI tools in real scenarios.",
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

export default function FAQ({ maxItems }: { maxItems?: number } = {}) {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const displayFaqs = maxItems ? faqs.slice(0, maxItems) : faqs;

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white flex flex-col justify-center">
      <div className="max-w-[1320px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-20">
          {/* Left Column */}
          <div>
            <SectionLabel text="FAQS" className="!justify-start" />
            <h2 className="text-2xl md:text-4xl font-normal text-[#1A2B3D] mt-4 mb-8 leading-tight">
              Questions
              <br />
              Parents Ask
            </h2>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="mb-6">
                <p className="text-xs text-[#6B7280] mb-1">24/7 Support</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-normal text-[#1A2B3D]">
                    (252) 769-4545
                  </p>
                  <div className="w-10 h-10 rounded-full bg-[#E0F2FE] flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <p className="text-xs text-[#6B7280] mb-1">
                  Technical Support
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-base font-normal text-[#1A2B3D]">
                    info@thayloglobal.com
                  </p>
                  <div className="w-10 h-10 rounded-full bg-[#E0F2FE] flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div className="divide-y divide-gray-200">
            {displayFaqs.map((faq, index) => (
              <div key={index} className="py-7">
                <button
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                  onClick={() => setOpenIndex(index)}
                >
                  <span className="text-lg md:text-xl font-normal text-[#1A2B3D] pr-4">
                    {faq.question}
                  </span>
                  <span className="text-xl text-[#1A2B3D] flex-shrink-0">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <p className="mt-3 text-sm text-[#6B7280] leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
