import { stat } from "node:fs";
import { z } from "zod";

export const createCustomerSchema = z.object({
  kode_data: z.string(),
  nama_konter: z.string(),
  nama_customer: z.string(),
  alamat: z.string().optional(),
  no_hp: z.string().min(8, "Nomor HP tidak valid"),
  merk_hp: z.string().optional(),
  kerusakan: z.string().optional(),
  biaya: z.number().optional(),
  teknisi: z.string(),
  status: z
    .enum([
      "proses transaksi",
      "pengecekan",
      "menunggu part",
      "diproses",
      "ok",
      "not good",
      "diambil",
      "cancel",
    ])
    .default("pengecekan"),
  tgl_masuk: z.string().optional(),
  tgl_keluar: z.string().optional(),
  catatan: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
