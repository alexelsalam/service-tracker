import { useState, useCallback, ReactNode } from "react";
import { User } from "@/types";
import { authApi } from "@/services/api";
import { AuthContext } from "@/hooks/useAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // console.log("Loading user from localStorage...", user);
    try {
      const saved = localStorage.getItem("user");
      if (!saved) return null;
      // If saved is an object with {user: {...}, token, role}, extract user
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object" && parsed.user) {
        return parsed.user;
      }
      // If saved is already a User object
      return parsed;
    } catch {
      localStorage.removeItem("user"); // buang data yang rusak
      return null;
    }
  });

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; message: string }> => {
      try {
        const {
          success,
          message,
          data: { token, user: u, role },
        } = await authApi.login({ email, password });

        if (success) {
          setUser(u);
          localStorage.setItem(
            "user",
            JSON.stringify({ token, user: u, role }),
          );
        }

        return { success, message };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login gagal";
        return { success: false, message };
      }
    },
    [],
  );

  const register = useCallback(
    async (
      nama: string,
      role: string,
      email: string,
      password: string,
    ): Promise<{ success: boolean; message: string }> => {
      try {
        const { success, message } = await authApi.register({
          nama,
          role,
          email,
          password,
        });
        return { success, message };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Pendaftaran gagal";
        return { success: false, message };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
