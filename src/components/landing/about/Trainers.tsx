import Image from "next/image";
import Link from "next/link";

const trainers = [
  {
    name: "Prof. David Lee",
    titleDesktop: "Monitor student progress and engagement",
    titleMobile: "ML Specialist",
    image: "/assets/david.png",
  },
  {
    name: "Dr. Sarah Johnson",
    titleDesktop: "Step in when learning slows or stalls",
    titleMobile: "Vision Analyst",
    image: "/assets/sara.png",
  },
  {
    name: "Prof. Robert Chen",
    titleDesktop: "Review concerns raised through the platform",
    titleMobile: "AI Engineer",
    image: "/assets/robert.png",
  },
];

export default function Trainers() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-[53px] pt-10 pb-12 lg:py-24 flex flex-col justify-center">
      <div className="max-w-[1340px] mx-auto w-full">
        <div className="flex items-center gap-[10px]">
          <span
            className="inline-block size-[10px] bg-[#00CED1]"
            style={{ borderRadius: "2px" }}
          />
          <span
            className="text-[18px] font-normal uppercase tracking-[-0.48px] text-[#606B68] leading-[27px]"
            style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
          >
            trainers
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 mt-3 mb-8 lg:mb-14">
          <h2
            className="text-[24px] leading-[32px] sm:text-[32px] lg:text-[40px] lg:leading-[48px] font-normal tracking-[-0.64px] text-[#0C211D] max-w-[280px] sm:max-w-none"
            style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
          >
            {/* Mobile vs desktop titles differ in Figma */}
            <span className="lg:hidden">Meet Our Expert Trainers Today Online</span>
            <span className="hidden lg:inline">Educators Behind Thaylo</span>
          </h2>

          {/* Explore More — desktop / web only */}
          <Link
            href="/about"
            className="hidden lg:inline-flex items-center justify-center h-[48px] px-8 text-[15px] font-normal text-white bg-[#111023] hover:bg-[#1a1938] transition-colors shrink-0"
            style={{
              borderRadius: "12px",
              fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif",
            }}
          >
            Explore More
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5 lg:gap-6">
          {trainers.map((trainer) => (
            <div key={trainer.name} className="overflow-hidden">
              <div className="relative h-[360px] sm:h-[400px] lg:h-[440px] bg-[#E8F4F2] rounded-[16px] overflow-hidden">
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="pt-4 pb-1">
                <h3
                  className="text-[22px] sm:text-[29px] font-medium text-[#111023] leading-[1.2] sm:leading-[35px] tracking-[-0.54px]"
                  style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
                >
                  {trainer.name}
                </h3>
                <p
                  className="text-[16px] sm:text-[20px] text-[#606B68] font-normal leading-[24px] sm:leading-[30px] tracking-[-0.54px] mt-1"
                  style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
                >
                  <span className="lg:hidden">{trainer.titleMobile}</span>
                  <span className="hidden lg:inline">{trainer.titleDesktop}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
