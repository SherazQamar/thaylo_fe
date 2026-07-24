import React from "react";
import Image from "next/image";

const courses = [
  {
    title: "Grade 4 ELA",
    instructor: "Dr. Emily Carter",
    lessons: 12,
    duration: "10h 55m",
    rating: 4.9,
    image: "/assets/Grade-4-ELA.png",
  },
  {
    title: "Grade 3 Math",
    instructor: "Dr. Emily Carter",
    lessons: 12,
    duration: "10h 55m",
    rating: 4.9,
    image: "/assets/Grade-3-Math.png",
  },
  {
    title: "Grade 5 Science",
    instructor: "Dr. Emily Carter",
    lessons: 12,
    duration: "10h 55m",
    rating: 4.9,
    image: "/assets/Grade-5-Science.png",
  },
];

export default function CoursePilot() {
  return (
    <section className="py-10 sm:py-12 px-4 sm:px-6 lg:px-16 bg-[#F1F5F9] flex flex-col justify-center rounded-[24px] lg:rounded-[32px] mx-4 sm:mx-0">
      <div className="w-full max-w-[1340px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
          <div>
            <p
              className="flex items-center gap-2 mb-2"
              style={{
                fontFamily: "Inter, var(--font-inter), sans-serif",
                fontSize: "14px",
                lineHeight: "27px",
                letterSpacing: "-0.32px",
                color: "#606B68",
                textTransform: "uppercase",
              }}
            >
              <span className="inline-block size-[10px] bg-[#00CED1]" style={{ borderRadius: "2px" }} />
              Featured Class
            </p>
            <h2
              className="font-normal text-[#0C211D] text-[24px] leading-[32px] sm:text-[40px] sm:leading-[48px] lg:text-[56px] lg:leading-[67.2px] tracking-[-0.64px]"
              style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
            >
              Grade 4 English Language Arts Pilot
            </h2>
          </div>
          <button
            className="hidden sm:inline-flex font-normal text-white bg-[#0C211D] border border-[#0C211D] hover:opacity-90 transition-all duration-300 cursor-pointer"
            style={{ borderRadius: "10px", padding: "15px 45px", fontSize: "16px" }}
          >
            More Courses
          </button>
        </div>

        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-5">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseCard({
  title,
  instructor,
  lessons,
  duration,
  rating,
  image,
}: {
  title: string;
  instructor: string;
  lessons: number;
  duration: string;
  rating: number;
  image: string;
}) {
  return (
    <div className="bg-white rounded-[15px] shadow-[0_4px_20px_rgba(12,33,29,0.06)] border border-gray-100/80 p-3 flex flex-col">
      {/* Figma mobile thumb ~279×313; desktop ~407×313 */}
      <div className="relative rounded-[10px] overflow-hidden aspect-[279/313] sm:aspect-[4/3] lg:h-[313px] lg:aspect-auto">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="pt-6 sm:pt-5 px-0 sm:px-2 pb-1 flex flex-col flex-1">
        <h3
          className="font-medium text-[#0C211D] mb-1 text-[24px] leading-[32px] lg:text-[26px] lg:leading-[31.2px] tracking-[-0.48px]"
          style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="font-normal text-[#606B68] mb-5 text-[16px] leading-[27px] lg:text-[18px] tracking-[-0.48px]"
          style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
        >
          {instructor}
        </p>

        {/* Meta row — full-width, evenly spaced like Figma */}
        <div className="flex items-center justify-between w-full mb-5 text-[#0C211D]">
          <div
            className="flex items-center gap-[5px] whitespace-nowrap text-[14px] sm:text-[15px] lg:text-[16px] leading-[18px] tracking-[-0.48px]"
            style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
          >
            <MetaNotesIcon />
            <span>
              {lessons} Lessons
            </span>
          </div>

          <span className="w-px h-5 bg-[#CBD5E1] flex-shrink-0 mx-1 sm:mx-2" aria-hidden />

          <div
            className="flex items-center gap-[5px] whitespace-nowrap text-[14px] sm:text-[15px] lg:text-[16px] leading-[18px] tracking-[-0.48px]"
            style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
          >
            <MetaClockIcon />
            <span>{duration}</span>
          </div>

          <span className="w-px h-5 bg-[#CBD5E1] flex-shrink-0 mx-1 sm:mx-2" aria-hidden />

          <div
            className="flex items-center gap-[5px] whitespace-nowrap text-[14px] sm:text-[15px] lg:text-[16px] leading-[18px] tracking-[-0.48px]"
            style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
          >
            <MetaStarIcon />
            <span>{rating}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-auto">
          <button
            className="w-full py-[11px] rounded-xl border border-[#0C211D] text-[#0C211D] hover:bg-gray-50 transition-colors cursor-pointer"
            style={{
              fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif",
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: "22px",
              letterSpacing: "-0.48px",
            }}
          >
            View Module
          </button>
        </div>
      </div>
    </div>
  );
}

function MetaNotesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function MetaClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function MetaStarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
