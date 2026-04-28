import api from "@/lib/axios";
import { Sparepart, SparepartFormData } from "@/types";
import { generateId } from "@/utils/dummy-data";

// In-memory fallback when no backend is available
interface SpareResponse {
  success: boolean;
  message?: string;
  data: Sparepart | Sparepart[] | null;
}

export const sparepartApi = {
  async getAll(): Promise<Sparepart[]> {
    try {
      const { data } = await api.get<SpareResponse>("/spareparts");
      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error("API error:", error);
    }
  },

  async create(payload: SparepartFormData): Promise<Sparepart> {
    try {
      const { data } = await api.post<SpareResponse>("/spareparts", payload);
      return data.data as Sparepart;
    } catch (error) {
      console.error("Error creating sparepart:", error);
      return Promise.reject(error);
    }
  },

  async update(id: string, payload: SparepartFormData): Promise<Sparepart> {
    try {
      const { data } = await api.put<SpareResponse>(
        `/spareparts/${id}`,
        payload,
      );
      return data.data as Sparepart;
    } catch (error) {
      console.error("API error:", error);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.delete(`/spareparts/${id}`);
    } catch (error) {
      console.error("API error:", error);
    }
  },
};
