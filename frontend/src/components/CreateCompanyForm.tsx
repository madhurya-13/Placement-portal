// src/components/CreateCompanyForm.tsx
import { useState, useEffect } from "react";
import * as companyApi from "../api/company";
import type { Company } from "../types";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import PageHeader from "./ui/PageHeader";
import { inputClass } from "./ui/inputClass";

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
    <Card>
      <PageHeader title="Your Companies" subtitle="Manage your registered companies" />
      {message && <p className="text-xs mb-3 text-accent-cyan">{message}</p>}

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