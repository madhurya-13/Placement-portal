// src/pages/StudentDashboard.tsx
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
  return (
    <DashboardLayout navLinks={navLinks} pageTitle="Student Dashboard">
      <div id="overview" className="space-y-5">
        <div id="profile">
          <ProfileForm />
        </div>
        <ResumeUpload />
        <div id="jobs">
          <JobsList />
        </div>
        <div id="applications">
          <ApplicationStatusList />
        </div>
      </div>
    </DashboardLayout>
  );
}