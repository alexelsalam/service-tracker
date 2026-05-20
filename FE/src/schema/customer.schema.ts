import z from "zod";

const KERUSAKAN_OPTIONS = [
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
] as const;

const STATUS_OPTIONS = [
  "proses transaksi",
  "deal",
  "menunggu part",
  "diproses",
  "ok",
  "not good",
  "diambil",
  "cancel",
] as const;
const createCustomerSchema = z.object({
  kode_data: z.string().min(1, "Kode data wajib diisi"),
  nama_konter: z.string().min(1, "Nama konter wajib diisi"),
  nama_customer: z.string().min(1, "Nama customer wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  no_hp: z.string().min(8, "Nomor HP tidak valid"),
  merk_hp: z.string().min(1, "Merk HP wajib diisi"),
  kerusakan: z.enum(KERUSAKAN_OPTIONS).default("masalah lainnya"),
  biaya: z.coerce.number().optional(),
  teknisi: z.string().min(1, "Teknisi wajib dipilih"),
  status: z.enum(STATUS_OPTIONS).default("proses transaksi"),
  tgl_masuk: z.date().optional(),
  tgl_keluar: z.date().optional(),
  catatan: z.string().optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export { createCustomerSchema, KERUSAKAN_OPTIONS, STATUS_OPTIONS };
