// src/components/PendingRecruitersPanel.tsx
import { useState, useEffect } from "react";
import * as officerApi from "../api/officer";
import type { PendingRecruiter } from "../types";

export default function PendingRecruitersPanel() {
  const [recruiters, setRecruiters] = useState<PendingRecruiter[]>([]);

  function load() {
    officerApi.getPendingRecruiters().then((res) => setRecruiters(res.data));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleApprove(id: number) {
    await officerApi.approveRecruiter(id);
    load();
  }

  async function handleReject(id: number) {
    await officerApi.rejectRecruiter(id);
    load();
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Pending Recruiter Approvals</h2>
      {recruiters.length === 0 && <p className="text-gray-500">No pending recruiters.</p>}
      <div className="space-y-2">
        {recruiters.map((r) => (
          <div key={r.id} className="flex justify-between items-center border rounded p-3">
            <span>{r.email}</span>
            <div className="flex gap-2">
              <button onClick={() => handleApprove(r.id)} className="bg-green-600 text-white rounded px-3 py-1 text-sm">
                Approve
              </button>
              <button onClick={() => handleReject(r.id)} className="bg-red-600 text-white rounded px-3 py-1 text-sm">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}