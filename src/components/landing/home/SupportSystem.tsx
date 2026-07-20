import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";

export default function SupportSystem() {
  return (
    <section id="learning-model" className="pt-20 lg:pt-28 pb-12 px-4 sm:px-6 lg:px-12 bg-white flex flex-col justify-center">
      <div className="max-w-[1320px] mx-auto">
        <SectionLabel text="WHY US" />
        <h2 className="text-[20px] sm:text-2xl md:text-4xl lg:text-5xl font-medium text-center mt-4 mb-10 sm:mb-16 leading-[1.2] tracking-[-0.64px] text-[#1A2B3D]">
          <span className="block">The Thaylo Learning Support</span>
          <span className="block">System</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left Column */}
          <div className="space-y-8 lg:space-y-12">
            {/* AI Instructor */}
            <div className="text-left">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-0">
                <Image src="/assets/certificate-symbol.png" alt="AI Instructor" width={28} height={28} className="w-12 h-12 object-contain" />
              </div>
              <h3 className="font-medium text-[#0C211D] mb-2 text-[26px] leading-[31.2px] tracking-[-0.64px]">
                AI Instructor
              </h3>
              <p className="text-[#606B68] font-normal text-[18px] leading-[27px] tracking-[-0.48px]" style={{ fontFamily: "Inter, sans-serif" }}>
                A personalized, human-appearing AI Instructor delivers
                structured lessons aligned to mastery-based expectations.
                Students have some choice in selecting the Instructor&apos;s
                appearance while instruction remains grounded in human pedagogy
                and curriculum.
              </p>
            </div>

            {/* Calyx */}
            <div className="pt-4 border-t border-gray-100 text-left">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-0">
                <Image src="/assets/handshake-symbol.png" alt="Bloom Buddy" width={28} height={28} className="w-12 h-12 object-contain" />
              </div>
              <h3 className="font-medium text-[#0C211D] mb-2 text-[26px] leading-[31.2px] tracking-[-0.64px]">
                Calyx, Your Bloom Buddy
              </h3>
              <p className="text-[#606B68] font-normal text-[18px] leading-[27px] tracking-[-0.48px]" style={{ fontFamily: "Inter, sans-serif" }}>
                Calyx supports focus and reflection through simple check-ins
                that help students notice how they&apos;re feeling so they can
                fully engage with learning.
              </p>
            </div>
          </div>

          {/* Center - Character */}
          <div className="hidden lg:flex justify-center items-center order-first lg:order-none">
            <Image
              src="/assets/new-learning-support.png"
              alt="Thaylo Character"
              width={400}
              height={450}
              className="w-[200px] sm:w-[240px] lg:w-[340px] h-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* Right Column */}
          <div className="text-left lg:text-right">
            <div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-0 lg:ml-auto lg:mr-0">
                <Image src="/assets/wayfinder-symbol.png" alt="Wayfinder Support" width={32} height={32} className="w-12 h-12 object-contain" />
              </div>
              <h3 className="font-medium text-[#0C211D] mb-2 text-[26px] leading-[31.2px] tracking-[-0.64px]">
                Wayfinder Support
              </h3>
              <p className="text-[#606B68] font-normal text-[18px] leading-[27px] tracking-[-0.48px]" style={{ fontFamily: "Inter, sans-serif" }}>
                A real educator oversees progress, intervenes when learning
                stalls, and partners with families when human attention is
                needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
