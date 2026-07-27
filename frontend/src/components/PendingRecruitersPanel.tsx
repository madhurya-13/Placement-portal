// src/components/PendingRecruitersPanel.tsx
import { useState, useEffect } from "react";
import * as officerApi from "../api/officer";
import type { PendingRecruiter } from "../types";
import Card from "./ui/Card";
import Button from "./ui/Button";
import PageHeader from "./ui/PageHeader";

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
    <Card>
      <PageHeader title="Pending Recruiter Approvals" />
      {recruiters.length === 0 && <p className="text-sm text-ink-400">No pending recruiters.</p>}
      <div className="space-y-2.5">
        {recruiters.map((r) => (
          <div key={r.id} className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl p-3">
            <span className="text-sm text-ink-50">{r.email}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="success" onClick={() => handleApprove(r.id)}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => handleReject(r.id)}>Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}