// src/pages/OfficerDashboard.tsx
import { LayoutDashboard, Users, Briefcase } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatsPanel from "../components/StatsPanel";
import PendingRecruitersPanel from "../components/PendingRecruitersPanel";
import PendingJobsPanel from "../components/PendingJobsPanel";

const navLinks = [
  { to: "/officer-dashboard#overview", label: "Dashboard", icon: LayoutDashboard },
  { to: "/officer-dashboard#recruiters", label: "Recruiters", icon: Users },
  { to: "/officer-dashboard#jobs", label: "Jobs", icon: Briefcase },
];

export default function OfficerDashboard() {
  return (
    <DashboardLayout navLinks={navLinks} pageTitle="Placement Officer Dashboard">
      <div id="overview" className="space-y-5">
        <StatsPanel />
        <div id="recruiters">
          <PendingRecruitersPanel />
        </div>
        <div id="jobs">
          <PendingJobsPanel />
        </div>
      </div>
    </DashboardLayout>
  );
}