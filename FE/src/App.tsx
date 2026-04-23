import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/features/auth/AuthContext";
import { PrivateRoute } from "@/components/PrivateRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardHome from "@/pages/DashboardHome";
import CustomerPage from "@/pages/CustomerPage";
import SparepartPage from "@/pages/SparepartPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "./pages/NotFound";
import { RegisterMiddleware } from "./components/RegisterMiddleware";
import { LoginMiddleware } from "./components/LoginMiddleware";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/login"
              element={
                <LoginMiddleware>
                  <LoginPage />
                </LoginMiddleware>
              }
            />
            <Route
              path="/register"
              element={
                <RegisterMiddleware>
                  <RegisterPage />
                </RegisterMiddleware>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="customers" element={<CustomerPage />} />
              <Route path="spareparts" element={<SparepartPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
