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
            <h4 className="text-sm font-normal text-[#6B7280] mb-4">
              Contact
            </h4>
            <p className="text-sm text-[#1A2B3D] mb-1">
              info@thayloglobal.com
            </p>
            <p className="text-sm text-[#1A2B3D]">+1 (555) 123-4567</p>
          </div>

          {/* Business Address */}
          <div>
            <h4 className="text-sm font-normal text-[#6B7280] mb-4">
              Business Address
            </h4>
            <p className="text-sm text-[#1A2B3D]">Las Vegas, NV 89107</p>
          </div>

          {/* Main Pages */}
          <div>
            <h4 className="text-sm font-normal text-[#6B7280] mb-4">
              Main Pages
            </h4>
            <ul className="space-y-2">
              {mainPages.map((page) => (
                <li key={page.label}>
                  <a
                    href={page.href}
                    className="text-sm text-[#1A2B3D] hover:text-[#14B8A6] transition-colors"
                  >
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-normal text-[#6B7280] mb-4">
              Stay Updated as Thaylo Grows
            </h4>
            <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
              Occasional updates on learning, pilots, and new offerings as well
              as what the latest learning science research suggests.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your Email"
                className="flex-1 px-4 py-2.5 rounded-l-full border border-gray-200 text-sm bg-white outline-none focus:border-[#14B8A6]"
              />
              <button className="px-5 py-2.5 rounded-r-full bg-[#14B8A6] text-white text-sm font-normal hover:bg-[#0D9488] transition-colors cursor-pointer">
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Big Logo */}
        <div className="mb-8">
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-normal text-[#0B1D2E] tracking-[0.15em]">
            THAYLO
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-4">
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
      className="w-9 h-9 rounded-full bg-[#0B1D2E] flex items-center justify-center hover:bg-[#162A3E] transition-colors"
      aria-label={label}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={stroke ? "none" : "white"}
        stroke={stroke ? "white" : "none"}
        strokeWidth={stroke ? "2" : "0"}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </svg>
    </a>
  );
}
