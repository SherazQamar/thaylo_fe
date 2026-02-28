import React from "react";
import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";

const plans = [
  {
    name: "Trial Plan",
    subtitle: "Newbies Building AI Skills",
    price: "Free 7-Day Trial",
    priceNote: "Fresh Minds & AI Learners",
    buttonText: "Start Now",
    buttonStyle: "border border-[#1A2B3D] text-[#1A2B3D] hover:bg-gray-50",
    featured: false,
    features: [
      "Personalised AI lessons",
      "Personalised AI lessons",
      "Personalised AI lessons",
    ],
  },
  {
    name: "Family Plan",
    subtitle: "For's Most Improving AI Expertise",
    price: "$29/month",
    priceNote: "Career Minds & AI Specialists",
    buttonText: "Enroll Now",
    buttonStyle: "bg-[#14B8A6] text-white hover:bg-[#0D9488]",
    featured: true,
    features: [
      "Personalised AI lessons",
      "Personalised AI lessons",
      "Personalised AI lessons",
    ],
  },
  {
    name: "Founding Family Plan",
    subtitle: "Senior AI Practitioners",
    price: "$24/month",
    priceNote: "Expert Minds & AI Leaders",
    buttonText: "Enroll Now",
    buttonStyle: "border border-[#1A2B3D] text-[#1A2B3D] hover:bg-gray-50",
    featured: false,
    features: [
      "Personalised AI lessons",
      "Personalised AI lessons",
      "Personalised AI lessons",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="snap-section py-12 px-6 lg:px-12 bg-white flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <SectionLabel text="MEMBERSHIP" />
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-center mt-4 mb-16 text-[#1A2B3D]">
          Simple Plans for Growing Minds
        </h2>

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
      className={`rounded-2xl p-8 relative overflow-hidden ${
        featured
          ? "bg-[#0B1D2E] text-white scale-[1.02] shadow-2xl"
          : "bg-[#F1F5F9] text-[#1A2B3D]"
      }`}
    >
      {featured && (
        <Image
          src="/assets/testimonial-bg-pattern.png"
          alt=""
          fill
          className="object-cover object-right-top"
        />
      )}
      <h3 className="text-lg font-normal mb-1 relative z-10">{name}</h3>
      <p
        className={`text-sm mb-6 relative z-10 ${
          featured ? "text-white/60" : "text-[#6B7280]"
        }`}
      >
        {subtitle}
      </p>

      {/* Price */}
      <div className="text-center py-6 mb-6 border-t border-b border-dashed border-gray-500/30 relative z-10">
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
        className={`w-full py-3 rounded-full text-sm font-normal transition-colors cursor-pointer mb-8 relative z-10 ${buttonStyle}`}
      >
        {buttonText}
      </button>

      {/* Features */}
      <div className="relative z-10">
        <p className="text-sm font-normal mb-4">What You Get</p>
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
