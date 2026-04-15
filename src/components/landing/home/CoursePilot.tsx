import React from "react";
import Image from "next/image";


const courses = [
  {
    title: "Grade 4 ELA",
    mobileClassTitle: "Grade 4 English Language Arts I",
    instructor: "Dr. Emily Carter",
    lessons: 12,
    duration: "10h 55m",
    rating: 4.9,
    image: "/assets/Grade-4-ELA.png",
  },
  {
    title: "Grade 3 Math",
    mobileClassTitle: "Grade 3 Mathematics I",
    instructor: "Dr. Emily Carter",
    lessons: 12,
    duration: "10h 55m",
    rating: 4.9,
    image: "/assets/Grade-3-Math.png",
  },
  {
    title: "Grade 5 Science",
    mobileClassTitle: "Grade 5 Science I",
    instructor: "Dr. Emily Carter",
    lessons: 12,
    duration: "10h 55m",
    rating: 4.9,
    image: "/assets/Grade-5-Science.png",
  },
];

export default function CoursePilot() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-16 bg-[#F1F5F9] flex flex-col justify-center rounded-4xl">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
          <div>
  
            <h2 className="hidden sm:block font-normal text-[#0C211D]" style={{ fontSize: "56px", lineHeight: "67.2px", letterSpacing: "-0.64px" }}>
              Grade 4 English Language Arts Pilot
            </h2>
          </div>
          <button className="hidden sm:inline-flex font-normal text-white bg-[#0C211D] border border-[#0C211D] hover:opacity-90 transition-all duration-300 cursor-pointer" style={{ borderRadius: "10px", padding: "15px 45px", fontSize: "16px" }}>
            More Courses
          </button>
        </div>

        {/* Course Cards */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
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
  mobileClassTitle,
}: {
  title: string;
  mobileClassTitle: string;
  instructor: string;
  lessons: number;
  duration: string;
  rating: number;
  image: string;
}) {
  return (
    <div className="bg-white rounded-[15px] shadow hover:shadow-lg transition-shadow border border-gray-100 p-3">
      {/* Mobile class header */}
      <div className="sm:hidden px-2 pt-1 pb-3">
        <p className="text-[#606B68] uppercase tracking-wide mb-2" style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", lineHeight: "12px" }}>
          <span className="inline-block w-2 h-2 rounded-[2px] bg-[#14B8A6] mr-2 align-middle" />
          Featured Class
        </p>
        <p className="text-[#0C211D] truncate" style={{ fontSize: "18px", lineHeight: "21.6px", letterSpacing: "-0.48px" }}>
          {mobileClassTitle}
        </p>
      </div>

      {/* Course image */}
      <div className="h-56 relative rounded-[10px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="pt-5 px-2 pb-1">
        <h3 className="font-medium text-[#0C211D] mb-1" style={{ fontSize: "26px", lineHeight: "31.2px", letterSpacing: "-0.48px" }}>{title}</h3>
        <p className="font-normal text-[#606B68] mb-5" style={{ fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>{instructor}</p>

        {/* Meta info */}
        <div className="flex items-center mb-4" style={{ fontSize: "18px", lineHeight: "18px", letterSpacing: "-0.48px" }}>
          <div className="flex items-center gap-1.5 pr-3 border-r border-gray-300 text-[#0C211D]" style={{ fontFamily: "Inter, sans-serif" }}>
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
          <div className="flex items-center gap-1.5 px-3 border-r border-gray-300 text-[#0C211D]" style={{ fontFamily: "Inter, sans-serif" }}>
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
          <div className="flex items-center gap-1.5 pl-3 text-[#0C211D]" style={{ fontFamily: "Inter, sans-serif" }}>
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
