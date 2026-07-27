// src/components/PostJobForm.tsx
import { useState, useEffect } from "react";
import * as companyApi from "../api/company";
import * as jobsApi from "../api/jobs";
import type { Company } from "../types";
import Card from "./ui/Card";
import Button from "./ui/Button";
import PageHeader from "./ui/PageHeader";

export default function PostJobForm({ onJobPosted }: { onJobPosted: () => void }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState({
    company_id: 0,
    title: "",
    description: "",
    ctc: "",
    eligibility_criteria: "",
    deadline: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    companyApi.getMyCompanies().then((res) => {
      setCompanies(res.data);
      if (res.data.length > 0) setForm((f) => ({ ...f, company_id: res.data[0].id }));
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      await jobsApi.createJob({
        company_id: form.company_id,
        title: form.title,
        description: form.description,
        ctc: form.ctc ? Number(form.ctc) : undefined,
        eligibility_criteria: form.eligibility_criteria || undefined,
        deadline: new Date(form.deadline).toISOString(),
      });
      setMessage("Job posted successfully.");
      setForm({ ...form, title: "", description: "", ctc: "", eligibility_criteria: "", deadline: "" });
      onJobPosted();
    } catch {
      setMessage("Failed to post job. Make sure you've created a company first.");
    }
  }

  const inputClass =
    "bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-white/40 transition-colors";

  if (companies.length === 0) {
    return (
      <Card>
        <PageHeader title="Post a Job" />
        <p className="text-sm text-ink-400">Create a company first before posting jobs.</p>
      </Card>
    );
  }

  return (
    <Card>
      <PageHeader title="Post a Job" />
      {message && <p className="text-xs mb-3 text-accent-blue">{message}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <select
          value={form.company_id}
          onChange={(e) => setForm({ ...form, company_id: Number(e.target.value) })}
          className={`${inputClass} col-span-2`}
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id} className="bg-ink-900">
              {c.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Job Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={`${inputClass} col-span-2`}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`${inputClass} col-span-2`}
          required
        />
        <input
          type="number"
          placeholder="CTC (optional)"
          value={form.ctc}
          onChange={(e) => setForm({ ...form, ctc: e.target.value })}
          className={inputClass}
        />
        <input
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          className={inputClass}
          required
        />
        <input
          placeholder="Eligibility criteria (optional)"
          value={form.eligibility_criteria}
          onChange={(e) => setForm({ ...form, eligibility_criteria: e.target.value })}
          className={`${inputClass} col-span-2`}
        />
        <Button type="submit" variant="success" className="col-span-2">
          Post Job
        </Button>
      </form>
    </Card>
  );
}