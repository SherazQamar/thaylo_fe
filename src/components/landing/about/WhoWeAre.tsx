import Image from "next/image";
import Button from "@/components/ui/Button";

const stats = [
  { value: "2k+", label: "Placed Students" },
  { value: "250+", label: "Partner Companies" },
  { value: "98%", label: "Success Rate" },
  { value: "30+", label: "Top Universities" },
];

export default function WhoWeAre() {
  return (
    <section className="snap-section bg-white px-4 sm:px-6 lg:px-12 py-12 lg:py-24 flex flex-col justify-center">
      <div className="max-w-[1320px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="hidden md:block relative rounded-2xl overflow-hidden min-h-[320px] lg:min-h-[420px] bg-[#F1F5F9]">
            <Image
              src="/assets/Human robot handshake.png"
              alt="Human robot handshake"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
              <span
                className="text-[14px] md:text-[18px] font-normal uppercase tracking-[-0.48px] text-[#606B68] leading-[27px]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                WHO WE ARE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[56px] font-normal leading-[1.2] tracking-[-0.64px] text-[#1A2B3D]">
              Journey Across the
              <br />
              Start of Our Vision
            </h2>
            <p
              className="text-[#6B7280] text-sm sm:text-base lg:text-lg leading-[24px] sm:leading-[27px] tracking-[-0.48px] font-normal"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Thaylo is a U.S.-based learning program designed to function as a
              flexible, personalized, full-course alternative to traditional
              schooling—delivering mastery-based instruction through an AI
              Instructor with human oversight, beginning with a Grade 4 English
              Language Arts pilot and expanding by subject and grade level into a
              complete academic program.
            </p>
            <div className="flex justify-center md:justify-start">
              <Button
                variant="primary"
                className="!rounded-xl text-sm px-6 py-3"
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 mt-12 lg:mt-20">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`text-center md:text-left px-0 lg:px-8 ${
                idx > 0 ? "lg:border-l lg:border-[#E2E8F0]" : ""
              }`}
            >
              <p className="text-[36px] sm:text-[48px] lg:text-[62.53px] font-normal text-[#111023] mb-2 leading-[1.2] tracking-[-0.71px]">
                {stat.value}
              </p>
              <p
                className="text-[14px] sm:text-[16px] lg:text-[20px] text-[#606B68] font-normal leading-[1.5] tracking-[-0.54px]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
