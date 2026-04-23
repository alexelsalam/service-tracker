import { Customer, CustomerFormData } from '@/types';
import { dummyCustomers, generateId } from '@/utils/dummy-data';

let customers = [...dummyCustomers];

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

export const customerService = {
  async getAll(): Promise<Customer[]> {
    await delay();
    return [...customers];
  },
  async create(data: CustomerFormData): Promise<Customer> {
    await delay();
    const customer: Customer = { ...data, id: generateId(), createdAt: new Date().toISOString().split('T')[0] };
    customers = [customer, ...customers];
    return customer;
  },
  async update(id: string, data: CustomerFormData): Promise<Customer> {
    await delay();
    const idx = customers.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Customer not found');
    customers[idx] = { ...customers[idx], ...data };
    return customers[idx];
  },
  async remove(id: string): Promise<void> {
    await delay();
    customers = customers.filter(c => c.id !== id);
  },
};
