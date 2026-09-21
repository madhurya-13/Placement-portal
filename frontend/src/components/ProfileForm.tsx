// src/components/ProfileForm.tsx
import { useState, useEffect } from "react";
import * as studentApi from "../api/student";
import type { StudentProfile } from "../types";
import Card from "./ui/Card";
import Button from "./ui/Button";
import PageHeader from "./ui/PageHeader";

export default function ProfileForm() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [form, setForm] = useState({ full_name: "", branch: "", batch_year: 2026, cgpa: 0, phone: "" });
  const [exists, setExists] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    studentApi
      .getMyProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          full_name: res.data.full_name,
          branch: res.data.branch,
          batch_year: res.data.batch_year,
          cgpa: res.data.cgpa,
          phone: res.data.phone || "",
        });
        setExists(true);
      })
      .catch(() => setExists(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = exists ? await studentApi.updateMyProfile(form) : await studentApi.createMyProfile(form);
    setProfile(res.data);
    setExists(true);
    setMessage("Profile saved successfully.");
  }

  const inputClass =
    "bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-white/40 transition-colors";

  return (
    <Card>
      <PageHeader title="Profile" subtitle="Manage your profile information" />
      {message && <p className="text-accent-green text-xs mb-3">{message}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <input
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className={`${inputClass} col-span-2`}
          required
        />
        <input
          placeholder="Branch"
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
          className={inputClass}
          required
        />
        <input
          type="number"
          placeholder="Batch Year"
          value={form.batch_year}
          onChange={(e) => setForm({ ...form, batch_year: Number(e.target.value) })}
          className={inputClass}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="CGPA"
          value={form.cgpa}
          onChange={(e) => setForm({ ...form, cgpa: Number(e.target.value) })}
          className={inputClass}
          required
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass}
        />
        <Button type="submit" className="col-span-2">
          {exists ? "Update Profile" : "Create Profile"}
        </Button>
      </form>
      {profile?.resume_url && (
        <p className="mt-4 text-xs text-ink-400">
          Resume:{" "}
          <a href={profile.resume_url} target="_blank" rel="noreferrer" className="text-ink-200 underline">
            View uploaded resume
          </a>
        </p>
      )}
    </Card>
  );
}