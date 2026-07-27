// src/components/ui/StatTile.tsx
import type { LucideIcon } from "lucide-react";

export default function StatTile({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4">
      <div className="w-8 h-8 rounded-[10px] bg-white/10 flex items-center justify-center mb-2.5">
        <Icon className="w-4 h-4 text-ink-50" strokeWidth={2} />
      </div>
      <p className="text-[11px] text-ink-200">{label}</p>
      <p className="text-xl font-bold text-ink-50 leading-tight">{value}</p>
    </div>
  );
}