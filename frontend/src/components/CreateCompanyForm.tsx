// src/components/CreateCompanyForm.tsx
import { useState, useEffect } from "react";
import * as companyApi from "../api/company";
import type { Company } from "../types";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import PageHeader from "./ui/PageHeader";

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

  const inputClass =
    "bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-white/40 transition-colors";

  return (
    <Card>
      <PageHeader title="Your Companies" subtitle="Manage your registered companies" />
      {message && <p className="text-xs mb-3 text-accent-blue">{message}</p>}

      <div className="flex flex-wrap gap-2 mb-4">
        {companies.map((c) => (
          <Badge key={c.id} variant="slate">
            {c.name}
          </Badge>
        ))}
        {companies.length === 0 && <p className="text-xs text-ink-400">No companies yet.</p>}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <input
          placeholder="Company Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={`${inputClass} col-span-2`}
          required
        />
        <input
          placeholder="Website (optional)"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className={`${inputClass} col-span-2`}
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`${inputClass} col-span-2`}
        />
        <Button type="submit" className="col-span-2">
          Create Company
        </Button>
      </form>
    </Card>
  );
}