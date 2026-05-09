import api from "@/lib/axios";
import { ServiceOrder } from "@/types";
import { dummyServiceOrders } from "@/utils/dummy-data";

export interface DashboardStats {
  total_customers_this_month: number;
  hp_proses_transaksi: number;
  hp_deal: number;
  hp_diproses: number;
  hp_selesai_bulan_ini: number;
}
export interface DashboardStatsResponse {
  success: boolean;
  message?: string;
  data: DashboardStats | null;
}
export type MonthlyStats = {
  bulan: string;
  label: string;
  total_customers: number;
  total_hp_selesai: number;
};
export interface MonthlyStatsResponse {
  success: boolean;
  message?: string;
  data: MonthlyStats | MonthlyStats[];
}
export type KerusakanStats = {
  kerusakan: string;
  total: number;
  persen: number;
};
export interface KerusakanStatsResponse {
  success: boolean;
  message?: string;
  data: KerusakanStats | KerusakanStats[];
}
export const dashboardApi = {
  async getStats(
    bulan?: string | number,
    tahun?: string | number,
  ): Promise<DashboardStatsResponse> {
    try {
      const params = new URLSearchParams();
      if (bulan && bulan !== "") {
        params.append("bulan", String(bulan));
      }
      if (tahun && tahun !== "") {
        params.append("tahun", String(tahun));
      }
      const query = params.toString();
      const { data } = await api.get<DashboardStatsResponse>(
        `/dashboard/stats${query ? `?${query}` : ""}`,
      );
      return data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch dashboard stats",
        data: null,
      };
    }
  },
  async getLineChartData(): Promise<MonthlyStatsResponse> {
    try {
      const { data } =
        await api.get<MonthlyStatsResponse>("/dashboard/monthly");
      return data; // Assuming the API returns { success: boolean, data: MonthlyStats[] }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch dashboard stats",
        data: null,
      };
    }
  },

  async getBarChartData(): Promise<KerusakanStatsResponse> {
    try {
      const { data } = await api.get<KerusakanStatsResponse>(
        "/dashboard/kerusakan",
      );
      return data;
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch pie chart data",
        data: null,
      };
    }
  },
};
