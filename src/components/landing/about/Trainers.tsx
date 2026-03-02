import Button from "@/components/ui/Button";

const trainers = [
  {
    name: "Prof. David Lee",
    title: "Monitor student progress and engagement",
    gradient: "from-sky-400 to-indigo-500",
  },
  {
    name: "Dr. Sarah Johnson",
    title: "Step in when learning slows or stalls",
    gradient: "from-rose-400 to-pink-500",
  },
  {
    name: "Prof. Robert Chen",
    title: "Review concerns raised through the platform",
    gradient: "from-emerald-400 to-teal-500",
  },
];

export default function Trainers() {
  return (
    <section className="snap-section bg-white px-4 sm:px-6 lg:px-12 py-12 lg:py-24 flex flex-col justify-center">
      <div className="max-w-[1320px] mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
          <span className="text-sm font-normal tracking-widest text-[#14B8A6] uppercase">
            TRAINERS
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-3 mb-8 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] font-normal leading-tight text-[#1A2B3D]">
            Educators Behind Thaylo
          </h2>
          <Button
            variant="dark"
            className="!rounded-xl text-sm px-6 py-3 self-start md:self-auto"
          >
            Explore More
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {trainers.map((trainer, idx) => (
            <div
              key={`${trainer.name}-${idx}`}
              className="rounded-2xl overflow-hidden"
            >
              <div className="relative h-[220px] sm:h-[280px] lg:h-[360px] bg-[#E8F4F2]">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${trainer.gradient} opacity-20`}
                />
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
                <h3 className="text-[22px] sm:text-[29.03px] font-medium text-[#111023] leading-[1.2] sm:leading-[34.84px] tracking-[-0.54px]">
                  {trainer.name}
                </h3>
                <p
                  className="text-[16px] sm:text-[20.1px] text-[#606B68] font-normal leading-[1.5] sm:leading-[30.15px] tracking-[-0.54px]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {trainer.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
