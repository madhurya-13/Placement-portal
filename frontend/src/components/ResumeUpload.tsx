// src/components/ResumeUpload.tsx
import { useState } from "react";
import * as studentApi from "../api/student";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  async function handleUpload() {
    if (!file) return;
    setStatus("Uploading...");
    try {
      await studentApi.uploadResume(file);
      setStatus("Resume uploaded successfully.");
    } catch {
      setStatus("Upload failed. Only PDF/DOC/DOCX allowed, max 5MB.");
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Upload Resume</h2>
      <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} className="ml-4 bg-blue-600 text-white rounded px-4 py-2">
        Upload
      </button>
      {status && <p className="mt-3 text-sm text-gray-600">{status}</p>}
    </div>
  );
}