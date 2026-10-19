// src/components/ui/inputClass.ts
// One source of truth for form-field styling. Every page (Profile, Post Job,
// Create Company, Register, My Jobs) imports this instead of re-declaring the
// string, so fields stay visually identical across the app.
export const inputClass =
  "bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-white/40 transition-colors";
