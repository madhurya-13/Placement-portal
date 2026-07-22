// src/components/MyJobsList.tsx
import { useState, useEffect } from "react";
import * as jobsApi from "../api/jobs";
import type { Job } from "../types";
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
    setEditForm({
      title: job.title,
      ctc: job.ctc?.toString() || "",
      deadline: job.deadline.split("T")[0], // convert ISO datetime to yyyy-mm-dd for the input
    });
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">My Posted Jobs</h2>
      {jobs.length === 0 && <p className="text-gray-500">You haven't posted any jobs yet.</p>}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="border rounded p-4">
            {editingJobId === job.id ? (
              <div className="space-y-2">
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
                <input
                  type="number"
                  value={editForm.ctc}
                  onChange={(e) => setEditForm({ ...editForm, ctc: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="CTC"
                />
                <input
                  type="date"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(job.id)} className="bg-blue-600 text-white rounded px-3 py-1 text-sm">
                    Save
                  </button>
                  <button onClick={() => setEditingJobId(null)} className="bg-gray-300 rounded px-3 py-1 text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company.name}</p>
                    {job.ctc && <p className="text-sm">CTC: {job.ctc}</p>}
                    <p className="text-xs text-gray-400">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(job)} className="text-sm text-blue-600 underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(job.id)} className="text-sm text-red-600 underline">
                      Delete
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                  className="mt-3 text-sm bg-gray-100 rounded px-3 py-1"
                >
                  {expandedJobId === job.id ? "Hide Applicants" : "View Applicants"}
                </button>
                {expandedJobId === job.id && <ApplicantsPanel jobId={job.id} />}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}