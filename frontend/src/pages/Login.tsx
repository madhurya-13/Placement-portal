// src/pages/Login.tsx
import { useState, type FormEvent, type MouseEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import Button from "../components/ui/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem("remember_login") === "true");
  const [isLoading, setIsLoading] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setCardTilt({ x: y * -8, y: x * 8 });
  }

  function handleMouseLeave() {
    setCardTilt({ x: 0, y: 0 });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    localStorage.setItem("remember_login", String(rememberMe));
    try {
      const loggedInUser = await loginUser(email, password);
      if (loggedInUser.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else if (loggedInUser.role === "placement_officer") {
        navigate("/officer-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setError(error.response.data?.detail ?? "This account is not yet approved.");
      } else if (axios.isAxiosError(error) && !error.response) {
        setError("The server is unavailable. Start the backend and try again.");
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-800/80 via-ink-900 to-ink-950" />
      <div className="auth-orb auth-orb-amber pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-accent-amber/15 blur-3xl" />
      <div className="auth-orb auth-orb-blue pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-accent-blue/15 blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-white/5 blur-[100px] animate-pulse" />

      <div className="relative z-10 w-full max-w-md [perspective:1200px]">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-50 text-ink-950 shadow-xl transition-transform duration-500 hover:rotate-6">
            <BriefcaseBusiness className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <p className="text-lg font-bold tracking-tight text-ink-50">
            Placement<span className="text-ink-200">Hub</span>
          </p>
          <p className="mt-1 text-sm text-ink-400">Your next opportunity starts here.</p>
        </div>

        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative transition-transform duration-300 ease-out"
          style={{ transform: `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)` }}
        >
          <div className="auth-card-beam pointer-events-none absolute -inset-px rounded-3xl" />
          <form
            onSubmit={handleSubmit}
            className="relative rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
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
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-ink-950/40 py-3 pl-10 pr-11 text-sm text-ink-50 outline-none transition-colors placeholder:text-ink-600 focus:border-ink-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-ink-50"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="mb-6 flex items-center justify-between gap-3 text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-ink-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-accent-amber"
              />
              Remember me
            </label>
            <span className="text-ink-600">Secure sign in</span>
          </div>

          <Button
            type="submit"
            size="md"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 py-3"
          >
            {isLoading ? "Signing in..." : "Sign in"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
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
    </div>
  );
}