// src/components/JobsList.tsx
import { useState, useEffect } from "react";
import * as jobsApi from "../api/jobs";
import * as applicationsApi from "../api/applications";
import type { Job } from "../types";

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
  const message =
    err && typeof err === "object" && "response" in err
      ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
      : undefined;
  setMessage((m) => ({ ...m, [jobId]: message || "Failed to apply." }));
}
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Open Jobs</h2>
      {jobs.length === 0 && <p className="text-gray-500">No open jobs right now.</p>}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="border rounded p-4">
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company.name}</p>
            <p className="text-sm mt-1">{job.description}</p>
            {job.ctc && <p className="text-sm mt-1">CTC: {job.ctc}</p>}
            <p className="text-xs text-gray-400 mt-1">Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
            <button
              onClick={() => handleApply(job.id)}
              className="mt-3 bg-green-600 text-white rounded px-4 py-1.5 text-sm"
            >
              Apply
            </button>
            {message[job.id] && <p className="text-sm mt-2 text-blue-600">{message[job.id]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}