import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";
import foundedImage from "@/app/(landing-flow)/assets/founded-image.jpg";
import empowerImage from "@/app/(landing-flow)/assets/empower-image.png";
import teachingImage from "@/app/(landing-flow)/assets/teaching-image.png";

const milestones = [
  {
    year: "2020",
    title: "Founded Innovative AI Course For Beginners",
    image: foundedImage,
    highlight: false,
  },
  {
    year: "2023",
    title: "Empower Global Students Through AI",
    image: empowerImage,
    highlight: true,
  },
  {
    year: "2025",
    title: "Teaching AI to 10,000 Students Worldwide",
    image: teachingImage,
    highlight: false,
  },
];

export default function MilestonePath() {
  return (
    <section className="bg-[#F1F5F9] px-4 sm:px-6 lg:px-12 py-12 lg:py-24 flex flex-col justify-center">
      <div className="max-w-[1320px] mx-auto w-full">
        <SectionLabel text="MILESTONE PATH" />
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] font-normal text-center mt-3 mb-8 lg:mb-16 max-w-3xl mx-auto leading-tight text-[#1A2B3D]">
          A Journey of Knowledge
          <br />
          Driving Real Growth
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-[280px] sm:max-w-none mx-auto sm:mx-0">
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
                  className="text-[18px] leading-[27px] tracking-[-0.48px] font-normal mb-2 text-[#606B68]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {milestone.year}
                </p>
                <h3
                  className={`text-[20px] sm:text-[26px] font-medium leading-[1.2] sm:leading-[31.2px] tracking-[-0.64px] ${
                    milestone.highlight ? "text-white" : "text-[#111023]"
                  }`}
                >
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
  );
}
