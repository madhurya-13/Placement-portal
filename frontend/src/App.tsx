// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Catches render crashes anywhere below and shows the 500 page. */}
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Explicit status routes — also the targets of the API error interceptor. */}
            <Route path="/401" element={<ErrorPage code={401} />} />
            <Route path="/403" element={<ErrorPage code={403} />} />
            <Route path="/500" element={<ErrorPage code={500} />} />
            <Route path="/503" element={<ErrorPage code={503} />} />
            <Route path="/451" element={<ErrorPage code={451} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter-dashboard"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer-dashboard"
              element={
                <ProtectedRoute allowedRoles={["placement_officer"]}>
                  <OfficerDashboard />
                </ProtectedRoute>
              }
            />
            {/* Unknown URLs render the 404 page instead of silently bouncing home. */}
            <Route path="*" element={<ErrorPage code={404} />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
