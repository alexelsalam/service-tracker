export interface Customer {
  id: string;
  kode_data: string;
  nama_konter: string;
  nama_customer: string;
  alamat: string;
  no_hp: string;
  merk_hp: string;
  kerusakan: string;
  biaya: number;
  teknisi: string;
  status: string;
  tgl_masuk: Date | null;
  tgl_keluar: Date | null;
  catatan?: string;
  createdAt: string;
}

export interface Sparepart {
  id: string;
  nama: string;
  harga: number;
  stok: number;
}
export type UserRole = "admin" | "teknisi" | "user";
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ServiceStatus = "pending" | "in_progress" | "completed";

export interface ServiceOrder {
  id: string;
  customerId: string;
  customerName: string;
  device: string;
  keluhan: string;
  status: ServiceStatus;
  estimasiBiaya: number;
  sparepartsUsed: string[];
  teknisi: string;
  tanggalMasuk: string;
  tanggalSelesai: string | null;
  catatan: string;
}

export type CustomerFormData = Omit<Customer, "id" | "createdAt">;
export type SparepartFormData = Omit<Sparepart, "id">;
