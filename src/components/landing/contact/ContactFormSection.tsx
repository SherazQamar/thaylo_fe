"use client";

import React, { useState, FormEvent } from "react";
import {
  formatPhoneInput,
  isValidPhoneDigits,
  PHONE_VALIDATION_MESSAGE,
} from "@/lib/validation/phone";

function SocialIcon({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="size-[67px] rounded-full bg-[#0C211D] flex items-center justify-center hover:bg-[#162A3E] transition-colors"
    >
      <svg
        width="27"
        height="27"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </a>
  );
}

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    if (name === "phone") {
      setPhoneError(null);
      setFormData({ ...formData, phone: formatPhoneInput(value) });
      return;
    }

    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (formData.phone.trim() && !isValidPhoneDigits(formData.phone)) {
      setPhoneError(PHONE_VALIDATION_MESSAGE);
      return;
    }

    setPhoneError(null);
    // TODO: integrate with backend / email service
    setSubmitted(true);
  }

  const labelClass =
    "block text-[#0C211D] mb-[17px] text-[20px] lg:text-[24.57px] leading-[30px] lg:leading-[29.48px] tracking-[-0.54px] font-medium";
  const inputClass =
    "w-full px-4 bg-white outline-none focus:border-[#00CED1] transition-colors text-[#1A2B3D] text-base";
  const inputStyle: React.CSSProperties = {
    border: "1.12px solid #CED3D2",
    borderRadius: "11.17px",
    height: "61.42px",
  };

  return (
    <section className="py-14 sm:py-16 lg:py-[100px] px-6 lg:px-[50px] bg-white">
      <div className="max-w-[1340px] mx-auto">
        <div className="grid lg:grid-cols-[414px_1fr] gap-10 lg:gap-[94px] items-start">
          {/* Left — contact info (centered on mobile, left on desktop) */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-[11px] mb-[22px] lg:mb-[53px]">
              <span
                className="inline-block size-[11.17px] bg-[#00CED1] shrink-0"
                style={{ borderRadius: "2px" }}
              />
              <span
                className="text-[18px] font-normal leading-[31px] tracking-[-0.48px] text-[#606B68]"
                style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
              >
                Lets Talk
              </span>
            </div>

            <a
              href="mailto:info@thaylo.com"
              className="block text-[24px] sm:text-[32px] lg:text-[44px] font-medium text-[#0C211D] mb-4 lg:mb-[19px] hover:text-[#00CED1] transition-colors leading-[32px] lg:leading-[54px] tracking-[-0.54px] break-words"
              style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
            >
              info@thaylo.com
            </a>

            <a
              href="tel:+18006339870"
              className="block text-[24px] sm:text-[32px] lg:text-[44px] font-medium text-[#0C211D] mb-8 lg:mb-[53px] hover:text-[#00CED1] transition-colors leading-[32px] lg:leading-[54px] tracking-[-0.54px] whitespace-nowrap"
              style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
            >
              +1 (800) 633 - 9870
            </a>

            {/* Figma order: Instagram, LinkedIn, Facebook — 67×67 */}
            <div className="flex items-center justify-center lg:justify-start gap-[18px]">
              <SocialIcon label="Instagram">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </SocialIcon>
              <SocialIcon label="LinkedIn">
                <rect x="2.5" y="2.5" width="19" height="19" rx="3" />
                <path d="M7 10.5v6" />
                <path d="M7 7.4v.01" />
                <path d="M11 16.5v-6" />
                <path d="M11 13.4a2.5 2.5 0 0 1 5 0v3.1" />
              </SocialIcon>
              <SocialIcon label="Facebook">
                <circle cx="12" cy="12" r="9.5" />
                <path d="M14.5 8.5H13a1.75 1.75 0 0 0-1.75 1.75V12h3" />
                <path d="M11.25 12v7" />
                <path d="M11.25 12H9.5" />
              </SocialIcon>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div
                className="bg-[#F7F5EE] p-8 text-center"
                style={{ borderRadius: "16.75px" }}
              >
                <div className="w-16 h-16 rounded-full bg-[#00CED1]/20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00CED1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3
                  className="text-xl font-medium text-[#0C211D] mb-2"
                  style={{ fontFamily: "Instrument Sans, var(--font-instrument-sans), sans-serif" }}
                >
                  Message Sent!
                </h3>
                <p
                  className="text-sm text-[#606B68] mb-6"
                  style={{ fontFamily: "Inter, var(--font-inter), sans-serif" }}
                >
                  Thank you for reaching out. Our team will get back to you
                  shortly.
                </p>
                <button
                  type="button"
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
                  className="text-sm text-[#00CED1] hover:opacity-80 font-medium transition-opacity cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-[#F7F5EE] space-y-[27px] p-5 lg:p-[33.5px]"
                style={{ borderRadius: "16.75px" }}
              >
                {/* Desktop Figma: 2-col name/email rows; mobile: stacked */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[27px] lg:gap-x-[28px] lg:gap-y-[27px]">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClass}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={12}
                      aria-invalid={phoneError ? true : undefined}
                      className={inputClass}
                      style={inputStyle}
                    />
                    {phoneError && (
                      <p className="mt-2 text-sm text-red-600">{phoneError}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-4 bg-white outline-none focus:border-[#00CED1] transition-colors resize-none text-[#1A2B3D] text-base min-h-[160px] lg:min-h-[206px]"
                    style={{
                      border: "1.12px solid #CED3D2",
                      borderRadius: "11.17px",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white hover:opacity-90 transition-opacity cursor-pointer"
                  style={{
                    backgroundColor: "#0C211D",
                    border: "1.12px solid #0C211D",
                    borderRadius: "11.17px",
                    padding: "18px 51px",
                    fontSize: "16px",
                    fontWeight: 500,
                    fontFamily: "Inter, var(--font-inter), sans-serif",
                  }}
                >
                  Submit Now
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
