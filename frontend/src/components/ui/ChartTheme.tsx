// src/components/ui/ChartTheme.tsx
// Shared premium chart components — glass sub-panels, bar gradient, donut
// center readout and empty state. Officer (StatsPanel) and recruiter
// (RecruiterStatsPanel) dashboards both render these so the charts are
// identical across roles. Style values live in chartConstants.ts.
import type { XAxisTickContentProps } from "recharts";
import { AXIS_TICK, LEGEND_HEIGHT } from "./chartConstants";

/** Glass sub-panel that hosts one chart — matches the dashboard Card look. */
export function ChartPanel({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-ink-50 tracking-wide uppercase">{title}</h3>
        {meta && <span className="text-[11px] text-ink-200">{meta}</span>}
      </div>
      {children}
    </div>
  );
}

/**
 * Big centered readout inside a donut chart (total applications).
 * Place inside a `relative` wrapper; the bottom offset equals the legend
 * height so the text centers on the plot area, which sits above the legend.
 */
export function DonutCenter({ value, caption }: { value: number | string; caption: string }) {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 top-0 flex flex-col items-center justify-center"
      style={{ bottom: LEGEND_HEIGHT }}
    >
      <span className="text-2xl font-bold text-ink-50 tabular-nums leading-none">{value}</span>
      <span className="text-[9px] uppercase tracking-[0.18em] text-ink-400 mt-1">{caption}</span>
    </div>
  );
}

/**
 * Horizontal x-axis tick that wraps long company names onto balanced
 * centered lines so labels never collide in the narrow panel — the axis
 * stays flat instead of slanting the text.
 */
export function WrappedTick(props: XAxisTickContentProps) {
  const tickX = Number(props.x) || 0;
  const tickY = Number(props.y) || 0;
  const value = String(props.payload?.value ?? "").trim();
  // Pack words onto balanced lines so no line is wider than the slot the
  // tick occupies (~42px for four bars). One word per line for most names;
  // a slot only needs ~8 characters at this font size.
  const MAX_LINE = 8;
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  for (const word of words) {
    const current = lines[lines.length - 1];
    if (current && current.length + 1 + word.length <= MAX_LINE) {
      lines[lines.length - 1] = `${current} ${word}`;
    } else {
      lines.push(word);
    }
  }
  if (lines.length === 0) lines.push(value);
  // Recharts supplies its default axis fill when no tick TextProps are set;
  // always use the kit's near-white so labels never blend into the panel.
  // `angle`/`textAnchor` props are deliberately ignored — this tick is
  // always horizontal and centered.
  return (
    <text x={tickX} y={tickY} fill={AXIS_TICK.fill} fontSize={10} textAnchor="middle">
      {lines.map((line, i) => (
        <tspan x={tickX} key={i} dy={i === 0 ? "1.15em" : "1.2em"}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

/** Empty-state copy shared by both dashboard chart panels. */
export function ChartEmpty() {
  return <p className="text-sm text-ink-400 py-8 text-center">No applications yet.</p>;
}
