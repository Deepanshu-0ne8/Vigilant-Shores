import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Wait until AuthContext finishes checking
  if (loading) {
    return <div>Loading session...</div>;
  }

  // Only after loading, decide
  if (user) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
