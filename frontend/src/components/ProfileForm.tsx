// src/components/ProfileForm.tsx
import { useState, useEffect } from "react";
import * as studentApi from "../api/student";
import type { StudentProfile } from "../types";

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
    const res = exists
      ? await studentApi.updateMyProfile(form)
      : await studentApi.createMyProfile(form);
    setProfile(res.data);
    setExists(true);
    setMessage("Profile saved successfully.");
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Profile</h2>
      {message && <p className="text-green-600 text-sm mb-3">{message}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className="border rounded px-3 py-2 col-span-2"
          required
        />
        <input
          placeholder="Branch"
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          placeholder="Batch Year"
          value={form.batch_year}
          onChange={(e) => setForm({ ...form, batch_year: Number(e.target.value) })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="CGPA"
          value={form.cgpa}
          onChange={(e) => setForm({ ...form, cgpa: Number(e.target.value) })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <button type="submit" className="col-span-2 bg-blue-600 text-white rounded py-2 font-semibold">
          {exists ? "Update Profile" : "Create Profile"}
        </button>
      </form>
      {profile?.resume_url && (
        <p className="mt-4 text-sm text-gray-600">
          Resume: <a href={profile.resume_url} target="_blank" className="text-blue-600 underline">View uploaded resume</a>
        </p>
      )}
    </div>
  );
}