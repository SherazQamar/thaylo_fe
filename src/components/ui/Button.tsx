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
    "border border-white/50 text-white bg-white/10 hover:bg-white/20",
  teal: "bg-[#14B8A6] text-white hover:bg-[#0D9488]",
  dark: "bg-[#0B1D2E] text-white hover:bg-[#162A3E]",
  "outline-dark":
    "border border-[#1A2B3D] text-[#1A2B3D] bg-transparent hover:bg-gray-50",
};

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-6 py-3 rounded-full font-normal text-sm transition-all duration-300 cursor-pointer ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
