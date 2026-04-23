import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { User } from "@/types";
import { authApi } from "@/services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    nama: string,
    role: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // console.log("Loading user from localStorage...", user);
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
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

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
