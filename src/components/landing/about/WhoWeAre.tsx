import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

const stats = [
  { value: "2k+", labelDesktop: "Placed Students", labelMobile: "Placed Students" },
  { value: "250+", labelDesktop: "Partner Companies", labelMobile: "Partner Companies" },
  { value: "98%", labelDesktop: "Success Rate", labelMobile: "Success rate" },
  { value: "30+", labelDesktop: "Top Universities", labelMobile: "Top Universities" },
];

export default function WhoWeAre() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-[50px] py-12 lg:pt-16 lg:pb-12 flex flex-col justify-center">
      <div className="max-w-[1340px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-6 items-center">
          <div className="relative rounded-2xl overflow-hidden h-[234px] lg:h-[467px] bg-[#F1F5F9]">
            <Image
              src="/assets/Human robot handshake.png"
              alt="Human robot handshake"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          <div className="space-y-0 text-center lg:text-left lg:pl-3">
            <div className="flex items-center gap-[10px] justify-center lg:justify-start mb-[19px]">
              <span
                className="inline-block size-[10px] bg-[#00CED1]"
                style={{ borderRadius: "2px" }}
              />
              <span
                className="text-[18px] font-normal uppercase tracking-[-0.48px] text-[#606B68] leading-[27px]"
                style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
              >
                who we are
              </span>
            </div>

            <h2
              className="text-[24px] leading-[32px] lg:text-[56px] lg:leading-[67.5px] font-normal tracking-[-0.64px] text-[#0C211D] mb-5 lg:mb-6 max-w-[327px] lg:max-w-[480px] mx-auto lg:mx-0"
              style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
            >
              Journey Across the Start of Our Vision
            </h2>

            <p
              className="text-[#606B68] text-[16px] leading-[27px] lg:text-[18px] lg:leading-[27px] tracking-[-0.48px] font-normal mb-8 lg:mb-10 max-w-[327px] lg:max-w-[664px] mx-auto lg:mx-0"
              style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
            >
              Thaylo is a U.S.-based learning program designed to function as a
              flexible, personalized, full-course alternative to traditional
              schooling—delivering mastery-based instruction through an AI
              Instructor with human oversight, beginning with a Grade 4 English
              Language Arts pilot and expanding by subject and grade level into a
              complete academic program.
            </p>

            <div className="flex justify-center lg:justify-start">
              <Link
                href="/parent-register"
                className="inline-flex items-center justify-center h-[53px] min-w-[161px] px-10 text-[16px] font-normal text-white bg-gradient-to-r from-[#60D624] to-[#00696B] hover:opacity-90 transition-all"
                style={{
                  borderRadius: "12px",
                  fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif",
                }}
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 lg:mt-16">
          <div className="lg:hidden flex flex-col">
            {stats.map((stat, idx) => (
              <div
                key={stat.labelDesktop}
                className={`text-center py-8 ${
                  idx > 0 ? "border-t border-[#E2E8F0]" : ""
                }`}
              >
                <p
                  className="text-[68px] font-normal text-[#111023] leading-[76px] tracking-[-0.71px]"
                  style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
                >
                  {stat.value}
                </p>
                <p
                  className="mt-[11px] text-[20px] text-[#606B68] font-normal leading-[31px] tracking-[-0.54px]"
                  style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
                >
                  {stat.labelMobile}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop — left-aligned values, 117px rules between columns (Figma SS) */}
          <div className="hidden lg:flex w-full items-center">
            {stats.map((stat, idx) => (
              <Fragment key={stat.labelDesktop}>
                {idx > 0 && (
                  <div className="w-px h-[117px] bg-[#E2E8F0] shrink-0" aria-hidden />
                )}
                <div className={`flex-1 min-w-0 ${idx > 0 ? "pl-12" : "pl-0"}`}>
                  <p
                    className="text-[62.5px] font-normal text-[#111023] leading-[76px] tracking-[-0.71px]"
                    style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="mt-[11px] text-[20px] text-[#606B68] font-normal leading-[31px] tracking-[-0.54px]"
                    style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
                  >
                    {stat.labelDesktop}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
