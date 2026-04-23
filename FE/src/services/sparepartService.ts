import { Sparepart, SparepartFormData } from '@/types';
import { dummySpareparts, generateId } from '@/utils/dummy-data';

let spareparts = [...dummySpareparts];

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

export const sparepartService = {
  async getAll(): Promise<Sparepart[]> {
    await delay();
    return [...spareparts];
  },
  async create(data: SparepartFormData): Promise<Sparepart> {
    await delay();
    const sp: Sparepart = { ...data, id: generateId() };
    spareparts = [sp, ...spareparts];
    return sp;
  },
  async update(id: string, data: SparepartFormData): Promise<Sparepart> {
    await delay();
    const idx = spareparts.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Sparepart not found');
    spareparts[idx] = { ...spareparts[idx], ...data };
    return spareparts[idx];
  },
  async remove(id: string): Promise<void> {
    await delay();
    spareparts = spareparts.filter(s => s.id !== id);
  },
};
