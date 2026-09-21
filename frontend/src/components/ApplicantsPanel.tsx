// src/components/ApplicantsPanel.tsx
import { useState, useEffect } from "react";
import * as applicationsApi from "../api/applications";
import type { Applicant, ApplicationStatus } from "../types";
import Badge from "./ui/Badge";

const statusVariant: Record<string, "amber" | "blue" | "red" | "green"> = {
  applied: "amber",
  shortlisted: "blue",
  rejected: "red",
  selected: "green",
};

export default function ApplicantsPanel({ jobId }: { jobId: number }) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  function loadApplicants() {
    applicationsApi.getApplicantsForJob(jobId).then((res) => setApplicants(res.data));
  }

  useEffect(() => {
    loadApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadApplicants is stable and only depends on jobId, already listed
  }, [jobId]);

  async function handleStatusChange(applicationId: number, newStatus: ApplicationStatus) {
    await applicationsApi.updateApplicationStatus(applicationId, newStatus);
    loadApplicants();
  }

  return (
    <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
      {applicants.length === 0 && <p className="text-xs text-ink-400">No applicants yet.</p>}
      {applicants.map((a) => (
        <div key={a.id} className="flex justify-between items-center bg-white/5 rounded-xl p-3">
          <div>
            <p className="text-sm font-medium text-ink-50">{a.student.full_name}</p>
            <p className="text-[11px] text-ink-400">
              {a.student.branch} • {a.student.batch_year} • CGPA {a.student.cgpa}
            </p>
            {a.student.resume_url && (
              <a href={a.student.resume_url} target="_blank" rel="noreferrer" className="text-[11px] text-accent-blue underline">
                View Resume
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant[a.status]}>{a.status}</Badge>
            <select
              value={a.status}
              onChange={(e) => handleStatusChange(a.id, e.target.value as ApplicationStatus)}
              className="text-xs bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-ink-50"
            >
              <option value="applied" className="bg-ink-900">Applied</option>
              <option value="shortlisted" className="bg-ink-900">Shortlisted</option>
              <option value="rejected" className="bg-ink-900">Rejected</option>
              <option value="selected" className="bg-ink-900">Selected</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}