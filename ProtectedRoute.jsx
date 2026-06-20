import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, adminOnly = false }) {
  const { account, loading } = useAuth();

  if (loading) return <div className="page-loading">Loading...</div>;
  if (!account) return <Navigate to="/login" replace />;
  if (adminOnly && account.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
}
