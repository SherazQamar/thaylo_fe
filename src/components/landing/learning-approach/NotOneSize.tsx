import Image from "next/image";

export default function NotOneSize() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-[50px] py-12 lg:py-16 flex flex-col justify-center">
      <div className="max-w-[1340px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[595fr_700fr] gap-6 lg:gap-[45px] items-center">
          {/* Figma: Human robot handshake */}
          <div className="relative rounded-2xl overflow-hidden h-[291px] lg:h-[400px] bg-[#F1F5F9]">
            <Image
              src="/assets/Human robot handshake.png"
              alt="Learning approach"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-[10px] mb-[19px]">
              <span
                className="inline-block size-[10px] bg-[#00CED1]"
                style={{ borderRadius: "2px" }}
              />
              <span
                className="text-[18px] font-normal uppercase tracking-[-0.48px] text-[#606B68] leading-[27px]"
                style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
              >
                who we are
              </span>
            </div>

            {/* Desktop 461×135 (2 lines @56); mobile 327×32 (1 line @24) */}
            <h2
              className="text-[24px] leading-[32px] lg:text-[56px] lg:leading-[67.5px] font-normal tracking-[-0.64px] text-[#111023] mb-5 lg:mb-6 max-w-[327px] lg:max-w-[461px]"
              style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
            >
              Learning is not one size fits all
            </h2>

            <p
              className="text-[#606B68] text-[16px] leading-[27px] lg:text-[18px] lg:leading-[27px] tracking-[-0.48px] font-normal max-w-[327px] lg:max-w-[700px]"
              style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
            >
              Every child learns in a different way. Some children need more
              time. Some learn faster with visuals. Others understand better
              through practice and repetition. Traditional learning methods
              often move at a fixed pace, which can make children feel
              pressured, bored, or left behind.
            </p>
            {/* Join Now exists in Figma but is hidden on web + mobile */}
          </div>
        </div>
      </div>
    </section>
  );
}
