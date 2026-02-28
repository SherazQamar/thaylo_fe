import Image from "next/image";
import Navbar from "@/components/landing/Navbar";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

/* ---------- data ---------- */

const stats = [
  { value: "2k+", label: "Placed Students" },
  { value: "250+", label: "Partner Companies" },
  { value: "98%", label: "Success Rate" },
  { value: "30+", label: "Top Universities" },
];

const milestones = [
  {
    year: "2020",
    title: "Founded Innovative AI Course For Beginners",
    image: "/assets/our-story-classroom.png",
    bg: "bg-gradient-to-br from-[#94A3B8] to-[#64748B]",
  },
  {
    year: "2023",
    title: "Empower Global Students Through AI",
    image: "/assets/four-diverse-young-adults.png",
    bg: "bg-gradient-to-br from-[#14B8A6] to-[#0D7377]",
    highlight: true,
  },
  {
    year: "2025",
    title: "Teaching AI to 10,000 Students Worldwide",
    image: "/assets/container-hero.png",
    bg: "bg-gradient-to-br from-[#94A3B8] to-[#64748B]",
  },
];

const principles = [
  {
    number: "01",
    title: "Understanding matters more than speed",
    description:
      "Learning should move forward when students truly understand, not when a schedule demands it.",
  },
  {
    number: "02",
    title: "Flexibility and rigor must coexist",
    description:
      "Students deserve learning experiences that adapt to real life while maintaining clear academic standards.",
  },
  {
    number: "03",
    title: "Focus is essential for learning",
    description:
      "Thoughtful learning environments reduce unnecessary distractions so students can concentrate.",
  },
  {
    number: "04",
    title: "Technology should support, not dominate",
    description:
      "Tools are used intentionally to enhance instruction, not to remove responsibility or human judgment.",
  },
  {
    number: "05",
    title: "Adults remain accountable",
    description:
      "Educators are ultimately responsible for oversight, decisions, and partnership with families.",
  },
];

const trainers = [
  {
    name: "Prof. David Lee",
    title: "ML Specialist",
    gradient: "from-sky-400 to-indigo-500",
  },
  {
    name: "Dr. Sarah Johnson",
    title: "Vision Analyst",
    gradient: "from-rose-400 to-pink-500",
  },
  {
    name: "Prof. Robert Chen",
    title: "AI Engineer",
    gradient: "from-emerald-400 to-teal-500",
  },
];

/* ---------- page ---------- */

