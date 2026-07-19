// src/components/ApplicationStatusList.tsx
import { useState, useEffect } from "react";
import * as applicationsApi from "../api/applications";
import type { Application } from "../types";

const statusColors: Record<string, string> = {
  applied: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  selected: "bg-green-100 text-green-800",
};

export default function ApplicationStatusList() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    applicationsApi.getMyApplications().then((res) => setApplications(res.data));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">My Applications</h2>
      {applications.length === 0 && <p className="text-gray-500">You haven't applied to any jobs yet.</p>}
      <div className="space-y-3">
        {applications.map((app) => (
          <div key={app.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{app.job.title}</p>
              <p className="text-sm text-gray-500">{app.job.company.name}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[app.status]}`}>
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}