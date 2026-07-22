// src/pages/RecruiterDashboard.tsx
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import CreateCompanyForm from "../components/CreateCompanyForm";
import PostJobForm from "../components/PostJobForm";
import MyJobsList from "../components/MyJobsList";

export default function RecruiterDashboard() {
  const { user, logoutUser } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Recruiter: {user?.email}</h1>
          <button onClick={logoutUser} className="text-sm text-red-600 underline">
            Logout
          </button>
        </div>
        <div className="grid gap-6">
          <CreateCompanyForm onCompanyCreated={() => setRefreshKey((k) => k + 1)} />
          <PostJobForm key={refreshKey} onJobPosted={() => setRefreshKey((k) => k + 1)} />
          <MyJobsList refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}