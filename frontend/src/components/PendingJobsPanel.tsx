// src/components/PendingJobsPanel.tsx
import { useState, useEffect } from "react";
import * as officerApi from "../api/officer";
import type { Job } from "../types";
import Card from "./ui/Card";
import Button from "./ui/Button";
import PageHeader from "./ui/PageHeader";

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
    <Card>
      <PageHeader title="Pending Job Approvals" />
      {jobs.length === 0 && <p className="text-sm text-ink-400">No pending jobs.</p>}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h3 className="font-semibold text-sm text-ink-50">{job.title}</h3>
            <p className="text-xs text-ink-400">{job.company.name}</p>
            <p className="text-xs text-ink-200 mt-1.5">{job.description}</p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="success" onClick={() => handleDecision(job.id, "approved")}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => handleDecision(job.id, "rejected")}>Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}