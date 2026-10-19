// src/components/RecruiterStatsPanel.tsx
// Placement statistics for THIS recruiter's jobs: application statuses,
// applicant counts and per-company application volume, as graphs.
// Styling comes from the shared chart kit so it matches the officer dashboard.
import { useState, useEffect } from "react";
import { Briefcase, Users, Send, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import * as jobsApi from "../api/jobs";
import type { RecruiterStats } from "../types";
import Card from "./ui/Card";
import StatTile from "./ui/StatTile";
import PageHeader from "./ui/PageHeader";
import {
  STATUS_COLORS,
  AXIS_TICK,
  AXIS_LINE,
  TOOLTIP_STYLE,
  BAR_COLOR,
  LEGEND_HEIGHT,
} from "./ui/chartConstants";
import { ChartPanel, DonutCenter, ChartEmpty, WrappedTick } from "./ui/ChartTheme";

export default function RecruiterStatsPanel({ refreshKey = 0 }: { refreshKey?: number }) {
  const [stats, setStats] = useState<RecruiterStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    jobsApi.getRecruiterStats().then((res) => {
      if (!cancelled) setStats(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (!stats) {
    return (
      <Card>
        <p className="text-sm text-ink-400">Loading statistics...</p>
      </Card>
    );
  }

  const statusData = Object.entries(stats.applications_by_status).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <Card>
      <PageHeader
        title="Placement Statistics"
        subtitle="How students are moving through your job postings"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        <StatTile label="Jobs Posted" value={stats.total_jobs} icon={Briefcase} />
        <StatTile label="Approved" value={stats.approved_jobs} icon={CheckCircle2} />
        <StatTile label="Pending Approval" value={stats.pending_jobs} icon={Clock} />
        <StatTile label="Applicants" value={stats.distinct_applicants} icon={Users} />
        <StatTile label="Applications" value={stats.total_applications} icon={Send} />
        <StatTile label="Placement Rate" value={`${stats.placement_rate_percent}%`} icon={TrendingUp} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <ChartPanel title="Applications by Status" meta={`${stats.total_applications} total`}>
          {stats.total_applications === 0 ? (
            <ChartEmpty />
          ) : (
            <div className="relative">
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={44}
                    outerRadius={72}
                    paddingAngle={3}
                    cornerRadius={4}
                    label={({ value }) => `${value}`}
                    labelLine={{ stroke: "rgba(255,255,255,0.3)", strokeWidth: 1 }}
                    stroke="none"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#999"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, color: "#e8e8e8", height: LEGEND_HEIGHT }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
              <DonutCenter value={stats.total_applications} caption="total" />
            </div>
          )}
        </ChartPanel>

        <ChartPanel title="Your Companies by Applications" meta="top 5">
          {stats.top_companies_by_applications.length === 0 ? (
            <ChartEmpty />
          ) : (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart
                data={stats.top_companies_by_applications}
                margin={{ top: 10, right: 8, left: -14, bottom: 0 }}
              >
                <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis
                  dataKey="company"
                  tick={WrappedTick}
                  axisLine={AXIS_LINE}
                  tickLine={false}
                  interval={0}
                  height={44}
                />
                <YAxis allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.06)" }}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Bar
                  dataKey="applications"
                  fill={BAR_COLOR}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={64}
                  label={{ fill: "#fafafa", fontSize: 12, fontWeight: 700, position: "top" }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartPanel>
      </div>
    </Card>
  );
}
