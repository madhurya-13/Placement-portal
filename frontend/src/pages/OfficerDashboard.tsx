// src/pages/OfficerDashboard.tsx
import { useAuth } from "../context/useAuth";
import StatsPanel from "../components/StatsPanel";
import PendingRecruitersPanel from "../components/PendingRecruitersPanel";
import PendingJobsPanel from "../components/PendingJobsPanel";

export default function OfficerDashboard() {
  const { user, logoutUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Placement Officer: {user?.email}</h1>
          <button onClick={logoutUser} className="text-sm text-red-600 underline">
            Logout
          </button>
        </div>
        <div className="grid gap-6">
          <StatsPanel />
          <PendingRecruitersPanel />
          <PendingJobsPanel />
        </div>
      </div>
    </div>
  );
}