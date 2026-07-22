// src/components/CreateCompanyForm.tsx
import { useState, useEffect } from "react";
import * as companyApi from "../api/company";
import type { Company } from "../types";

export default function CreateCompanyForm({ onCompanyCreated }: { onCompanyCreated: () => void }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState({ name: "", description: "", website: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    companyApi.getMyCompanies().then((res) => setCompanies(res.data));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await companyApi.createCompany(form);
      setCompanies((prev) => [...prev, res.data]);
      setForm({ name: "", description: "", website: "" });
      setMessage("Company created successfully.");
      onCompanyCreated();
    } catch (err) {
      const detail =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setMessage(detail || "Failed to create company.");
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Your Companies</h2>
      {message && <p className="text-sm mb-3 text-blue-600">{message}</p>}

      <ul className="mb-4 space-y-1">
        {companies.map((c) => (
          <li key={c.id} className="text-sm text-gray-700">
            • {c.name}
          </li>
        ))}
        {companies.length === 0 && <li className="text-sm text-gray-500">No companies yet.</li>}
      </ul>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <input
          placeholder="Company Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded px-3 py-2 col-span-2"
          required
        />
        <input
          placeholder="Website (optional)"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className="border rounded px-3 py-2 col-span-2"
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded px-3 py-2 col-span-2"
        />
        <button type="submit" className="col-span-2 bg-blue-600 text-white rounded py-2 font-semibold">
          Create Company
        </button>
      </form>
    </div>
  );
}