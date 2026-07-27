// src/components/ResumeUpload.tsx
import { useState } from "react";
import * as studentApi from "../api/student";
import Card from "./ui/Card";
import Button from "./ui/Button";
import PageHeader from "./ui/PageHeader";

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
    <Card>
      <PageHeader title="Upload Resume" />
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-xs text-ink-200 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:bg-white/10 file:text-ink-50 file:text-xs"
        />
        <Button onClick={handleUpload} size="sm">
          Upload
        </Button>
      </div>
      {status && <p className="mt-3 text-xs text-ink-400">{status}</p>}
    </Card>
  );
}