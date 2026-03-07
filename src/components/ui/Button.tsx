"use client";

import React from "react";

type ButtonVariant = "primary" | "outline" | "teal" | "dark" | "outline-dark";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#60D624] to-[#00696B] text-white hover:opacity-90",
  outline:
    "border-2 border-white/40 text-white bg-transparent hover:bg-white/10",
  teal: "bg-[#14B8A6] text-white hover:bg-[#0D9488]",
  dark: "bg-[#111023] text-white hover:bg-[#1a1938]",
  "outline-dark":
    "border border-[#1A2B3D] text-[#1A2B3D] bg-transparent hover:bg-gray-50",
};

export default function Button({
  variant = "primary",
  children,
  className = "",
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`px-6 py-3 font-normal text-sm transition-all duration-300 cursor-pointer ${variantStyles[variant]} ${className}`}
      style={{ ...style, borderRadius: "9999px" }}
    >
      {children}
    </button>
  );
}
