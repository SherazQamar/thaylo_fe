import React from "react";


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
  
            <h2 className="font-normal text-[#0C211D]" style={{ fontSize: "56px", lineHeight: "67.2px", letterSpacing: "-0.64px" }}>
              Grade 4 English Language Arts Pilot
            </h2>
          </div>
          <button className="hidden sm:inline-flex font-normal text-white bg-[#0C211D] border border-[#0C211D] hover:opacity-90 transition-all duration-300 cursor-pointer" style={{ borderRadius: "10px", padding: "15px 45px", fontSize: "16px" }}>
            More Courses
          </button>
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
        <h3 className="font-medium text-[#0C211D] mb-1" style={{ fontSize: "26px", lineHeight: "31.2px", letterSpacing: "-0.48px" }}>{title}</h3>
        <p className="font-normal text-[#606B68] mb-5" style={{ fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>{instructor}</p>

        {/* Meta info */}
        <div className="flex items-center gap-3 mb-4" style={{ fontSize: "18px", lineHeight: "18px", letterSpacing: "-0.48px" }}>
          <div className="flex items-center gap-1.5 text-[#0C211D]" style={{ fontFamily: "Inter, sans-serif" }}>
            <svg
              width="16"
              height="16"
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
          <div className="flex items-center gap-1.5 text-[#0C211D]" style={{ fontFamily: "Inter, sans-serif" }}>
            <svg
              width="16"
              height="16"
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
          <div className="flex items-center gap-1.5 text-[#0C211D]" style={{ fontFamily: "Inter, sans-serif" }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0C211D"
              strokeWidth="1.5"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>{rating}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <button
            className="w-full py-3.5 rounded-xl border border-[#1A2B3D]/80 text-[#1A2B3D] hover:bg-gray-50 transition-colors cursor-pointer capitalize"
            style={{ fontFamily: "Instrument Sans, sans-serif", fontWeight: 500, fontSize: "18px", lineHeight: "21.6px", letterSpacing: "-0.48px" }}
          >
            View Module
          </button>
        </div>
      </div>
    </div>
  );
}
