// src/components/ApplicationStatusList.tsx
import { useState, useEffect } from "react";
import * as applicationsApi from "../api/applications";
import type { Application } from "../types";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import PageHeader from "./ui/PageHeader";

const statusVariant: Record<string, "amber" | "blue" | "red" | "green"> = {
  applied: "amber",
  shortlisted: "blue",
  rejected: "red",
  selected: "green",
};

export default function ApplicationStatusList() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    applicationsApi.getMyApplications().then((res) => setApplications(res.data));
  }, []);

  return (
    <Card>
      <PageHeader title="My Applications" />
      {applications.length === 0 && <p className="text-ink-400 text-sm">You haven't applied to any jobs yet.</p>}
      <div className="space-y-2.5">
        {applications.map((app) => (
          <div key={app.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-sm text-ink-50">{app.job.title}</p>
              <p className="text-xs text-ink-400">{app.job.company.name}</p>
            </div>
            <Badge variant={statusVariant[app.status]}>{app.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}