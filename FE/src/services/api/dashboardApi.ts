import api from '@/lib/axios';
import { ServiceOrder } from '@/types';
import { dummyCustomers, dummySpareparts, dummyServiceOrders } from '@/utils/dummy-data';

export interface DashboardStats {
  totalCustomers: number;
  totalSpareparts: number;
  devicesInProgress: number;
  completedThisMonth: number;
}

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    try {
      const { data } = await api.get<DashboardStats>('/dashboard/stats');
      return data;
    } catch {
      await delay();
      return {
        totalCustomers: dummyCustomers.length,
        totalSpareparts: dummySpareparts.length,
        devicesInProgress: dummyServiceOrders.filter((o) => o.status === 'in_progress').length,
        completedThisMonth: dummyServiceOrders.filter((o) => o.status === 'completed').length,
      };
    }
  },

  async getServiceOrders(): Promise<ServiceOrder[]> {
    try {
      const { data } = await api.get<ServiceOrder[]>('/service-orders');
      return data;
    } catch {
      await delay();
      return [...dummyServiceOrders];
    }
  },
};
