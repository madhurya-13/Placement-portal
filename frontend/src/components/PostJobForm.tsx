// src/components/PostJobForm.tsx
import { useState, useEffect } from "react";
import * as companyApi from "../api/company";
import * as jobsApi from "../api/jobs";
import type { Company } from "../types";

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

  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Post a Job</h2>
        <p className="text-sm text-gray-500">Create a company first before posting jobs.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Post a Job</h2>
      {message && <p className="text-sm mb-3 text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <select
          value={form.company_id}
          onChange={(e) => setForm({ ...form, company_id: Number(e.target.value) })}
          className="border rounded px-3 py-2 col-span-2"
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Job Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border rounded px-3 py-2 col-span-2"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded px-3 py-2 col-span-2"
          required
        />
        <input
          type="number"
          placeholder="CTC (optional)"
          value={form.ctc}
          onChange={(e) => setForm({ ...form, ctc: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          placeholder="Eligibility criteria (optional)"
          value={form.eligibility_criteria}
          onChange={(e) => setForm({ ...form, eligibility_criteria: e.target.value })}
          className="border rounded px-3 py-2 col-span-2"
        />
        <button type="submit" className="col-span-2 bg-green-600 text-white rounded py-2 font-semibold">
          Post Job
        </button>
      </form>
    </div>
  );
}