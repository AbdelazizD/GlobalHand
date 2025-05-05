// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children, requireVolunteer = false }) {
  const { isAuthenticated, isVolunteer, loading } = useAuth();

  // 1️⃣ Don’t decide until we know the auth state
  if (loading) return null; // or a spinner

  // 2️⃣ Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Volunteer‑only guard
  if (requireVolunteer && !isVolunteer) {
    return <Navigate to="/not-authorized" replace />;
  }

  // 4️⃣ All good → render the page
  return children;
}
