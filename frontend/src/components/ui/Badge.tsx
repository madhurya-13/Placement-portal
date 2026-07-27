// src/components/ui/Badge.tsx
interface BadgeProps {
  children: string;
  variant?: "amber" | "green" | "red" | "blue" | "slate";
}

const variants: Record<string, string> = {
  amber: "bg-white/15 text-accent-amber",
  green: "bg-white/15 text-accent-green",
  red: "bg-white/15 text-accent-red",
  blue: "bg-white/15 text-accent-blue",
  slate: "bg-white/15 text-ink-200",
};

export default function Badge({ children, variant = "slate" }: BadgeProps) {
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${variants[variant]}`}>{children}</span>;
}