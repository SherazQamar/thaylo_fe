"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "How Learning Works", href: "/learning-approach" },
  { label: "Learning Model", href: "/personalised-learning" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-6 sm:px-8 lg:px-12 xl:px-16 py-5">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Image
            src="/assets/logo.png"
            alt="Thaylo Logo"
            width={48}
            height={48}
            className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
          />
          <div className="text-white hidden sm:block">
            <span className="text-lg font-normal tracking-[0.12em] leading-none block">
              THAYLO
            </span>
            <span className="block text-[9px] tracking-[0.18em] text-[#60D624]/80 uppercase mt-0.5">
              Global AI School
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-[#090F15] border border-white/10 rounded-full px-2 py-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-5 xl:px-6 py-2.5 rounded-full text-sm font-normal transition-all duration-300 whitespace-nowrap ${
                pathname === link.href
                  ? "bg-gradient-to-r from-[#60D624] to-[#00696B] text-white shadow-lg shadow-green-500/25"
                  : "text-white/70 hover:text-white hover:bg-white/8"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block flex-shrink-0">
          <Button variant="primary" className="!rounded-xl px-8 py-3 text-sm font-normal shadow-lg shadow-green-500/25">
            {pathname === "/" ? "Join The Pilot" : "Sign Up"}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white p-2 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-4 bg-[#0B1D2E]/95 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-normal transition-all ${
                  pathname === link.href
                    ? "bg-[#2ECC40] text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="primary" className="mt-4 w-full">
              Join The Pilot
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
