import Image from "next/image";

const mainPages = [
  { label: "Home", href: "/" },
  { label: "Learning Approach", href: "/learning-approach" },
  { label: "How Learning Works", href: "/learning-approach" },
  { label: "Learning Model", href: "/personalised-learning" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#F8FAFB] pt-10 sm:pt-16 pb-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 sm:mb-12">
          <div>
            <h4
              className="font-normal text-[#606B68] mb-4"
              style={{
                fontFamily: "Inter, var(--font-inter), sans-serif",
                fontSize: "18px",
                lineHeight: "27px",
                letterSpacing: "-0.48px",
              }}
            >
              Contact
            </h4>
            <p
              className="text-[#0C211D] mb-1"
              style={{ fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}
            >
              info@thayloglobal.com
            </p>
            <p
              className="text-[#0C211D]"
              style={{ fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}
            >
              +1 (555) 123-4567
            </p>
          </div>

          <div>
            <h4
              className="font-normal text-[#606B68] mb-4"
              style={{
                fontFamily: "Inter, var(--font-inter), sans-serif",
                fontSize: "18px",
                lineHeight: "27px",
                letterSpacing: "-0.48px",
              }}
            >
              {/* Mobile: Address · Desktop: Business Address */}
              <span className="sm:hidden">Address</span>
              <span className="hidden sm:inline">Business Address</span>
            </h4>
            <p
              className="text-[#0C211D]"
              style={{ fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}
            >
              <span className="sm:hidden">
                5609 E Sprague Ave, Spokane Valley, WA 99212, USA
              </span>
              <span className="hidden sm:inline">Las Vegas, NV 89107</span>
            </p>
          </div>

          <div>
            <h4
              className="font-normal text-[#606B68] mb-4"
              style={{
                fontFamily: "Inter, var(--font-inter), sans-serif",
                fontSize: "18px",
                lineHeight: "27px",
                letterSpacing: "-0.48px",
              }}
            >
              Main Pages
            </h4>
            <ul className="space-y-2">
              {mainPages.map((page) => (
                <li key={page.label}>
                  <a
                    href={page.href}
                    className="text-[#0C211D] hover:text-[#14B8A6] transition-colors"
                    style={{
                      fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif",
                      fontWeight: 400,
                      fontSize: "18px",
                      lineHeight: "27px",
                      letterSpacing: "-0.48px",
                    }}
                  >
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="font-normal text-[#606B68] mb-4 text-[18px] leading-[27px] tracking-[-0.48px]"
              style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
            >
              Stay Updated as Thaylo Grows
            </h4>
            {/* Newsletter blurb — desktop / web only */}
            <p
              className="hidden sm:block text-[#0C211D] mb-4"
              style={{ fontSize: "18px", lineHeight: "27px", letterSpacing: "-0.48px" }}
            >
              Occasional updates on learning, pilots, and new offerings as well
              as what the latest learning science research suggests.
            </p>
            <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1.5">
              <input
                type="email"
                placeholder="Enter your Email"
                className="flex-1 px-4 py-2 text-sm bg-transparent outline-none text-[#1A2B3D] placeholder:text-[#9CA3AF] min-w-0"
              />
              <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#60D624] to-[#00696B] text-white text-sm font-medium hover:opacity-90 transition-all cursor-pointer shrink-0">
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Big THAYLO wordmark — desktop / web only */}
        <div className="hidden sm:block mb-8">
          <h2
            className="font-normal text-[#0C211D] text-[60px] sm:text-[80px] md:text-[100px] lg:text-[130px]"
            style={{
              lineHeight: "1.2",
              letterSpacing: "-4px",
              fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif",
            }}
          >
            THAYLO
          </h2>
        </div>

        <div className="flex flex-col items-center py-6 border-t-0 sm:border-t border-gray-200 gap-4 sm:flex-row sm:justify-between">
          <p
            className="text-[#000000] font-normal"
            style={{
              fontFamily: "Inter, var(--font-inter), sans-serif",
              fontSize: "18px",
              lineHeight: "21.6px",
              letterSpacing: "-0.48px",
            }}
          >
            Copyright &copy; Thaylo
          </p>
          <div className="flex items-center gap-5">
            <a href="#" aria-label="Facebook" className="hover:opacity-70 transition-opacity">
              <Image
                src="/assets/Facebook symbol.png"
                alt="Facebook"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
                unoptimized
              />
            </a>
            <a href="#" aria-label="Instagram" className="hover:opacity-70 transition-opacity">
              <Image
                src="/assets/Instagram symbol.png"
                alt="Instagram"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
                unoptimized
              />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:opacity-70 transition-opacity">
              <Image
                src="/assets/linkedin symbol.png"
                alt="LinkedIn"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
                unoptimized
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
