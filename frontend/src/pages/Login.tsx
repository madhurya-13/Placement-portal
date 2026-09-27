// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../context/useAuth";
import Button from "../components/ui/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const loggedInUser = await loginUser(email, password);
      if (loggedInUser.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else if (loggedInUser.role === "placement_officer") {
        navigate("/officer-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Invalid email or password.");
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
            <h1 className="text-2xl font-semibold text-ink-50">Welcome back</h1>
            <p className="mt-1 text-sm text-ink-400">Sign in to continue to your dashboard.</p>
          </div>

          {error && (
            <p className="mb-5 rounded-xl border border-accent-red/30 bg-accent-red/10 px-3 py-2.5 text-sm text-accent-red">
              {error}
            </p>
          )}

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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-ink-950/40 py-3 pl-10 pr-3 text-sm text-ink-50 outline-none transition-colors placeholder:text-ink-600 focus:border-ink-200"
              required
            />
          </div>

          <Button type="submit" size="md" className="flex w-full items-center justify-center gap-2 py-3">
            Sign in
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="mt-6 text-center text-sm text-ink-400">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold text-ink-50 transition-colors hover:text-accent-amber">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}