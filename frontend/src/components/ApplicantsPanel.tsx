// src/components/ApplicantsPanel.tsx
import { useState, useEffect } from "react";
import * as applicationsApi from "../api/applications";
import type { Applicant, ApplicationStatus } from "../types";

const statusColors: Record<string, string> = {
  applied: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  selected: "bg-green-100 text-green-800",
};

export default function ApplicantsPanel({ jobId }: { jobId: number }) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  function loadApplicants() {
    applicationsApi.getApplicantsForJob(jobId).then((res) => setApplicants(res.data));
  }

  useEffect(() => {
    loadApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadApplicants is stable and only depends on jobId, which is already listed
  }, [jobId]);

  async function handleStatusChange(applicationId: number, newStatus: ApplicationStatus) {
    await applicationsApi.updateApplicationStatus(applicationId, newStatus);
    loadApplicants();
  }

  return (
    <div className="mt-3 border-t pt-3 space-y-2">
      {applicants.length === 0 && <p className="text-sm text-gray-500">No applicants yet.</p>}
      {applicants.map((a) => (
        <div key={a.id} className="flex justify-between items-center bg-gray-50 rounded p-3">
          <div>
            <p className="font-medium">{a.student.full_name}</p>
            <p className="text-xs text-gray-500">
              {a.student.branch} • {a.student.batch_year} • CGPA {a.student.cgpa}
            </p>
            {a.student.resume_url && (
              <a href={a.student.resume_url} target="_blank" className="text-xs text-blue-600 underline">
                View Resume
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[a.status]}`}>
              {a.status}
            </span>
            <select
              value={a.status}
              onChange={(e) => handleStatusChange(a.id, e.target.value as ApplicationStatus)}
              className="text-xs border rounded px-2 py-1"
            >
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="selected">Selected</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}