import React from "react";
import SectionLabel from "@/components/ui/SectionLabel";

const plans = [
  {
    name: "Explore Thaylo Before You Commit",
    subtitle: "Newbies Building AI Skills",
    price: "$0 for 7 Days",
    priceNote: "Fresh Minds & AI Learners",
    buttonText: "Start Trial",
    buttonStyle: "border border-[#1A2B3D] text-[#1A2B3D] hover:bg-gray-50",
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
    buttonStyle: "border border-[#1A2B3D] text-[#1A2B3D] hover:bg-gray-50",
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
    <section className="snap-section py-12 px-6 lg:px-12 bg-white flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <SectionLabel text="MEMBERSHIP" />
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-center mt-4 mb-2 text-[#1A2B3D]">
          Enrollment Options for the Academic Year
        </h2>
        <p className="text-center text-sm text-[#6B7280] tracking-widest uppercase mb-16">
          ONE FULL ACADEMIC YEAR. FLEXIBLE PAYMENT OPTIONS.
        </p>

        <div className="grid md:grid-cols-3 gap-6 items-start">
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
  featured,
  features,
}: {
  name: string;
  subtitle: string;
  price: string;
  priceNote: string;
  buttonText: string;
  buttonStyle: string;
  featured: boolean;
  features: string[];
}) {
  return (
    <div
      className={`rounded-2xl p-8 ${
        featured
          ? "bg-[#0B1D2E] text-white scale-[1.02] shadow-2xl"
          : "bg-[#F1F5F9] text-[#1A2B3D]"
      }`}
    >
      <h3 className="text-lg font-normal mb-1">{name}</h3>
      <p
        className={`text-sm mb-6 ${
          featured ? "text-white/60" : "text-[#6B7280]"
        }`}
      >
        {subtitle}
      </p>

      {/* Price */}
      <div className="text-center py-6 mb-6 border-t border-b border-dashed border-gray-500/30">
        <div className="text-3xl md:text-4xl font-normal">{price}</div>
        <p
          className={`text-sm mt-1 ${
            featured ? "text-white/60" : "text-[#6B7280]"
          }`}
        >
          {priceNote}
        </p>
      </div>

      {/* CTA Button */}
      <button
        className={`w-full py-3 rounded-full text-sm font-normal transition-colors cursor-pointer mb-8 ${buttonStyle}`}
      >
        {buttonText}
      </button>

      {/* Features */}
      <div>
        <p className="text-sm font-normal mb-4">What&apos;s Included</p>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill={featured ? "#14B8A6" : "#14B8A6"}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className={featured ? "text-white/80" : "text-[#6B7280]"}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
