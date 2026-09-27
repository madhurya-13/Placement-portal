// src/pages/Register.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, LockKeyhole, Mail, UserRound } from "lucide-react";
import axios from "axios";
import * as authApi from "../api/auth";
import Button from "../components/ui/Button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "recruiter">("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await authApi.register(email, password, role);
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setError(error.response.data?.detail ?? "An account with this email already exists.");
      } else if (axios.isAxiosError(error) && !error.response) {
        setError("The server is unavailable. Start the backend and try again.");
      } else {
        setError("Registration failed. Please check your details and try again.");
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-5 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent-amber/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-accent-blue/15 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-50 text-ink-950 shadow-xl">
            <BriefcaseBusiness className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <p className="text-lg font-bold tracking-tight text-ink-50">
            Placement<span className="text-ink-200">Hub</span>
          </p>
          <p className="mt-1 text-sm text-ink-400">Your next opportunity starts here.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          <div className="mb-7">
            <h1 className="text-2xl font-semibold text-ink-50">Create your account</h1>
            <p className="mt-1 text-sm text-ink-400">Join PlacementHub and get started.</p>
          </div>

          {error && (
            <p className="mb-5 rounded-xl border border-accent-red/30 bg-accent-red/10 px-3 py-2.5 text-sm text-accent-red">
              {error}
            </p>
          )}

          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-400" htmlFor="role">
            Account type
          </label>
          <div className="relative mb-5">
            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "student" | "recruiter")}
              className="w-full appearance-none rounded-xl border border-white/15 bg-ink-950/40 py-3 pl-10 pr-3 text-sm text-ink-50 outline-none transition-colors focus:border-ink-200"
            >
              <option className="bg-ink-900" value="student">Student</option>
              <option className="bg-ink-900" value="recruiter">Recruiter</option>
            </select>
          </div>

          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-400" htmlFor="email">
            Email address
          </label>
          <div className="relative mb-5">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-ink-950/40 py-3 pl-10 pr-3 text-sm text-ink-50 outline-none transition-colors placeholder:text-ink-600 focus:border-ink-200"
              required
            />
          </div>

          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-400" htmlFor="password">
            Password
          </label>
          <div className="relative mb-7">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-ink-950/40 py-3 pl-10 pr-3 text-sm text-ink-50 outline-none transition-colors placeholder:text-ink-600 focus:border-ink-200"
              required
            />
          </div>

          <Button type="submit" size="md" className="flex w-full items-center justify-center gap-2 py-3">
            Create account
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="mt-6 text-center text-sm text-ink-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-ink-50 transition-colors hover:text-accent-amber">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}