export default function AboutPage() {
  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="snap-section relative min-h-[60vh] lg:min-h-[70vh] bg-[#0B1D2E] overflow-hidden flex flex-col">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#00696B]/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-50px] right-[-100px] w-[500px] h-[500px] bg-[#60D624]/5 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[-100px] w-[300px] h-[300px] bg-[#14B8A6]/5 rounded-full blur-[100px]" />
        </div>

        <Navbar />

        {/* Centered Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-3xl">
            <SectionLabel text="ABOUT US" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-normal text-white leading-[1.15] tracking-[-0.64px] mt-5">
              Driven by Knowledge
              <br />
              Focused on You
            </h1>
          </div>
        </div>
      </section>

      {/* ===== WHO WE ARE / JOURNEY ===== */}
      <section className="snap-section bg-white px-6 lg:px-12 py-16 lg:py-24 flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden min-h-[320px] lg:min-h-[420px]">
              <Image
                src="/assets/our-story-classroom.png"
                alt="AI and human collaboration"
                fill
                className="object-cover"
              />
            </div>

            {/* Text */}
            <div className="space-y-6">
              <SectionLabel text="WHO WE ARE" className="justify-start" />
              <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-normal leading-tight text-[#1A2B3D]">
                Journey Across the
                <br />
                Start of Our Vision
              </h2>
              <p className="text-[#6B7280] text-sm lg:text-base leading-relaxed">
                Future talent begins here as you master industry-ready AI skills
                designed to help you grow faster than the market, empowering real
                innovation through practical, career-focused learning
                experiences.
              </p>
              <Button variant="teal" className="text-sm px-6 py-3">
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-white border-t border-[#E2E8F0]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-0">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`text-left px-0 lg:px-8 ${
                  idx > 0 ? "lg:border-l lg:border-[#E2E8F0]" : ""
                }`}
              >
                <p className="text-3xl lg:text-5xl font-medium text-[#1A2B3D] mb-2">
                  {stat.value}
                </p>
                <p className="text-sm lg:text-base text-[#6B7280] font-normal">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MILESTONE PATH ===== */}
      <section className="snap-section bg-[#F1F5F9] px-6 lg:px-12 py-16 lg:py-24 flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto w-full">
          <SectionLabel text="MILESTONE PATH" />
          <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-normal text-center mt-3 mb-12 lg:mb-16 max-w-3xl mx-auto leading-tight text-[#1A2B3D]">
            A Journey of Knowledge
            <br />
            Driving Real Growth
          </h2>

          <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
            {milestones.map((milestone) => (
              <div
                key={milestone.year}
                className={`rounded-2xl overflow-hidden ${
                  milestone.highlight
                    ? "bg-[#0B1D2E] text-white"
                    : "bg-white text-[#1A2B3D]"
                }`}
              >
                <div className="p-5 lg:p-6">
                  <p
                    className={`text-sm mb-2 ${
                      milestone.highlight
                        ? "text-[#14B8A6]"
                        : "text-[#6B7280]"
                    }`}
                  >
                    {milestone.year}
                  </p>
                  <h3 className="text-base lg:text-lg font-medium leading-snug">
                    {milestone.title}
                  </h3>
                </div>
                <div className="relative h-[180px] lg:h-[220px]">
                  <Image
                    src={milestone.image}
                    alt={milestone.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ETHICAL STANDARDS / GUIDING PRINCIPLES ===== */}
      <section className="snap-section relative bg-[#0B1D2E] px-6 lg:px-12 py-16 lg:py-24 flex flex-col justify-center overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#00696B]/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-50px] right-[-100px] w-[400px] h-[400px] bg-[#60D624]/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-[1320px] mx-auto w-full">
          <SectionLabel text="ETHICAL STANDARDS" />
          <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-normal text-center mt-3 mb-4 max-w-3xl mx-auto leading-tight text-white">
            Our Guiding Principles
          </h2>
          <p className="text-white/60 text-sm lg:text-base leading-relaxed text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            Thaylo is guided by a clear set of educational principles rooted in
            responsibility, structure, and respect for how students learn. Every
            decision—from pacing to technology use—is shaped by the belief that
            flexibility should support learning, not replace expectations.
          </p>

          {/* Principles grid: 1 + 2 + 2 layout */}
          <div className="space-y-4 lg:space-y-6">
            {/* Row 1 - Full width card */}
            <div className="bg-[#1A1A2E]/60 border border-white/10 rounded-2xl p-6 lg:p-8">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-5">
                <span className="text-white text-sm font-medium">
                  {principles[0].number}
                </span>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-white mb-3">
                {principles[0].title}
              </h3>
              <p className="text-sm lg:text-base text-white/60 leading-relaxed max-w-xl">
                {principles[0].description}
              </p>
            </div>

            {/* Row 2 - Two cards */}
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
              {principles.slice(1, 3).map((item) => (
                <div
                  key={item.number}
                  className="bg-[#1A1A2E]/60 border border-white/10 rounded-2xl p-6 lg:p-8"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-5">
                    <span className="text-white text-sm font-medium">
                      {item.number}
                    </span>
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm lg:text-base text-white/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Row 3 - Two cards */}
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
              {principles.slice(3, 5).map((item) => (
                <div
                  key={item.number}
                  className="bg-[#1A1A2E]/60 border border-white/10 rounded-2xl p-6 lg:p-8"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-5">
                    <span className="text-white text-sm font-medium">
                      {item.number}
                    </span>
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm lg:text-base text-white/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-heading below cards */}
          <h3 className="text-2xl md:text-3xl lg:text-[2.5rem] font-normal text-center mt-16 lg:mt-20 text-white leading-tight">
            Shaped by Skills,
            <br />
            Guided by Purpose
          </h3>
        </div>
      </section>

      {/* ===== TRAINERS ===== */}
      <section className="snap-section bg-white px-6 lg:px-12 py-16 lg:py-24 flex flex-col justify-center">
        <div className="max-w-[1320px] mx-auto w-full">
          <SectionLabel text="TRAINERS" className="justify-start" />

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-3 mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-normal leading-tight text-[#1A2B3D]">
              Meet Our Expert Trainers
              <br />
              Today Online
            </h2>
            <Button variant="dark" className="text-sm px-6 py-3 self-start md:self-auto">
              Explore More
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {trainers.map((trainer, idx) => (
              <div
                key={`${trainer.name}-${idx}`}
                className="rounded-2xl overflow-hidden"
              >
                {/* Avatar placeholder with gradient */}
                <div className="relative h-[280px] lg:h-[360px] bg-[#E8F4F2]">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${trainer.gradient} opacity-20`}
                  />
                  {/* Silhouette */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      width="120"
                      height="120"
                      viewBox="0 0 24 24"
                      fill="#94A3B8"
                      opacity="0.4"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>
                <div className="pt-4 pb-2">
                  <h3 className="text-base lg:text-lg font-medium text-[#1A2B3D] mb-1">
                    {trainer.name}
                  </h3>
                  <p className="text-sm text-[#6B7280] font-normal">
                    {trainer.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <CTABanner />

      {/* ===== FOOTER ===== */}
      <Footer />
    </main>
  );
}
