// src/components/layout/UserMenu.tsx
// The header avatar: shows the signed-in user's initials and, on click,
// a glass dropdown with their login credentials (email) and role, plus
// logout — so anyone glancing at a shared screen knows who is signed in.
import { useState, useEffect, useRef } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

/** "recruiter.demo@campus.edu" -> "RD" (initials from the email local part). */
function initialsFor(email: string): string {
  const local = email.split("@")[0];
  const parts = local.split(/[._-]+/).filter(Boolean);
  const letters = parts.length >= 2 ? parts[0][0] + parts[1][0] : local.slice(0, 2);
  return letters.toUpperCase();
}

function roleLabel(role: string): string {
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function UserMenu() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!user) return null;

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        className="w-8 h-8 rounded-full bg-ink-50 text-ink-950 flex items-center justify-center text-[11px] font-bold hover:ring-2 hover:ring-accent-cyan/60 transition-shadow"
      >
        {initialsFor(user.email)}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-ink-900/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 animate-materialize">
          <div className="px-4 py-3.5 border-b border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">
              Signed in as
            </p>
            <p className="text-[13px] font-semibold text-ink-50 break-all">{user.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wide text-ink-200">
              <ShieldCheck className="w-3 h-3 text-accent-cyan" />
              {roleLabel(user.role)}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-ink-200 hover:text-ink-50 hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
