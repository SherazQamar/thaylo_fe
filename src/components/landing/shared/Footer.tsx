import React from "react";
import Image from "next/image";

const mainPages = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Learning Approach", href: "/learning-approach" },
  { label: "Personalised Learning", href: "/personalised-learning" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#F8FAFB] pt-12 sm:pt-16 pb-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1320px] mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Contact */}
          <div>
            <h4 className="font-normal text-[#606B68] mb-4" style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>
              Contact
            </h4>
            <p className="text-[#0C211D] mb-1" style={{ fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>
              info@thayloglobal.com
            </p>
            <p className="text-[#0C211D]" style={{ fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>+1 (555) 123-4567</p>
          </div>

          {/* Business Address */}
          <div>
            <h4 className="font-normal text-[#606B68] mb-4" style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>
              Business Address
            </h4>
            <p className="text-[#0C211D]" style={{ fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>Las Vegas, NV 89107</p>
          </div>

          {/* Main Pages */}
          <div>
            <h4 className="font-normal text-[#606B68] mb-4" style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>
              Main Pages
            </h4>
            <ul className="space-y-2">
              {mainPages.map((page) => (
                <li key={page.label}>
                  <a
                    href={page.href}
                    className="text-[#0C211D] hover:text-[#14B8A6] transition-colors"
                    style={{ fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}
                  >
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-normal text-[#606B68] mb-4" style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>
              Stay Updated as Thaylo Grows
            </h4>
            <p className="text-[#0C211D] mb-4" style={{ fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}>
              Occasional updates on learning, pilots, and new offerings as well
              as what the latest learning science research suggests.
            </p>
            <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1.5">
              <input
                type="email"
                placeholder="Enter your Email"
                className="flex-1 px-4 py-2 text-sm bg-transparent outline-none text-[#1A2B3D] placeholder:text-[#9CA3AF] min-w-0"
              />
              <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#00696B] to-[#60D624] text-white text-sm font-medium hover:from-[#005A5C] hover:to-[#55C01F] transition-all cursor-pointer shrink-0">
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Big Logo */}
        <div className="mb-8">
          <h2 className="font-normal text-[#0C211D] text-[60px] sm:text-[80px] md:text-[100px] lg:text-[130px]" style={{ lineHeight: "1.2", letterSpacing: "-4px" }}>
            THAYLO
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-6 border-t border-gray-200 gap-4">
          <p className="text-sm text-[#6B7280]">Copyright &copy; Thaylo</p>
          <div className="flex items-center gap-3">
            <SocialLink
              href="#"
              label="Facebook"
              icon={
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              }
            />
            <SocialLink
              href="#"
              label="Instagram"
              icon={
                <>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </>
              }
              stroke
            />
            <SocialLink
              href="#"
              label="LinkedIn"
              icon={
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
              }
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  icon,
  stroke,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  stroke?: boolean;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-center hover:opacity-70 transition-opacity"
      aria-label={label}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={stroke ? "none" : "#0C211D"}
        stroke={stroke ? "#0C211D" : "none"}
        strokeWidth={stroke ? "2" : "0"}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </svg>
    </a>
  );
}
