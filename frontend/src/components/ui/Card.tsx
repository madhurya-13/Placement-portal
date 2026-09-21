// src/components/ui/Card.tsx
import type { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 transition-colors duration-200 hover:border-white/25 ${className}`}>
      {children}
    </div>
  );
}