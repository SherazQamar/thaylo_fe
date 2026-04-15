"use client";

import React, { useState, FormEvent } from "react";
import Image from "next/image";
import Navbar from "@/components/landing/shared/Navbar";
import Footer from "@/components/landing/shared/Footer";
import FAQ from "@/components/landing/home/FAQ";
import CTABanner from "@/components/landing/shared/CTABanner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: integrate with backend / email service
    setSubmitted(true);
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-[#0B1D2E] overflow-hidden">
        <Image
          src="/assets/aboutbg.png"
          alt=""
          fill
          className="object-cover mix-blend-screen"
          priority
        />
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#00696B]/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-40px] right-[-80px] w-[400px] h-[400px] bg-[#60D624]/5 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[-80px] w-[250px] h-[250px] bg-[#14B8A6]/5 rounded-full blur-[100px]" />
        </div>

        <Navbar />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 pt-28 sm:pt-36 pb-16 sm:pb-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
            <span className="text-sm font-normal tracking-widest text-[#14B8A6] uppercase">
              Get in Touch
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-normal text-white leading-[1.2] tracking-[-0.64px]">
            Reach Out for More Information
          </h1>
        </div>
      </section>

      {/* Contact Info + Form Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16">
            {/* Left - Contact Info */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
                <span className="text-[18px] lg:text-sm font-normal tracking-[-0.48px] lg:tracking-widest text-[#6B7280] uppercase">
                  Lets Talk
                </span>
              </div>

              <a
                href="mailto:info@thaylo.com"
                className="block text-[28px] sm:text-4xl lg:text-[44px] font-medium text-[#111023] mb-4 hover:text-[#14B8A6] transition-colors leading-[1.2] tracking-[-0.54px] break-words"
              >
                info@thaylo.com
              </a>

              <a
                href="tel:+18006339870"
                className="block text-[28px] sm:text-4xl lg:text-[44px] font-medium text-[#111023] mb-10 hover:text-[#14B8A6] transition-colors leading-[1.2] tracking-[-0.54px] whitespace-nowrap"
              >
                +1 (800) 633 – 9870
              </a>

              <div className="flex items-center justify-center lg:justify-start gap-5 lg:gap-3">
                <SocialLink
                  href="#"
                  label="Instagram"
                  icon={
                    <>
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="5"
                        ry="5"
                      />
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
                <SocialLink
                  href="#"
                  label="Facebook"
                  icon={
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  }
                />
              </div>
            </div>

            {/* Right - Contact Form */}
            <div>
              {submitted ? (
                <div className="bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#14B8A6]/20 flex items-center justify-center mx-auto mb-4">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-[#1A2B3D] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-6">
                    Thank you for reaching out. Our team will get back to you
                    shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        message: "",
                      });
                    }}
                    className="text-sm text-[#14B8A6] hover:text-[#0D9488] font-medium transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-[#F7F5EE] space-y-6" style={{ borderRadius: "16.75px", padding: "33px" }}>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-[#0C211D] mb-2"
                        style={{ fontSize: "24.57px", lineHeight: "29.48px", letterSpacing: "-0.54px", fontWeight: 500 }}
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 bg-white outline-none focus:border-[#14B8A6] transition-colors text-[#1A2B3D]"
                        style={{ border: "1.12px solid #CED3D2", borderRadius: "11.17px", height: "61px", fontSize: "16px" }}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-[#0C211D] mb-2"
                        style={{ fontSize: "24.57px", lineHeight: "29.48px", letterSpacing: "-0.54px", fontWeight: 500 }}
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 bg-white outline-none focus:border-[#14B8A6] transition-colors text-[#1A2B3D]"
                        style={{ border: "1.12px solid #CED3D2", borderRadius: "11.17px", height: "61px", fontSize: "16px" }}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[#0C211D] mb-2"
                        style={{ fontSize: "24.57px", lineHeight: "29.48px", letterSpacing: "-0.54px", fontWeight: 500 }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 bg-white outline-none focus:border-[#14B8A6] transition-colors text-[#1A2B3D]"
                        style={{ border: "1.12px solid #CED3D2", borderRadius: "11.17px", height: "61px", fontSize: "16px" }}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-[#0C211D] mb-2"
                        style={{ fontSize: "24.57px", lineHeight: "29.48px", letterSpacing: "-0.54px", fontWeight: 500 }}
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 bg-white outline-none focus:border-[#14B8A6] transition-colors text-[#1A2B3D]"
                        style={{ border: "1.12px solid #CED3D2", borderRadius: "11.17px", height: "61px", fontSize: "16px" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[#0C211D] mb-2"
                      style={{ fontSize: "24.57px", lineHeight: "29.48px", letterSpacing: "-0.54px", fontWeight: 500 }}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-4 bg-white outline-none focus:border-[#14B8A6] transition-colors resize-none text-[#1A2B3D]"
                      style={{ border: "1.12px solid #CED3D2", borderRadius: "11.17px", fontSize: "16px" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white hover:opacity-90 transition-colors cursor-pointer"
                    style={{ backgroundColor: "#0C211D", border: "1.12px solid #0C211D", borderRadius: "11.17px", padding: "18px 51px", fontSize: "16px", fontWeight: 500 }}
                  >
                    Submit Now
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <FAQ maxItems={4} />
      <CTABanner />
      <Footer />
    </main>
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
      className="w-20 h-20 lg:w-11 lg:h-11 rounded-full bg-[#0B1D2E] flex items-center justify-center hover:bg-[#162A3E] transition-colors"
      aria-label={label}
    >
      <svg
        width="30"
        height="30"
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
