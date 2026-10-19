// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import * as authApi from "../api/auth";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { inputClass } from "../components/ui/inputClass";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "recruiter">("student");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await authApi.register(email, password, role);
      navigate("/login");
    } catch (err) {
      // Surface the API's own detail message when there is one
      // (e.g. "An account with this email already exists.").
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setError(err.response.data?.detail ?? "An account with this email already exists.");
      } else if (axios.isAxiosError(err) && !err.response) {
        setError("The server is unavailable. Start the backend and try again.");
      } else {
        setError("Registration failed. Please check your details and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Card>
          <span className="font-bold text-[15px] text-ink-50">
            Placement<span className="text-ink-200">Hub</span>
          </span>
          <PageHeader title="Register" subtitle="Create an account to get started" />

          {error && <p className="text-accent-red text-xs mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block">
              <span className="block text-xs text-ink-400 mb-1.5">I am a:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "student" | "recruiter")}
                className={`${inputClass} w-full`}
              >
                <option value="student" className="bg-ink-900 text-ink-50">
                  Student
                </option>
                <option value="recruiter" className="bg-ink-900 text-ink-50">
                  Recruiter
                </option>
              </select>
            </label>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputClass} w-full`}
              required
            />
            <input
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} w-full`}
              required
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting
                ? "Creating account..."
                : `Register as ${role === "student" ? "Student" : "Recruiter"}`}
            </Button>
          </form>

          <p className="text-sm text-ink-400 mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-ink-200 underline hover:text-ink-50 transition-colors">
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
