// src/pages/StudentDashboard.tsx
import { useAuth } from "../context/useAuth";
import ProfileForm from "../components/ProfileForm";
import ResumeUpload from "../components/ResumeUpload";
import JobsList from "../components/JobsList";
import ApplicationStatusList from "../components/ApplicationStatusList";

export default function StudentDashboard() {
  const { user, logoutUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.email}</h1>
          <button onClick={logoutUser} className="text-sm text-red-600 underline">
            Logout
          </button>
        </div>
        <div className="grid gap-6">
          <ProfileForm />
          <ResumeUpload />
          <JobsList />
          <ApplicationStatusList />
        </div>
      </div>
    </div>
  );
}