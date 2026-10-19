// src/pages/StudentDashboard.tsx
import { useState } from "react";
import { LayoutDashboard, Briefcase, Send, User } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProfileForm from "../components/ProfileForm";
import ResumeUpload from "../components/ResumeUpload";
import JobsList from "../components/JobsList";
import ApplicationStatusList from "../components/ApplicationStatusList";

const navLinks = [
  { to: "/dashboard#overview", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard#jobs", label: "Jobs", icon: Briefcase },
  { to: "/dashboard#applications", label: "Applications", icon: Send },
  { to: "/dashboard#profile", label: "Profile", icon: User },
];

export default function StudentDashboard() {
  // Bumped after an application is submitted so JobsList and
  // ApplicationStatusList both refetch — same pattern as the recruiter page.
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <DashboardLayout navLinks={navLinks} pageTitle="Student Dashboard">
      <div id="overview" className="space-y-5">
        <div id="profile">
          <ProfileForm refreshKey={refreshKey} />
        </div>
        <ResumeUpload onUploaded={() => setRefreshKey((k) => k + 1)} />
        <div id="jobs">
          <JobsList refreshKey={refreshKey} onApplied={() => setRefreshKey((k) => k + 1)} />
        </div>
        <div id="applications">
          <ApplicationStatusList refreshKey={refreshKey} />
        </div>
      </div>
    </DashboardLayout>
  );
}