// src/pages/RecruiterDashboard.tsx
import { useState } from "react";
import { LayoutDashboard, Building2, Briefcase } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import CreateCompanyForm from "../components/CreateCompanyForm";
import PostJobForm from "../components/PostJobForm";
import MyJobsList from "../components/MyJobsList";

const navLinks = [
  { to: "/recruiter-dashboard#overview", label: "Dashboard", icon: LayoutDashboard },
  { to: "/recruiter-dashboard#companies", label: "Companies", icon: Building2 },
  { to: "/recruiter-dashboard#jobs", label: "Jobs", icon: Briefcase },
];

export default function RecruiterDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <DashboardLayout navLinks={navLinks} pageTitle="Recruiter Dashboard">
      <div id="overview" className="space-y-5">
        <div id="companies">
          <CreateCompanyForm onCompanyCreated={() => setRefreshKey((k) => k + 1)} />
        </div>
        <div id="jobs">
          <PostJobForm key={refreshKey} onJobPosted={() => setRefreshKey((k) => k + 1)} />
          <div className="mt-5">
            <MyJobsList refreshKey={refreshKey} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}