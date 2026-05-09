import { z } from "zod";

export const createCustomerSchema = z.object({
  kode_data: z.string(),
  nama_konter: z.string(),
  nama_customer: z.string(),
  alamat: z.string().optional(),
  no_hp: z.string().min(8, "Nomor HP tidak valid"),
  merk_hp: z.string().optional(),
  kerusakan: z.enum([
    "lcd",
    "baterai",
    "kamera ",
    "speaker",
    "charger",
    "software",
    "ic",
    "stuck logo",
    "restart",
    "sinyal",
    "mati",
    "tombol",
    "lupa sandi/pola",
    "kena air",
    "pasang komponen",
    "masalah lainnya",
  ]),
  biaya: z.number().optional(),
  teknisi: z.string(),
  status: z
    .enum([
      "proses transaksi",
      "deal",
      "menunggu part",
      "diproses",
      "ok",
      "not good",
      "diambil",
      "cancel",
    ])
    .default("proses transaksi"),
  tgl_masuk: z.coerce.date().optional(),
  tgl_keluar: z.coerce.date().optional(),
  catatan: z.string().optional(),
});
export const customerQuerySchema = z.object({
  bulan: z.coerce.number().int().min(1).max(12).optional(),
  tahun: z.coerce.number().int().min(2000).max(2100).optional(),
});
// export const customerByTechnicianQuerySchema = z.object({
//   bulan: z.coerce.number().int().min(1).max(12).optional(),
//   tahun: z.coerce.number().int().min(2000).max(2100).optional(),
// });

export const updateCustomerSchema = createCustomerSchema.partial();
// export type CustomerByTechnicianQuery = z.infer<
//   typeof customerByTechnicianQuerySchema
// >;

export type CustomerQuery = z.infer<typeof customerQuerySchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
