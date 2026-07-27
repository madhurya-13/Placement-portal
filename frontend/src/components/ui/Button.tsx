// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "danger" | "success" | "ghost" | "outline";
  size?: "sm" | "md";
}

const variants: Record<string, string> = {
  primary: "bg-ink-50 text-ink-950 hover:bg-white",
  danger: "bg-accent-red text-ink-950 hover:opacity-90",
  success: "bg-accent-green text-ink-950 hover:opacity-90",
  ghost: "text-ink-400 hover:bg-ink-900",
  outline: "border border-ink-800 text-ink-50 hover:bg-ink-900",
};

const sizes: Record<string, string> = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2.5" };

export default function Button({ children, variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}