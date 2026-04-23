import { z } from "zod";

export const createSparePartSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  stock: z.number().int().min(0, "Stok tidak boleh negatif"),
});

export const updateSparePartSchema = createSparePartSchema.partial();

export const updateStockSchema = z.object({
  stock: z.number().int().min(0, "Stok tidak boleh negatif"),
});

export type CreateSparePartInput = z.infer<typeof createSparePartSchema>;
export type UpdateSparePartInput = z.infer<typeof updateSparePartSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
