// src/components/layout/Topbar.tsx
import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../context/useAuth";

export default function Topbar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  const { user } = useAuth();
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "?";

  return (
    <div className="sticky top-0 z-30 bg-white/10 backdrop-blur-xl border-b border-white/15 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden text-ink-200 hover:text-ink-50">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <p className="font-semibold text-[14px] text-ink-50">{title}</p>
          <p className="text-[11px] text-ink-400 uppercase tracking-wide">{user?.role?.replace("_", " ")}</p>
        </div>
      </div>
      <div className="flex items-center gap-3.5">
        <Bell className="w-4.25 h-4.25 text-ink-200" />
        <div className="w-8 h-8 rounded-full bg-ink-50 text-ink-950 flex items-center justify-center text-[11px] font-bold">
          {initials}
        </div>
      </div>
    </div>
  );
}