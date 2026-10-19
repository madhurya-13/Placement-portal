// src/components/layout/NotificationBell.tsx
// Interactive bell icon: fetches role-specific notifications from
// GET /api/v1/notifications, shows an unread badge, and opens a glass
// dropdown. Read-state is client-side — the server derives the feed live,
// so each user's read ids live in localStorage keyed by their user id.
import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, CheckCheck } from "lucide-react";
import * as notificationsApi from "../../api/notifications";
import { useAuth } from "../../context/useAuth";
import type { NotificationItem } from "../../types";

const POLL_MS = 60_000; // refresh while the dashboard stays open

function readKey(userId: number) {
  return `read_notifications_${userId}`;
}

function loadRead(userId: number): string[] {
  try {
    const raw = localStorage.getItem(readKey(userId));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.floor((Date.now() - then) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [items, setItems] = useState<NotificationItem[]>([]);
  // Topbar mounts inside ProtectedRoute, so `user` is always set here; the
  // lazy initializer reads localStorage once without an effect round-trip.
  const [readIds, setReadIds] = useState<string[]>(() => loadRead(user?.id ?? -1));
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(() => {
    notificationsApi
      .getNotifications()
      .then((res) => setItems(res.data))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const timer = window.setInterval(fetchNotifications, POLL_MS);
    return () => window.clearInterval(timer);
  }, [user, fetchNotifications]);

  // Close when clicking/tapping anywhere outside the bell.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!user) return null;

  const unread = items.filter((n) => !readIds.includes(n.id));

  function persist(ids: string[]) {
    setReadIds(ids);
    localStorage.setItem(readKey(user!.id), JSON.stringify(ids));
  }

  function markAllRead() {
    persist(items.map((n) => n.id));
  }

  function onItemClick(item: NotificationItem) {
    if (!readIds.includes(item.id)) persist([...readIds, item.id]);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          // Refresh on open so the list is never stale when you look.
          fetchNotifications();
        }}
        aria-label={`Notifications (${unread.length} unread)`}
        className="relative text-ink-200 hover:text-ink-50 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unread.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-accent-orange text-ink-950 text-[10px] font-bold flex items-center justify-center">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-ink-900/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 animate-materialize">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <p className="text-xs font-semibold text-ink-50 uppercase tracking-wide">
              Notifications
            </p>
            {unread.length > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[11px] text-accent-cyan hover:text-ink-50 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-sm text-ink-400 text-center py-8 px-4">
                You&apos;re all caught up.
              </p>
            ) : (
              items.map((item) => {
                const isRead = readIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className="w-full text-left px-4 py-3 flex gap-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    <span
                      className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                        isRead ? "bg-white/15" : "bg-accent-cyan"
                      }`}
                    />
                    <span className="min-w-0">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="text-[13px] font-semibold text-ink-50 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-ink-400 whitespace-nowrap">
                          {timeAgo(item.created_at)}
                        </span>
                      </span>
                      <span className="block text-xs text-ink-200 leading-snug mt-0.5">
                        {item.body}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
