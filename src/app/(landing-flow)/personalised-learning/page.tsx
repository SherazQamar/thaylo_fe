import React from "react";
import Image from "next/image";
import Navbar from "@/components/landing/shared/Navbar";
import CTABanner from "@/components/landing/shared/CTABanner";
import Footer from "@/components/landing/shared/Footer";

const sections = [
  {
    label: "REAL LEARNING. REAL CHILDREN. REAL IMPACT.",
    title: "A Coherent Model for Learning",
    paragraphs: [
      "Thaylo's Learning Model is built around the idea that strong thinking develops over time. Learning is most effective when skills are introduced clearly, practiced intentionally, and revisited in increasingly complex ways as students grow.",
      "The model is designed to support deep understanding by guiding students from foundational skills to higher-level thinking, research, and communication—across subjects and grade levels.",
    ],
    image: "/assets/personalize learning.png",
    imageAlt: "Children learning with blocks",
    layout: "text-left" as const,
  },
  {
    title: "Clear Learning Expectations",
    paragraphs: [
      "At each grade level, students work toward clearly defined learning expectations. These expectations are shared openly with families and students, so everyone understands what mastery looks like and what progress means.",
      "Expectations remain consistent, while the path toward meeting them adapts to each learner.",
    ],
    image: "/assets/o 1.png",
    imageAlt: "Children with alphabet blocks",
    layout: "image-left" as const,
  },
  {
    title: "Building Thinking\nOver Time",
    paragraphs: [
      "Learning at Thaylo is intentionally sequenced. Students begin by building strong foundations in reading, writing, and reasoning. Over time, they are guided to ask better questions, seek information thoughtfully, connect ideas, and express understanding clearly.",
    ],
    image: "/assets/LM 3.jpg",
    imageAlt: "Children building and thinking",
    layout: "text-left" as const,
  },
  {
    title: "Perspective-Seeking and Meaning Making",
    paragraphs: [
      "Thaylo emphasizes learning that encourages students to examine ideas from multiple angles, consider context, and understand how knowledge connects across subjects and experiences.",
      "This approach strengthens reasoning, comprehension, and problem-solving by helping students move beyond memorization toward meaning.",
    ],
    image: "/assets/o 1.png",
    imageAlt: "Children exploring perspectives",
    layout: "image-left" as const,
  },
  {
    title: "Research, Synthesis,\nand Communication",
    paragraphs: [
      "As students progress, learning increasingly centers on gathering information, evaluating sources, organizing ideas, and communicating understanding through writing, discussion, and projects.",
      "These skills are developed gradually and intentionally, so students are not rushed into complex tasks before they are ready.",
    ],
    image: "/assets/LM 3.jpg",
    imageAlt: "Students researching and communicating",
    layout: "text-left" as const,
  },
  {
    title: "Designed to Grow\nwith Students",
    paragraphs: [
      "While Thaylo is currently piloting Grade 4 English Language Arts, the Learning Model is designed to apply consistently across subjects and grade levels.",
      "As additional courses are introduced, the same approach—clear expectations, intentional sequencing, and mastery-based progress—will guide instruction.",
    ],
    image: "/assets/o 1.png",
    imageAlt: "Students growing with Thaylo",
    layout: "image-left" as const,
  },
];

export default function PersonalisedLearning() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-[#0B1D2E] overflow-hidden">
        <Image
          src="/assets/aboutbg.png"
          alt=""
          fill
          className="object-cover mix-blend-screen"
          priority
        />
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#00696B]/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-40px] right-[-80px] w-[400px] h-[400px] bg-[#60D624]/5 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[-80px] w-[250px] h-[250px] bg-[#14B8A6]/5 rounded-full blur-[100px]" />
        </div>

        <Navbar />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 pt-28 sm:pt-36 pb-16 sm:pb-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
            <span className="text-sm font-normal tracking-widest text-[#14B8A6] uppercase">
              Learning Model
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[72px] font-normal text-white leading-[1.2] tracking-[-0.64px]" style={{ fontFamily: "Instrument Sans, sans-serif" }}>
            Learning that adapts to
            <br />
            every child
          </h1>
        </div>
      </section>

      {/* Alternating Content Sections */}
      {sections.map((section, index) => (
        <section key={index} className="py-4 lg:py-10 px-4 sm:px-6 lg:px-12 bg-[#F8FAFB] lg:bg-white">
          <div className="max-w-[1320px] mx-auto">
            {/* Label - only on first section, desktop only (above grid) */}
            {section.label && (
              <div className="hidden lg:flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
                <span className="text-xs font-normal tracking-widest text-[#6B7280] uppercase">
                  {section.label}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Text */}
              <div className={section.layout === "image-left" ? "order-2 lg:order-2" : "order-2 lg:order-1"}>
                {/* Label - mobile only (below image) */}
                {section.label && (
                  <div className="flex lg:hidden items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
                    <span className="text-[18px] font-normal tracking-[-0.48px] text-[#6B7280] uppercase leading-[1.2]">
                      {section.label}
                    </span>
                  </div>
                )}
                <h2 className="text-[20px] lg:text-[56px] leading-[1.2] lg:leading-[67.2px] text-[#111023] mb-4 whitespace-pre-line tracking-[-0.64px]" style={{ fontWeight: 400, fontFamily: "Instrument Sans, sans-serif" }}>
                  {section.title}
                </h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-[#606B68] mb-3 last:mb-0 text-[18px] leading-[1.5] tracking-[-0.48px]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Image */}
              <div className={section.layout === "image-left" ? "order-1 lg:order-1" : "order-1 lg:order-2"}>
                <div className="relative w-full lg:max-w-[480px] aspect-[4/3] rounded-2xl overflow-hidden lg:mx-auto">
                  <Image
                    src={section.image}
                    alt={section.imageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Banner */}
      <CTABanner />

      {/* Footer */}
      <Footer />
    </main>
  );
}
