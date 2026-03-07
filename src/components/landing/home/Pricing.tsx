import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";

const plans = [
  {
    name: "Explore Thaylo Before You Commit",
    subtitle: "Newbies Building AI Skills",
    price: "$0 for 7 Days",
    priceNote: "Fresh Minds & AI Learners",
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
    subtitle: "Academic Year Enrollment",
    price: "$7,500/year",
    priceNote: "paid monthly or annually",
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
  },
  {
    name: "Founding Family Program",
    subtitle: "Early Adopter Program",
    price: "$5,500/year",
    priceNote: "limited to first 200 students",
    buttonText: "Apply For Founding Family",
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
        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-[48px] font-normal text-center mt-4 mb-3 text-[#111023] leading-tight tracking-[-0.64px]">
          Enrollment Options for the Academic Year
        </h2>
        <p
          className="text-center text-[#606B68] text-xs tracking-[0.1em] uppercase mb-12 lg:mb-16 font-normal"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          ONE FULL ACADEMIC YEAR.&nbsp; FLEXIBLE PAYMENT OPTIONS.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 items-start max-w-[1330px] mx-auto">
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
  subtitle,
  price,
  priceNote,
  buttonText,
  buttonStyle,
  priceBoxStyle,
  priceTextColor,
  featured,
  features,
}: {
  name: string;
  subtitle: string;
  price: string;
  priceNote: string;
  buttonText: string;
  buttonStyle: string;
  priceBoxStyle: string;
  priceTextColor: string;
  featured: boolean;
  features: string[];
}) {
  return (
    <div
      className={`rounded-[15px] overflow-hidden ${
        featured
          ? "bg-[#0B1D2E] text-white shadow-2xl"
          : "bg-[#F1F5F9] text-[#111023]"
      }`}
    >
      {/* Top section */}
      <div className="relative p-5">
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
          style={{ color: featured ? "#fff" : "#111023" }}
        >
          {name}
        </h3>
        <p
          className={`text-[13px] leading-[20px] tracking-[-0.32px] font-normal mt-1 relative z-10 ${
            featured ? "text-white/60" : "text-[#606B68]"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {subtitle}
        </p>

        {/* Price box with button inside */}
        <div
          className={`rounded-xl p-3.5 mt-4 text-center relative z-10 ${priceBoxStyle}`}
        >
          <div
            className={`text-[30px] font-normal leading-tight ${priceTextColor}`}
          >
            {price}
          </div>
          <p
            className={`text-xs mt-1 font-normal ${
              featured ? "text-white/60" : "text-[#606B68]"
            }`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {priceNote}
          </p>
          <button
            className={`w-full py-2.5 rounded-xl text-[13px] font-normal transition-colors cursor-pointer mt-3 ${buttonStyle}`}
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* Features section */}
      <div className="px-5 pb-5">
        <p
          className={`text-[14px] font-medium mb-2.5 leading-[20px] ${
            featured ? "text-white" : "text-[#111023]"
          }`}
        >
          What&apos;s Included
        </p>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
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
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
