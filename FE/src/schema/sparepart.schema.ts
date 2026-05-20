import z from "zod";

export const createSparePartSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  stock: z.number().int().min(0, "Stock tidak boleh negatif"),
});
export type CreateSparePartInput = z.infer<typeof createSparePartSchema>;
