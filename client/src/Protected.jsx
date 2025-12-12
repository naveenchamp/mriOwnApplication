// src/Protected.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function Protected({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;       // Wait for cookie check
  if (!user) return <Navigate to="/" replace />;  // Not logged → landing page

  return children;
}
