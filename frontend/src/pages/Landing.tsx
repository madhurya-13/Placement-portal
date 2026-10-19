// src/pages/Landing.tsx
// Public landing page — shown at "/" to signed-out visitors.
// No auth required; links out to /login and /register.
// Top section is the shader hero (components/ui/hero); the sections below
// reuse the shared ui components so the whole page matches the dashboards.

import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import ShaderShowcase from "../components/ui/hero";

const STEPS = [
  {
    n: "01",
    title: "Register",
    body: "Students and recruiters sign up in minutes. Recruiter accounts wait for Placement Officer approval before they can post.",
  },
  {
    n: "02",
    title: "Build your side of the desk",
    body: "Students complete a profile and upload a resume. Recruiters register a company and describe the role, CTC and eligibility.",
  },
  {
    n: "03",
    title: "Post and apply",
    body: "Approved jobs go live to every eligible student. One click applies — no duplicate applications, no missed deadlines.",
  },
  {
    n: "04",
    title: "Track it through to an offer",
    body: "Every application moves through Applied, Shortlisted, Selected or Rejected, visible to the student the moment it changes.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-ink-50">
      {/* ---------- Shader hero (nav, CTAs, mesh backdrop) ---------- */}
      <ShaderShowcase />

      {/* ---------- Three tracks ---------- */}
      <section id="features" className="border-y border-white/15">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-16">
          <PageHeader
            title="Built for every side of the desk"
            subtitle="One system, three experiences — students, recruiters and the Placement Office."
          />
          <div className="grid md:grid-cols-3 gap-5">
            <Track
              title="For students"
              body="Keep one profile, one resume, and see exactly where every application stands — no more emailing the placement cell to ask."
              cta="Browse open roles"
              to="/register"
            />
            <Track
              title="For recruiters"
              body="Post a role once it's approved, and manage every applicant's status from a single screen instead of a shared spreadsheet."
              cta="Post your first job"
              to="/register"
            />
            <Track
              title="For the Placement Office"
              body="Approve recruiters and job posts before they reach students, and watch placement rates change in real time."
              cta="Request officer access"
              to="/register"
            />
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" className="max-w-6xl mx-auto px-6 md:px-8 py-20">
        <PageHeader title="Four steps, start to offer letter." />
        <div className="grid md:grid-cols-4 gap-5">
          {STEPS.map((step) => (
            <Card key={step.n}>
              <span className="text-sm text-accent-cyan font-semibold">{step.n}</span>
              <h3 className="font-semibold text-sm text-ink-50 mt-2 mb-2">{step.title}</h3>
              <p className="text-sm text-ink-400 leading-relaxed">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section id="get-started" className="max-w-6xl mx-auto px-6 md:px-8 pb-20">
        <Card className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-xl font-bold text-ink-50 max-w-sm leading-snug">
            Placement season moves fast. Your records should keep up.
          </p>
          <div className="flex gap-3">
            <Button to="/register" variant="gradient">
              Create an account
            </Button>
            <Button to="/login" variant="outline">
              Log in
            </Button>
          </div>
        </Card>
      </section>

      <footer className="max-w-6xl mx-auto px-6 md:px-8 py-8 text-xs text-ink-400">
        Campus Placement Portal
      </footer>
    </div>
  );
}

function Track({
  title,
  body,
  cta,
  to,
}: {
  title: string;
  body: string;
  cta: string;
  to: string;
}) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-ink-50 mb-2">{title}</h3>
      <p className="text-sm text-ink-400 leading-relaxed mb-4">{body}</p>
      <Link
        to={to}
        className="text-sm text-accent-cyan hover:text-white transition-colors"
      >
        {cta} &rarr;
      </Link>
    </Card>
  );
}
