// src/pages/ErrorPage.tsx
// Full-page error surface served at /401 /403 /404 /500 /503 /451 and by the
// app-wide error boundary. Every page offers a way back to the homepage and,
// where it makes sense, a reconnect (reload) — no dead ends.

import { Link } from "react-router-dom";

interface Action {
  label: string;
  /** Internal route to link to. */
  to?: string;
  /** Reload the current app instead of navigating. */
  reload?: boolean;
}

const COPY: Record<number, { title: string; blurb: string }> = {
  401: {
    title: "Unauthorized",
    blurb: "Authentication failed or login credentials are required to view this content. Please sign in to continue.",
  },
  403: {
    title: "Forbidden",
    blurb: "You don't have permission to view this page or resource. Sign in with an account that has access, or head back home.",
  },
  404: {
    title: "Page Not Found",
    blurb: "The page you're looking for doesn't exist — it may have been moved, deleted, or the URL could be mistyped.",
  },
  500: {
    title: "Internal Server Error",
    blurb: "Something went wrong on our end while processing the request. The problem is on the server, not in your input.",
  },
  503: {
    title: "Service Unavailable",
    blurb: "The server is temporarily down for maintenance or overloaded. Reconnect in a moment to try again.",
  },
  451: {
    title: "Unavailable for Legal Reasons",
    blurb: "This resource has been legally restricted or removed and cannot be displayed.",
  },
};

const ACTIONS: Record<number, { primary: Action; secondary?: Action }> = {
  401: { primary: { label: "Log in", to: "/login" }, secondary: { label: "Back to home", to: "/" } },
  403: { primary: { label: "Back to home", to: "/" }, secondary: { label: "Log in", to: "/login" } },
  404: { primary: { label: "Back to home", to: "/" }, secondary: { label: "Try again", reload: true } },
  500: { primary: { label: "Try again", reload: true }, secondary: { label: "Back to home", to: "/" } },
  503: { primary: { label: "Reconnect", reload: true }, secondary: { label: "Back to home", to: "/" } },
  451: { primary: { label: "Back to home", to: "/" } },
};

function ActionButton({ action, variant }: { action: Action; variant: "primary" | "secondary" }) {
  const className =
    variant === "primary"
      ? "rounded-xl bg-ink-50 text-ink-950 font-semibold py-3 text-sm hover:bg-white transition-colors"
      : "rounded-xl border border-white/15 bg-white/5 text-ink-200 py-3 text-sm hover:bg-white/10 hover:text-ink-50 transition-colors";

  if (action.reload) {
    return (
      <button type="button" onClick={() => window.location.reload()} className={className}>
        {action.label}
      </button>
    );
  }
  return (
    <Link to={action.to ?? "/"} className={`${className} block`}>
      {action.label}
    </Link>
  );
}

export default function ErrorPage({ code }: { code: number }) {
  const copy = COPY[code] ?? {
    title: "Something went wrong",
    blurb: "An unexpected error occurred. You can retry or return to the homepage.",
  };
  const actions = ACTIONS[code] ?? { primary: { label: "Back to home", to: "/" } };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-5 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-accent-amber/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-accent-blue/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl animate-materialize">
          <p className="text-[72px] leading-none font-black tracking-tight text-white/10 select-none">{code}</p>
          <h1 className="mt-3 text-2xl font-semibold text-ink-50">{copy.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-400">{copy.blurb}</p>

          <div className="mt-7 flex flex-col gap-2.5">
            <ActionButton action={actions.primary} variant="primary" />
            {actions.secondary && <ActionButton action={actions.secondary} variant="secondary" />}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-ink-600">
          Error {code} — if this keeps happening, reconnect or come back later.
        </p>
      </div>
    </div>
  );
}
