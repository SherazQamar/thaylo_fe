import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";

const plans = [
  {
    name: "Explore Thaylo Before You Commit",
    subtitleDesktop: "Newbies Building AI Skills",
    subtitleMobile: "Newbies Building AI Skills",
    price: "$0 for 7 Days",
    priceNoteDesktop: "Fresh Minds & AI Learners",
    priceNoteMobile: "Fresh Minds & AI Learners",
    buttonText: "Start Trial",
    buttonStyle: "bg-[#111023] text-white hover:bg-[#111023]/90",
    priceBoxStyle: "bg-white border border-[#E2E8F0]",
    priceTextColor: "text-[#111023]",
    featured: false,
    features: [
      "Full access to selected core coursework",
      "AI Instructor-led lessons",
      "Check-Ins with Calyx",
      "Your Bloom Buddy",
      "Parent Dashboard Preview",
    ],
  },
  {
    name: "Core Enrollment (Primary Offer)",
    subtitleDesktop: "Academic Year Enrollment",
    subtitleMobile: "Tech Pros Improving AI Expertise",
    price: "$7,500/year",
    priceNoteDesktop: "paid monthly or annually",
    priceNoteMobile: "paid monthly or annually",
    buttonText: "Enroll Now",
    buttonStyle: "bg-[#14B8A6] text-white hover:bg-[#0D9488]",
    priceBoxStyle: "bg-gradient-to-r from-[#0B1D2E] to-[#14B8A6]/40 border border-white/10",
    priceTextColor: "text-white",
    featured: true,
    features: [
      "Full academic-year course load (core + electives)",
      "Mastery-based progression",
      "AI Instructor-led instruction",
      "Calyx Bloom Buddy support",
      "Parent dashboard & reports",
    ],
    /** Mobile Figma reorders the first two bullets */
    featuresMobile: [
      "Mastery-based progression",
      "Full academic-year course load (core + electives)",
      "AI Instructor-led instruction",
      "Calyx Bloom Buddy support",
      "Parent dashboard & reports",
    ],
  },
  {
    name: "Founding Family Program",
    subtitleDesktop: "Early Adopter Program",
    subtitleMobile: "Senior AI Practitioners",
    price: "$5,500/year",
    priceNoteDesktop: "limited to first 200 students",
    priceNoteMobile: "Expert Minds & AI Leaders",
    buttonText: "Apply for Founding Family",
    buttonStyle: "bg-[#111023] text-white hover:bg-[#111023]/90",
    priceBoxStyle: "bg-white border border-[#E2E8F0]",
    priceTextColor: "text-[#111023]",
    featured: false,
    features: [
      "Full academic-year enrollment",
      "Priority access to new features",
      "Roadmap feedback & voting rights",
      "Dedicated Wayfinder onboarding support",
      "Founding Family recognition badge",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="py-12 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white flex flex-col justify-center">
      <div className="max-w-[1320px] mx-auto w-full">
        <SectionLabel text="MEMBERSHIP" />
        <h2
          className="text-[24px] sm:text-2xl md:text-4xl lg:text-[48px] font-normal text-center mt-4 mb-3 text-[#111023] leading-[1.2] tracking-[-0.64px]"
          style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
        >
          <span className="block sm:inline">Enrollment Options for the</span>{" "}
          <span className="block sm:inline">Academic Year</span>
        </h2>
        {/* Tagline — desktop / web only */}
        <p
          className="hidden sm:block text-center text-[#606B68] text-xs tracking-[0.1em] uppercase mb-12 lg:mb-16 font-normal"
          style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
        >
          One full academic year. Flexible payment options.
        </p>
        <div className="sm:hidden mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[30px] items-start max-w-[1330px] mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  name,
  subtitleDesktop,
  subtitleMobile,
  price,
  priceNoteDesktop,
  priceNoteMobile,
  buttonText,
  buttonStyle,
  priceBoxStyle,
  priceTextColor,
  featured,
  features,
  featuresMobile,
}: {
  name: string;
  subtitleDesktop: string;
  subtitleMobile: string;
  price: string;
  priceNoteDesktop: string;
  priceNoteMobile: string;
  buttonText: string;
  buttonStyle: string;
  priceBoxStyle: string;
  priceTextColor: string;
  featured: boolean;
  features: string[];
  featuresMobile?: string[];
}) {
  const mobileFeatures = featuresMobile ?? features;

  return (
    <div
      className={`rounded-[15px] overflow-hidden flex flex-col gap-[30px] ${
        featured
          ? "bg-[#0B1D2E] text-white shadow-2xl"
          : "bg-[#F1F5F9] text-[#111023]"
      }`}
    >
      <div className="relative p-[30px] pb-0">
        {featured && (
          <Image
            src="/assets/testimonial-bg-pattern.png"
            alt=""
            fill
            className="object-cover object-right-top"
          />
        )}
        <h3
          className="text-[20px] font-medium leading-[26px] tracking-[-0.48px] relative z-10"
          style={{
            color: featured ? "#fff" : "#111023",
            fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif",
          }}
        >
          {name}
        </h3>
        <p
          className={`text-[13px] leading-[20px] tracking-[-0.32px] font-normal mt-1 relative z-10 ${
            featured ? "text-white/60" : "text-[#606B68]"
          }`}
          style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
        >
          <span className="sm:hidden">{subtitleMobile}</span>
          <span className="hidden sm:inline">{subtitleDesktop}</span>
        </p>

        <div
          className={`rounded-xl p-3.5 mt-4 text-center relative z-10 ${priceBoxStyle}`}
        >
          <div
            className={`text-[30px] font-normal leading-tight ${priceTextColor}`}
            style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
          >
            {price}
          </div>
          <p
            className={`text-xs mt-1 font-normal ${
              featured ? "text-white/60" : "text-[#606B68]"
            }`}
            style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
          >
            <span className="sm:hidden">{priceNoteMobile}</span>
            <span className="hidden sm:inline">{priceNoteDesktop}</span>
          </p>
          <button
            className={`w-full py-2.5 rounded-xl text-[13px] font-normal transition-colors cursor-pointer mt-3 ${buttonStyle}`}
            style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
          >
            {buttonText}
          </button>
        </div>
      </div>

      <div className="px-[30px] pb-[30px]">
        <p
          className={`text-[14px] font-medium mb-2.5 leading-[20px] ${
            featured ? "text-white" : "text-[#111023]"
          }`}
        >
          What&apos;s Included
        </p>
        <ul className="space-y-2 sm:hidden">
          {mobileFeatures.map((feature, i) => (
            <FeatureItem key={i} feature={feature} featured={featured} />
          ))}
        </ul>
        <ul className="hidden sm:block space-y-2">
          {features.map((feature, i) => (
            <FeatureItem key={i} feature={feature} featured={featured} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function FeatureItem({
  feature,
  featured,
}: {
  feature: string;
  featured: boolean;
}) {
  return (
    <li className="flex items-start gap-2">
      <svg
        className="w-[18px] h-[18px] flex-shrink-0 mt-0.5"
        viewBox="0 0 20 20"
        fill="#14B8A6"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <span
        className={`text-[13px] leading-[20px] tracking-[-0.32px] font-normal ${
          featured ? "text-white/80" : "text-[#606B68]"
        }`}
        style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
      >
        {feature}
      </span>
    </li>
  );
}
