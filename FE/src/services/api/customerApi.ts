import api from "@/lib/axios";
import { Customer, CustomerFormData } from "@/types";
import { dummyCustomers, generateId } from "@/utils/dummy-data";
import { error } from "console";

// In-memory fallback when no backend is available
let localCustomers = [...dummyCustomers];
interface CustResponse {
  success: boolean;
  message?: string;
  data: Customer | Customer[] | null;
}
export const customerApi = {
  async getAll(): Promise<Customer[]> {
    try {
      const { data } = await api.get<CustResponse>("/customers");
      return Array.isArray(data.data) ? data.data : [];
    } catch {
      return [...localCustomers];
    }
  },

  async create(payload: CustomerFormData): Promise<Customer> {
    try {
      const { data } = await api.post<CustResponse>("/customers", payload);
      console.log(data);
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
    } catch {
      const idx = localCustomers.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error("Customer not found");
      localCustomers[idx] = { ...localCustomers[idx], ...payload };
      return localCustomers[idx];
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.delete(`/customers/${id}`);
    } catch {
      localCustomers = localCustomers.filter((c) => c.id !== id);
    }
  },
};
