import api from "@/lib/axios";
import { Customer, CustomerFormData, ServiceOrder } from "@/types";
// import { dummyCustomers, generateId } from "@/utils/dummy-data";
import { error } from "console";
import { S } from "vitest/dist/chunks/config.d.D2ROskhv.js";

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
  async getAll(): Promise<Customer[]> {
    try {
      const { data } = await api.get<CustResponse>("/customers");
      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    }
  },

  async getByTechnician(teknisi: string): Promise<ServiceOrder[]> {
    try {
      const { data } = await api.get<ServiceOrderResponse>(
        `/customers/${teknisi}`,
      );
      return Array.isArray(data.data) ? data.data : [];
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
