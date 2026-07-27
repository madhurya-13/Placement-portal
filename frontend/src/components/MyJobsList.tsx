// src/components/MyJobsList.tsx
import { useState, useEffect } from "react";
import * as jobsApi from "../api/jobs";
import type { Job } from "../types";
import Card from "./ui/Card";
import Button from "./ui/Button";
import PageHeader from "./ui/PageHeader";
import ApplicantsPanel from "./ApplicantsPanel";

export default function MyJobsList({ refreshKey }: { refreshKey: number }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", ctc: "", deadline: "" });

  function loadJobs() {
    jobsApi.getMyJobs().then((res) => setJobs(res.data));
  }

  useEffect(() => {
    loadJobs();
  }, [refreshKey]);

  async function handleDelete(jobId: number) {
    if (!confirm("Delete this job posting?")) return;
    await jobsApi.deleteJob(jobId);
    loadJobs();
  }

  function startEdit(job: Job) {
    setEditingJobId(job.id);
    setEditForm({ title: job.title, ctc: job.ctc?.toString() || "", deadline: job.deadline.split("T")[0] });
  }

  async function saveEdit(jobId: number) {
    await jobsApi.updateJob(jobId, {
      title: editForm.title,
      ctc: editForm.ctc ? Number(editForm.ctc) : undefined,
      deadline: editForm.deadline ? new Date(editForm.deadline).toISOString() : undefined,
    });
    setEditingJobId(null);
    loadJobs();
  }

  const inputClass =
    "bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-ink-50 w-full focus:outline-none focus:border-white/40";

  return (
    <Card>
      <PageHeader title="My Posted Jobs" />
      {jobs.length === 0 && <p className="text-ink-400 text-sm">You haven't posted any jobs yet.</p>}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            {editingJobId === job.id ? (
              <div className="space-y-2">
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="number"
                  value={editForm.ctc}
                  onChange={(e) => setEditForm({ ...editForm, ctc: e.target.value })}
                  className={inputClass}
                  placeholder="CTC"
                />
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                  className={inputClass}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveEdit(job.id)}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingJobId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm text-ink-50">{job.title}</h3>
                    <p className="text-xs text-ink-400">
                      {job.company.name}
                      {job.ctc ? ` · CTC ${job.ctc}` : ""}
                    </p>
                    <p className="text-[11px] text-ink-400 mt-1">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <button onClick={() => startEdit(job)} className="text-accent-blue">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(job.id)} className="text-accent-red">
                      Delete
                    </button>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-3 bg-white/5"
                  onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                >
                  {expandedJobId === job.id ? "Hide Applicants" : "View Applicants"}
                </Button>
                {expandedJobId === job.id && <ApplicantsPanel jobId={job.id} />}
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}