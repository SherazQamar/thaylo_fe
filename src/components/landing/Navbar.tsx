"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "Home", href: "#home", active: true },
  { label: "About Us", href: "#about" },
  { label: "How Learning Works", href: "#how-learning-works" },
  { label: "Learning Model", href: "#learning-model" },
  { label: "Contact Us", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`px-5 xl:px-6 py-2.5 rounded-full text-sm font-normal transition-all duration-300 whitespace-nowrap ${
                link.active
                  ? "bg-[#2ECC40] text-white shadow-lg shadow-green-500/20"
                  : "text-white/70 hover:text-white hover:bg-white/8"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block flex-shrink-0">
          <Button variant="primary" className="px-8 py-3 text-sm font-normal shadow-lg shadow-green-500/25">
            Join The Pilot
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
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-normal transition-all ${
                  link.active
                    ? "bg-[#2ECC40] text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
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
