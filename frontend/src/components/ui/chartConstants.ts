// src/components/ui/chartConstants.ts
// Shared chart styling values for every dashboard's statistics graphs.
// Kept separate from ChartTheme.tsx so that file stays component-only
// (react-refresh/only-export-components).
//
// Status colors are the vivid counterparts of the theme's status tokens
// (index.css accent-blue/amber/green/red), anchored by the hero's cyan:
// they read clearly on the dark glass panel at legend size while staying
// inside the shader palette.
export const STATUS_COLORS: Record<string, string> = {
  applied: "#22d3ee", // hero cyan — entered the funnel
  shortlisted: "#fbbf24", // vivid amber (theme accent-amber)
  selected: "#4ade80", // vivid green (theme accent-green)
  rejected: "#fb7185", // vivid red (theme accent-red)
};

// Chart text sits on the dark glass card — keep it near-white so axis
// labels and value labels never blend into the background.
export const AXIS_TICK = { fill: "#e8e8e8", fontSize: 11 };
export const AXIS_LINE = { stroke: "rgba(255,255,255,0.25)" };
export const TOOLTIP_STYLE = {
  background: "rgba(10,14,20,0.9)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 12,
  color: "#fafafa",
};

/** Solid pastel purple fill used by every dashboard bar chart (no gradient). */
export const BAR_COLOR = "#d8b4fe";

/** Legend height reserved under a donut, so center overlays stay aligned. */
export const LEGEND_HEIGHT = 24;
