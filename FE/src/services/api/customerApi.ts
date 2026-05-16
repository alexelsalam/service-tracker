import api from "@/lib/axios";
import { Customer, CustomerFormData, ServiceOrder } from "@/types";

// In-memory fallback when no backend is available
// let localCustomers = [...dummyCustomers];
interface CustResponse {
  success: boolean;
  message?: string;
  data: Customer | Customer[] | null;
}
interface ServiceOrderResponse {
  success: boolean;
  message?: string;
  data: ServiceOrder | ServiceOrder[];
}
export const customerApi = {
  async getAll(
    bulan?: number | string,
    tahun?: number | string,
  ): Promise<Customer[]> {
    try {
      const params = new URLSearchParams();
      if (bulan && bulan !== "") {
        params.append("bulan", String(bulan));
      }
      if (tahun && tahun !== "") {
        params.append("tahun", String(tahun));
      }
      const query = params.toString();
      const { data } = await api.get<CustResponse>(
        `/customers${query ? `?${query}` : ""}`,
      );
      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    }
  },

  async getByTechnician(
    bulan?: string | number,
    tahun?: string | number,
  ): Promise<ServiceOrder[]> {
    try {
      const params = new URLSearchParams();
      if (bulan && bulan !== "") {
        params.append("bulan", String(bulan));
      }
      if (tahun && tahun !== "") {
        params.append("tahun", String(tahun));
      }
      const query = params.toString();
      console.log(query);
      const { data } = await api.get<ServiceOrderResponse>(
        `/customers/bytechnician${query ? `?${query}` : ""}`,
      );
      console.log("Fetched customers by technician:", data.data);
      return new Array(data.data).flat();
    } catch (error) {
      console.error("Error fetching customers by technician:", error);
      return [];
    }
  },
  async getByTechnicianAll(): Promise<ServiceOrder[]> {
    try {
      const { data } = await api.get<ServiceOrderResponse>(
        `/customers/bytechnician/all`,
      );
      console.log("Fetched customers by technician:", data.data);
      return new Array(data.data).flat();
    } catch (error) {
      console.error("Error fetching customers by technician:", error);
      return [];
    }
  },
  async create(payload: CustomerFormData): Promise<Customer> {
    try {
      const { data } = await api.post<CustResponse>("/customers", payload);
      return data.data as Customer;
    } catch (error) {
      console.error("Error creating customer:", error);
      return Promise.reject(error);
    }
  },

  async update(id: string, payload: CustomerFormData): Promise<Customer> {
    try {
      const { data } = await api.put<Customer>(`/customers/${id}`, payload);
      return data;
    } catch (error) {
      console.error("Error updating customer:", error);
      return Promise.reject(error);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.delete(`/customers/${id}`);
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  },
};
