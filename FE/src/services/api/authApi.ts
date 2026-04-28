import api from "@/lib/axios";
import { User } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nama: string;
  role: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
    role: string;
  };
}

// Simulates API calls — replace with real endpoints when backend is ready
// const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", payload);
      console.log("Login response:", data);
      if (!data.success) throw new Error(data.message || "Login failed");
      return data;
    } catch (error) {
      return {
        success: false,
        message: error.message || "Login failed",
        data: null,
      };
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>("/auth/register", payload);
      console.log("Register response:", data);
      return data;
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed",
        data: null,
      };
    }
  },

  async getProfile(): Promise<User> {
    try {
      const { data } = await api.get<User>("/auth/profile");
      return data;
    } catch {
      // await delay();
      const saved = localStorage.getItem("user");
      if (saved) return JSON.parse(saved);
      throw new Error("Not authenticated");
    }
  },
};
