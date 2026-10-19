// src/components/layout/Sidebar.tsx
// Role-aware side navigation. Desktop: fixed left column, always visible.
// Mobile: slides in as an overlay drawer, controlled by isOpen/onClose.

import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, LogOut, type LucideIcon } from "lucide-react";
import { useAuth } from "../../context/useAuth";

export interface NavLink {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  links: NavLink[];
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ links, isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { logoutUser } = useAuth();

  // Scroll to the section named in the URL hash — covers navigations that
  // arrive from another route (e.g. Landing → /dashboard#jobs), where the
  // browser doesn't scroll on its own for client-side routing.
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    const id = window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [location.pathname, location.hash]);

  // When the URL has no hash yet, the first section counts as active.
  const defaultHash = links[0]?.to.includes("#") ? `#${links[0].to.split("#")[1]}` : "";

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, to: string) {
    const [path, hash] = to.split("#");
    // Same route: scroll in place instead of letting the router re-render
    // without moving the viewport.
    if (hash && path === location.pathname) {
      e.preventDefault();
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", to);
    }
    onClose();
  }

  const content = (
    <div className="flex flex-col h-full w-47.5 bg-white/10 backdrop-blur-xl border-r border-white/15 px-3.5 py-5">
      <div className="flex items-center justify-between px-1.5 mb-6">
        <span className="font-bold text-[15px] text-ink-50">
          Placement<span className="text-ink-200">Hub</span>
        </span>
        <button onClick={onClose} className="md:hidden text-ink-400 hover:text-ink-50">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const [linkPath, linkHashRaw] = link.to.split("#");
          const linkHash = linkHashRaw ? `#${linkHashRaw}` : "";
          const isActive =
            location.pathname === linkPath &&
            (linkHash ? (location.hash || defaultHash) === linkHash : !location.hash);
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={(e) => handleNavClick(e, link.to)}
              className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-200 ${
                isActive ? "bg-ink-50 text-ink-950 font-semibold" : "text-ink-200 hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logoutUser}
        className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13px] font-medium text-accent-red hover:bg-white/10 transition-colors duration-200"
      >
        <LogOut className="w-4 h-4" strokeWidth={2} />
        Logout
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop: always visible, part of normal layout flow */}
      <div className="hidden md:block h-screen sticky top-0">{content}</div>

      {/* Mobile: overlay drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="absolute left-0 top-0 h-full">{content}</div>
        </div>
      )}
    </>
  );
}