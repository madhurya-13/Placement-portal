// src/components/StatsPanel.tsx
import { useState, useEffect } from "react";
import { Users, Building2, Briefcase, FileText, Clock, Send, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import * as officerApi from "../api/officer";
import type { PlacementStats } from "../types";
import Card from "./ui/Card";
import StatTile from "./ui/StatTile";
import PageHeader from "./ui/PageHeader";

const STATUS_COLORS: Record<string, string> = {
  applied: "#e8c07d",
  shortlisted: "#8aa8d9",
  rejected: "#d98a8a",
  selected: "#8ec98a",
};

export default function StatsPanel() {
  const [stats, setStats] = useState<PlacementStats | null>(null);

  useEffect(() => {
    officerApi.getStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return (
      <Card>
        <p className="text-sm text-ink-400">Loading statistics...</p>
      </Card>
    );
  }

  const statusData = Object.entries(stats.applications_by_status).map(([key, value]) => ({ name: key, value }));

  return (
    <Card>
      <PageHeader title="Placement Statistics" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label="Students" value={stats.total_students} icon={Users} />
        <StatTile label="Recruiters" value={stats.total_recruiters} icon={Users} />
        <StatTile label="Companies" value={stats.total_companies} icon={Building2} />
        <StatTile label="Jobs" value={stats.total_jobs} icon={Briefcase} />
        <StatTile label="Applications" value={stats.total_applications} icon={Send} />
        <StatTile label="Pending Recruiters" value={stats.pending_recruiters} icon={Clock} />
        <StatTile label="Pending Jobs" value={stats.pending_jobs} icon={FileText} />
        <StatTile label="Placement Rate" value={`${stats.placement_rate_percent}%`} icon={TrendingUp} />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <h3 className="text-xs font-semibold text-ink-200 mb-2">Applications by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={75} label>
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#999"} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#2e2e2e", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#d5d5d5" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-ink-200 mb-2">Top Companies by Applications</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.top_companies_by_applications}>
              <XAxis dataKey="company" tick={{ fontSize: 10, fill: "#b0b0b0" }} />
              <YAxis allowDecimals={false} tick={{ fill: "#b0b0b0" }} />
              <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{ background: "#2e2e2e", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8 }}
              />
              <Bar dataKey="applications" fill="#e8e8e8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}