import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function RegisterMiddleware({ children }: PrivateRouteProps) {
  const getUser = JSON.parse(localStorage.getItem("user") || "{}");
  if (getUser.user.role !== "admin") {
    return <Navigate to="/Dashboard" replace />;
  }
  return <>{children}</>;
}
