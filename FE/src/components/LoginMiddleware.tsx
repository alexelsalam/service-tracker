import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function LoginMiddleware({ children }: PrivateRouteProps) {
  const getUser = JSON.parse(localStorage.getItem("user"));
  if (getUser) {
    return <Navigate to="/Dashboard" replace />;
  }
  return <>{children}</>;
}
