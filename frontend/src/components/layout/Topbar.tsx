// src/components/layout/Topbar.tsx
import { Menu } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

export default function Topbar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-30 bg-white/10 backdrop-blur-xl border-b border-white/15 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden text-ink-200 hover:text-ink-50">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <p className="font-semibold text-[14px] text-ink-50">{title}</p>
          <p className="text-[11px] text-ink-400 uppercase tracking-wide">
            {user?.role?.replace(/_/g, " ")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3.5">
        <NotificationBell />
        <UserMenu />
      </div>
    </div>
  );
}
