import api from '@/lib/axios';
import { Sparepart, SparepartFormData } from '@/types';
import { dummySpareparts, generateId } from '@/utils/dummy-data';

// In-memory fallback when no backend is available
let localSpareparts = [...dummySpareparts];
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const sparepartApi = {
  async getAll(): Promise<Sparepart[]> {
    try {
      const { data } = await api.get<Sparepart[]>('/spareparts');
      return data;
    } catch {
      await delay();
      return [...localSpareparts];
    }
  },

  async create(payload: SparepartFormData): Promise<Sparepart> {
    try {
      const { data } = await api.post<Sparepart>('/spareparts', payload);
      return data;
    } catch {
      await delay();
      const sp: Sparepart = { ...payload, id: generateId() };
      localSpareparts = [sp, ...localSpareparts];
      return sp;
    }
  },

  async update(id: string, payload: SparepartFormData): Promise<Sparepart> {
    try {
      const { data } = await api.put<Sparepart>(`/spareparts/${id}`, payload);
      return data;
    } catch {
      await delay();
      const idx = localSpareparts.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error('Sparepart not found');
      localSpareparts[idx] = { ...localSpareparts[idx], ...payload };
      return localSpareparts[idx];
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.delete(`/spareparts/${id}`);
    } catch {
      await delay();
      localSpareparts = localSpareparts.filter((s) => s.id !== id);
    }
  },
};
