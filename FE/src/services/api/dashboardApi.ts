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

export const dashboardApi = {
  async getStats(): Promise<DashboardStatsResponse> {
    try {
      const { data } =
        await api.get<DashboardStatsResponse>("/dashboard/stats");
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

  async getServiceOrders(): Promise<ServiceOrder[]> {
    try {
      const { data } = await api.get<ServiceOrder[]>("/service-orders");
      return data;
    } catch (error) {
      return [...dummyServiceOrders];

      // console.error("Error fetching service orders:", error);
    }
  },
};
