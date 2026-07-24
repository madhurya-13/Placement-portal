// src/components/PendingJobsPanel.tsx
import { useState, useEffect } from "react";
import * as officerApi from "../api/officer";
import type { Job } from "../types";

export default function PendingJobsPanel() {
  const [jobs, setJobs] = useState<Job[]>([]);

  function load() {
    officerApi.getPendingJobs().then((res) => setJobs(res.data));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDecision(jobId: number, decision: "approved" | "rejected") {
    await officerApi.updateJobApproval(jobId, decision);
    load();
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Pending Job Approvals</h2>
      {jobs.length === 0 && <p className="text-gray-500">No pending jobs.</p>}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="border rounded p-4">
            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company.name}</p>
            <p className="text-sm mt-1">{job.description}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleDecision(job.id, "approved")}
                className="bg-green-600 text-white rounded px-3 py-1 text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => handleDecision(job.id, "rejected")}
                className="bg-red-600 text-white rounded px-3 py-1 text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}