import { Link } from "react-router-dom";

const steps = [
  ["01", "Register", "Students and recruiters sign up in minutes. Recruiter accounts wait for Placement Officer approval before they can post."],
  ["02", "Build your side of the desk", "Students complete a profile and upload a resume. Recruiters register a company and describe the role, CTC and eligibility."],
  ["03", "Post and apply", "Approved jobs go live to every eligible student. One click applies — no duplicate applications, no missed deadlines."],
  ["04", "Track it through to an offer", "Every application moves through Applied, Shortlisted, Selected or Rejected, visible to the student the moment it changes."],
] as const;

const applicants = [
  ["A. Kulkarni", "CSE '26", "Selected", "#8ec98a"],
  ["R. Sen", "ECE '26", "Shortlisted", "#e8c07d"],
  ["M. Fernandes", "CSE '27", "Applied", "#b0b0b0"],
  ["T. Iyer", "IT '26", "Rejected", "#d98a8a"],
] as const;

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 text-ink-50">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent-amber/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-accent-blue/10 blur-3xl" />

      <header className="relative z-10 border-b border-white/15 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-8">
          <span className="text-lg font-bold tracking-tight">Placement<span className="text-ink-200">Hub</span></span>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/login" className="text-ink-200 transition-colors hover:text-ink-50">Log in</Link>
            <Link to="/register" className="rounded-xl bg-ink-50 px-4 py-2 font-semibold text-ink-950 transition-colors hover:bg-white">Register</Link>
          </nav>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-20 md:grid-cols-2 md:px-8">
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent-amber">Campus placement, in one system</p>
          <h1 className="mb-6 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
            Where every application, approval and offer is on the record.
          </h1>
          <p className="mb-8 max-w-lg leading-relaxed text-ink-200">
            One portal for students applying, recruiters hiring, and the Placement Office keeping both sides honest — who&apos;s eligible, who&apos;s approved, and who&apos;s been shortlisted, without a single spreadsheet.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="rounded-xl bg-ink-50 px-5 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-white">Join as a student</Link>
            <Link to="/register" className="rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-ink-50 transition-colors hover:bg-white/10">Register your company</Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/15 px-5 py-4">
            <span className="text-sm font-medium">Applicants — Backend Engineer</span>
            <span className="text-xs text-ink-400">Nimbus Systems</span>
          </div>
          <ul className="divide-y divide-white/10">
            {applicants.map(([name, branch, tag, color]) => (
              <li key={name} className="flex items-center justify-between px-5 py-4 text-sm">
                <div><p className="font-medium">{name}</p><p className="text-xs text-ink-400">{branch}</p></div>
                <span className="rounded-lg px-2.5 py-1 text-xs" style={{ color, backgroundColor: `${color}20` }}>{tag}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/15 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3 md:px-8">
          <Track title="For students" body="Keep one profile, one resume, and see exactly where every application stands — no more emailing the placement cell to ask." cta="Browse open roles" />
          <Track title="For recruiters" body="Post a role once it&apos;s approved, and manage every applicant&apos;s status from a single screen instead of a shared spreadsheet." cta="Post your first job" />
          <Track title="For the Placement Office" body="Approve recruiters and job posts before they reach students, and watch placement rates change in real time." cta="Request officer access" />
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-8">
        <h2 className="mb-12 max-w-md text-3xl font-semibold">Four steps, start to offer letter.</h2>
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map(([number, title, body]) => (
            <div key={number} className="border-t-2 border-ink-200/60 pt-4">
              <span className="text-sm text-accent-amber">{number}</span>
              <h3 className="mb-2 mt-2 font-medium">{title}</h3>
              <p className="text-sm leading-relaxed text-ink-200">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 border-t border-white/15 bg-ink-950/70 text-ink-50">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center md:px-8">
          <p className="max-w-sm text-2xl font-semibold">Placement season moves fast. Your records should keep up.</p>
          <div className="flex gap-3">
            <Link to="/register" className="rounded-xl bg-ink-50 px-5 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-white">Create an account</Link>
            <Link to="/login" className="rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/10">Log in</Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 py-8 text-xs text-ink-400 md:px-8">Campus Placement Portal</footer>
    </div>
  );
}

function Track({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <div>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-ink-200">{body}</p>
      <Link to="/register" className="text-sm font-semibold text-accent-amber transition-colors hover:text-ink-50">{cta} &rarr;</Link>
    </div>
  );
}
