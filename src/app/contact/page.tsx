"use client";

import React, { useState, FormEvent } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
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
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#00696B]/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-40px] right-[-80px] w-[400px] h-[400px] bg-[#60D624]/5 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[-80px] w-[250px] h-[250px] bg-[#14B8A6]/5 rounded-full blur-[100px]" />
        </div>

        <Navbar />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 pt-36 pb-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
            <span className="text-sm font-normal tracking-widest text-[#14B8A6] uppercase">
              Contact Us
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-normal text-white leading-[1.2] tracking-[-0.64px] mb-5">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Have questions about Thaylo or our learning programs? We would love
            to hear from you. Reach out and our team will get back to you as
            soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form + Info Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-16">
            {/* Left - Contact Form */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-normal text-[#1A2B3D] mb-2">
                Send Us a Message
              </h2>
              <p className="text-sm text-[#6B7280] mb-8 leading-relaxed">
                Fill out the form below and we will respond within 24 hours.
              </p>

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
                        fullName: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="text-sm text-[#14B8A6] hover:text-[#0D9488] font-medium transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-[#1A2B3D] mb-1.5"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:border-[#14B8A6] transition-colors placeholder:text-[#6B7280]/50"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#1A2B3D] mb-1.5"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:border-[#14B8A6] transition-colors placeholder:text-[#6B7280]/50"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-[#1A2B3D] mb-1.5"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:border-[#14B8A6] transition-colors placeholder:text-[#6B7280]/50"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-[#1A2B3D] mb-1.5"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help?"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:border-[#14B8A6] transition-colors placeholder:text-[#6B7280]/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[#1A2B3D] mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:border-[#14B8A6] transition-colors resize-none placeholder:text-[#6B7280]/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-full bg-[#14B8A6] text-white text-sm font-medium hover:bg-[#0D9488] transition-colors cursor-pointer shadow-lg shadow-teal-500/20"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Right - Contact Info */}
            <div className="space-y-6">
              {/* Contact Info Card */}
              <div className="bg-[#F8FAFB] rounded-2xl p-8 border border-gray-100">
                <h3 className="text-lg font-medium text-[#1A2B3D] mb-6">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E0F2FE] flex items-center justify-center flex-shrink-0">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#14B8A6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Email</p>
                      <a
                        href="mailto:info@thayloglobal.com"
                        className="text-sm font-normal text-[#1A2B3D] hover:text-[#14B8A6] transition-colors"
                      >
                        info@thayloglobal.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E0F2FE] flex items-center justify-center flex-shrink-0">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#14B8A6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Phone</p>
                      <a
                        href="tel:+15551234567"
                        className="text-sm font-normal text-[#1A2B3D] hover:text-[#14B8A6] transition-colors"
                      >
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E0F2FE] flex items-center justify-center flex-shrink-0">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#14B8A6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Address</p>
                      <p className="text-sm font-normal text-[#1A2B3D]">
                        Las Vegas, NV 89107
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Card */}
              <div className="bg-[#F8FAFB] rounded-2xl p-8 border border-gray-100">
                <h3 className="text-lg font-medium text-[#1A2B3D] mb-4">
                  Follow Us
                </h3>
                <p className="text-sm text-[#6B7280] mb-5 leading-relaxed">
                  Stay connected and follow our journey on social media.
                </p>
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
                </div>
              </div>

              {/* Support Hours Card */}
              <div className="bg-[#F8FAFB] rounded-2xl p-8 border border-gray-100">
                <h3 className="text-lg font-medium text-[#1A2B3D] mb-4">
                  Support Hours
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B7280]">
                      Monday - Friday
                    </span>
                    <span className="text-sm font-normal text-[#1A2B3D]">
                      9:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B7280]">Saturday</span>
                    <span className="text-sm font-normal text-[#1A2B3D]">
                      10:00 AM - 4:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B7280]">Sunday</span>
                    <span className="text-sm font-normal text-[#1A2B3D]">
                      Closed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder Section */}
      <section className="bg-[#F1F5F9] py-16 sm:py-20 px-6 lg:px-12">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-normal text-[#1A2B3D] mb-3">
              Our Location
            </h2>
            <p className="text-sm text-[#6B7280]">
              Las Vegas, NV 89107
            </p>
          </div>
          <div className="w-full h-[350px] sm:h-[400px] rounded-2xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#E0F2FE] flex items-center justify-center mx-auto mb-4">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <p className="text-sm text-[#6B7280]">
                Map integration coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

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
      className="w-10 h-10 rounded-full bg-[#0B1D2E] flex items-center justify-center hover:bg-[#162A3E] transition-colors"
      aria-label={label}
    >
      <svg
        width="16"
        height="16"
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
