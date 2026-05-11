import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "STAFF"];

export default function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!ADMIN_ROLES.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}