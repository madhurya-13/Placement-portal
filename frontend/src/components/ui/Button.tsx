// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "gradient" | "danger" | "success" | "ghost" | "outline";
  size?: "sm" | "md";
  /** Render as a router link with identical styling (nav/CTA buttons). */
  to?: string;
  /** Works for both <button> and router <Link> renderings. */
  onClick?: MouseEventHandler<HTMLElement>;
}

const variants: Record<string, string> = {
  primary: "bg-ink-50 text-ink-950 hover:bg-white",
  // Shader-theme call to action — matches the hero's "Get Started" button.
  gradient:
    "bg-gradient-to-r from-cyan-500 to-orange-500 text-white font-semibold shadow-lg hover:from-cyan-400 hover:to-orange-400 hover:shadow-xl",
  danger: "bg-accent-red text-ink-950 hover:opacity-90",
  success: "bg-accent-green text-ink-950 hover:opacity-90",
  ghost: "text-ink-400 hover:bg-ink-900",
  outline: "border border-ink-800 text-ink-50 hover:bg-ink-900",
};

const sizes: Record<string, string> = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2.5" };

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  to,
  onClick,
  ...props
}: ButtonProps) {
  const classes = `rounded-xl font-semibold transition-all duration-200 ease-out active:scale-95 active:duration-100 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;

  // Link rendering forwards only onClick — the rest of the props are
  // button-only (type, disabled, form*, handlers typed for HTMLButtonElement).
  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
