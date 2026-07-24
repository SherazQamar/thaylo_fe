import Image from "next/image";

export default function HowPersonalizes() {
  return (
    <section className="bg-[#EBEEF2] px-4 sm:px-6 lg:px-[50px] py-12 lg:py-[75px] flex flex-col justify-center">
      <div className="max-w-[1340px] mx-auto w-full">
        <div className="flex items-center justify-center gap-[10px]">
          <span
            className="inline-block size-[10px] bg-[#00CED1]"
            style={{ borderRadius: "2px" }}
          />
          <span
            className="text-[18px] font-normal leading-[27px] tracking-[-0.48px] text-[#606B68]"
            style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
          >
            Personalized learning
          </span>
        </div>

        <h2
          className="text-[24px] leading-[32px] lg:text-[56px] lg:leading-[67.5px] font-normal text-center mt-3 mb-4 tracking-[-0.64px] text-[#111023] max-w-[327px] lg:max-w-[672px] mx-auto"
          style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
        >
          How THAYLO personalizes learning
        </h2>

        <p
          className="text-center text-[#606B68] max-w-[327px] lg:max-w-[738px] mx-auto mb-10 lg:mb-16 font-normal text-[16px] lg:text-[18px] leading-[27px] tracking-[-0.48px]"
          style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
        >
          THAYLO adjusts lessons in real time. If a child struggles, concepts
          are explained again in simpler ways. If a child is ready, new
          challenges are introduced naturally.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[35px] items-start">
          <div className="relative rounded-2xl overflow-hidden h-[280px] sm:h-[360px] lg:h-[521px] bg-white">
            <Image
              src="/assets/personalize learning.png"
              alt="Personalized learning"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:pt-1">
            <div>
              <div className="mb-5 w-[60px] h-[60px]">
                <Image
                  src="/assets/skill base.png"
                  alt=""
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] object-contain"
                />
              </div>
              <h3
                className="font-medium text-[#0C211D] mb-3 text-[26px] leading-[32px] tracking-[-0.64px]"
                style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
              >
                Skill based progression
              </h3>
              <p
                className="text-[#606B68] font-normal text-[16px] lg:text-[18px] leading-[27px] tracking-[-0.48px]"
                style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
              >
                Children move forward only when they understand a concept. This
                ensures strong foundations and avoids learning gaps that often
                appear later.
              </p>
            </div>

            <div className="mt-10 pt-10 border-t border-[#CBD5E1]">
              <div className="mb-5 w-[60px] h-[60px]">
                <Image
                  src="/assets/child.png"
                  alt=""
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] object-contain"
                />
              </div>
              <h3
                className="font-medium text-[#0C211D] mb-3 text-[26px] leading-[32px] tracking-[-0.64px]"
                style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
              >
                Child friendly AI guidance
              </h3>
              <p
                className="text-[#606B68] font-normal text-[16px] lg:text-[18px] leading-[27px] tracking-[-0.48px]"
                style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
              >
                THAYLO&apos;s AI tutor is designed for K-5 learners. It
                communicates in a warm, encouraging, and age-appropriate way
                that feels supportive rather than instructional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
