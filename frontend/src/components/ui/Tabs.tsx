// src/components/ui/Tabs.tsx
import type { LucideIcon } from "lucide-react";

interface Tab {
  key: string;
  label: string;
  icon?: LucideIcon;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-1.5 flex-wrap mb-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors duration-200 ${
              isActive ? "bg-ink-50 text-ink-950" : "text-ink-400 hover:bg-ink-900"
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}