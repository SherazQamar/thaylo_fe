import React from "react";
import Button from "@/components/ui/Button";

const courses = [
  {
    title: "Grade 4 ELA",
    instructor: "Dr. Emily Carter",
    lessons: 12,
    duration: "10h 55m",
    rating: 4.9,
    color: "from-amber-200 to-amber-400",
  },
  {
    title: "Grade 3 Math",
    instructor: "Dr. Emily Carter",
    lessons: 12,
    duration: "10h 55m",
    rating: 4.9,
    color: "from-rose-200 to-rose-400",
  },
  {
    title: "Grade 5 Science",
    instructor: "Dr. Emily Carter",
    lessons: 12,
    duration: "10h 55m",
    rating: 4.9,
    color: "from-emerald-200 to-emerald-400",
  },
];

export default function CoursePilot() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-16 bg-[#F1F5F9] flex flex-col justify-center rounded-4xl">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
              <span className="text-xs font-normal tracking-widest text-[#14B8A6] uppercase">FEATURED CLASS</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-normal text-[#1A2B3D]">
              Grade 4 English Language Arts Pilot
            </h2>
          </div>
          <Button variant="dark" className="hidden sm:inline-flex rounded-xl px-8 py-3.5 font-medium">
            More Courses
          </Button>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
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
  color,
}: {
  title: string;
  instructor: string;
  lessons: number;
  duration: string;
  rating: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-[15px] shadow hover:shadow-lg transition-shadow border border-gray-100 p-3">
      {/* Image placeholder */}
      <div
        className={`h-56 bg-gradient-to-br ${color} relative flex items-center justify-center rounded-[10px] overflow-hidden`}
      >
        <span className="text-white/60 text-xs">Course Image</span>
      </div>

      <div className="pt-5 px-2 pb-1">
        <h3 className="text-xl font-medium text-[#1A2B3D] mb-1">{title}</h3>
        <p className="text-sm text-[#6B7280] mb-5">{instructor}</p>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-[#6B7280] mb-4">
          <div className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
            </svg>
            <span>{lessons} Lessons</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{duration}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="1.5"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>{rating}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <button className="w-full py-3.5 rounded-xl border border-[#1A2B3D]/80 text-[#1A2B3D] text-sm font-normal hover:bg-gray-50 transition-colors cursor-pointer">
            View Module
          </button>
        </div>
      </div>
    </div>
  );
}
