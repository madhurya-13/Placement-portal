// src/components/StatsPanel.tsx
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import * as officerApi from "../api/officer";
import type { PlacementStats } from "../types";

const STATUS_COLORS: Record<string, string> = {
  applied: "#facc15",
  shortlisted: "#3b82f6",
  rejected: "#ef4444",
  selected: "#22c55e",
};

export default function StatsPanel() {
  const [stats, setStats] = useState<PlacementStats | null>(null);

  useEffect(() => {
    officerApi.getStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <div className="bg-white rounded-lg shadow p-6">Loading statistics...</div>;

  const statusData = Object.entries(stats.applications_by_status).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Placement Statistics</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Students" value={stats.total_students} />
        <StatCard label="Recruiters" value={stats.total_recruiters} />
        <StatCard label="Companies" value={stats.total_companies} />
        <StatCard label="Jobs" value={stats.total_jobs} />
        <StatCard label="Applications" value={stats.total_applications} />
        <StatCard label="Pending Recruiters" value={stats.pending_recruiters} />
        <StatCard label="Pending Jobs" value={stats.pending_jobs} />
        <StatCard label="Placement Rate" value={`${stats.placement_rate_percent}%`} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2 text-gray-700">Applications by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80} label>
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#999"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-gray-700">Top Companies by Applications</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.top_companies_by_applications}>
              <XAxis dataKey="company" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="applications" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-gray-50 rounded p-4 text-center">
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}