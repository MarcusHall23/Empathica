import { Navigate, Outlet } from "react-router";
import { useApp } from "../context/AppContext";

export function ProtectedRoute() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
