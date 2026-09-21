// src/components/JobsList.tsx
import { useState, useEffect } from "react";
import { Briefcase, IndianRupee, Calendar } from "lucide-react";
import * as jobsApi from "../api/jobs";
import * as applicationsApi from "../api/applications";
import type { Job } from "../types";
import Card from "./ui/Card";
import Button from "./ui/Button";
import PageHeader from "./ui/PageHeader";

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [message, setMessage] = useState<Record<number, string>>({});

  useEffect(() => {
    jobsApi.listJobs().then((res) => setJobs(res.data));
  }, []);

  async function handleApply(jobId: number) {
    try {
      await applicationsApi.applyToJob(jobId);
      setMessage((m) => ({ ...m, [jobId]: "Applied!" }));
    } catch (err) {
      const detail =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setMessage((m) => ({ ...m, [jobId]: detail || "Failed to apply." }));
    }
  }

  return (
    <Card>
      <PageHeader title="Open Jobs" subtitle={`${jobs.length} of ${jobs.length} drives`} />
      {jobs.length === 0 && <p className="text-ink-400 text-sm">No open jobs right now.</p>}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-ink-50 flex items-center justify-center shrink-0">
                <Briefcase className="w-4.5 h-4.5 text-ink-950" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-ink-50">{job.title}</h3>
                <p className="text-xs text-ink-400">{job.company.name}</p>
                <p className="text-xs text-ink-200 mt-1.5">{job.description}</p>
                <div className="flex flex-wrap gap-3 text-[11px] text-ink-400 mt-2">
                  {job.ctc && (
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" /> {job.ctc}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>
                <Button size="sm" className="mt-3" onClick={() => handleApply(job.id)}>
                  Apply
                </Button>
                {message[job.id] && <p className="text-xs mt-2 text-accent-blue">{message[job.id]}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}