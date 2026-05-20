import { ReactNode } from "react";

export type SidebarContextTypes = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};
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
  stock: number;
}
export type UserRole = "admin" | "teknisi";
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
export type ServiceStatus =
  | "proses transaksi"
  | "deal"
  | "menunggu part"
  | "diproses"
  | "ok"
  | "not good"
  | "diambil"
  | "cancel";
export interface ServiceOrder {
  teknisi: string;
  total_customers: number;
  hp_selesai: number;
  hp_diproses: number;
  hp_tidak_jadi: number;
  total_fee: number;
  customers: {
    id: string;
    kode_data: string;
    nama_customer: string;
    merk_hp: string;
    kerusakan: string;
    biaya: number;
    fee: number;
    status: string;
    tgl_masuk: Date;
    tgl_keluar: Date;
    catatan: string;
  };
}
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    nama: string,
    role: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}
interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  actions?: (item: T) => ReactNode;
}
export type CustomerFormData = Omit<Customer, "id" | "createdAt">;
export type SparepartFormData = Omit<Sparepart, "id">;
