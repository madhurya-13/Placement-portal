// src/components/ResumeUpload.tsx
import { useState } from "react";
import * as studentApi from "../api/student";
import Card from "./ui/Card";
import Button from "./ui/Button";
import PageHeader from "./ui/PageHeader";

const ALLOWED = ["pdf", "doc", "docx"];
const MAX_SIZE_MB = 5;

interface ResumeUploadProps {
  /** Called after a successful upload so sibling sections (Profile link) refetch. */
  onUploaded?: () => void;
}

export default function ResumeUpload({ onUploaded }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] || null;
    setFile(picked);
    setStatus(null);
    if (!picked) return;
    // Mirror the backend's rules so users learn before the round trip.
    const ext = picked.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED.includes(ext)) {
      setStatus({ kind: "error", text: "Only PDF/DOC/DOCX files are allowed." });
      return;
    }
    if (picked.size > MAX_SIZE_MB * 1024 * 1024) {
      setStatus({ kind: "error", text: `File is too large — max ${MAX_SIZE_MB}MB.` });
    }
  }

  async function handleUpload() {
    if (!file || status?.kind === "error") return;
    setUploading(true);
    setStatus({ kind: "ok", text: "Uploading..." });
    try {
      await studentApi.uploadResume(file);
      setStatus({ kind: "ok", text: "Resume uploaded successfully." });
      setFile(null);
      // Reset the file input so the same file can be re-selected later.
      const input = document.querySelector<HTMLInputElement>('input[type="file"]');
      if (input) input.value = "";
      onUploaded?.();
    } catch {
      setStatus({ kind: "error", text: "Upload failed. Only PDF/DOC/DOCX allowed, max 5MB." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card>
      <PageHeader title="Upload Resume" subtitle="PDF, DOC or DOCX — up to 5MB" />
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={pickFile}
          className="text-xs text-ink-200 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:bg-white/10 file:text-ink-50 file:text-xs"
        />
        <Button onClick={handleUpload} size="sm" disabled={!file || uploading || status?.kind === "error"}>
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {status && (
        <p
          role={status.kind === "error" ? "alert" : "status"}
          className={`mt-3 text-xs ${status.kind === "error" ? "text-accent-red" : "text-accent-green"}`}
        >
          {status.text}
        </p>
      )}
    </Card>
  );
}
