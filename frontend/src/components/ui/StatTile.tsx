// src/components/ui/StatTile.tsx
import type { LucideIcon } from "lucide-react";

export default function StatTile({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) {
  return (
    <div className="relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 transition-colors duration-200 hover:border-white/30">
      {/* Gradient hairline — echoes the hero's glass badge. */}
      <div className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-orange-400/40" />
      <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-cyan-500/30 to-orange-500/25 border border-white/15 flex items-center justify-center mb-2.5">
        <Icon className="w-4 h-4 text-ink-50" strokeWidth={2} />
      </div>
      <p className="text-[11px] text-ink-200">{label}</p>
      <p className="text-2xl font-black tracking-tight text-ink-50 leading-tight tabular-nums">{value}</p>
    </div>
  );
}