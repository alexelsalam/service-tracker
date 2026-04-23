import { Customer, Sparepart, ServiceOrder } from '@/types';

export const dummyCustomers: Customer[] = [
  { id: '1', nama: 'Budi Santoso', noHp: '081234567890', alamat: 'Jl. Merdeka No. 10, Jakarta', device: 'iPhone 13', keluhan: 'Layar retak', createdAt: '2024-01-15' },
  { id: '2', nama: 'Siti Rahayu', noHp: '085678901234', alamat: 'Jl. Sudirman No. 25, Bandung', device: 'Samsung S22', keluhan: 'Baterai cepat habis', createdAt: '2024-01-18' },
  { id: '3', nama: 'Ahmad Wijaya', noHp: '082345678901', alamat: 'Jl. Diponegoro No. 5, Surabaya', device: 'Xiaomi Redmi Note 12', keluhan: 'Tidak bisa charging', createdAt: '2024-02-01' },
  { id: '4', nama: 'Dewi Lestari', noHp: '087890123456', alamat: 'Jl. Gatot Subroto No. 15, Medan', device: 'OPPO Reno 8', keluhan: 'Speaker tidak bunyi', createdAt: '2024-02-10' },
  { id: '5', nama: 'Eko Prasetyo', noHp: '089012345678', alamat: 'Jl. Ahmad Yani No. 30, Semarang', device: 'Vivo V25', keluhan: 'Kamera blur', createdAt: '2024-02-15' },
];

export const dummySpareparts: Sparepart[] = [
  { id: '1', nama: 'LCD iPhone 13', harga: 850000, stok: 12 },
  { id: '2', nama: 'Baterai Samsung S22', harga: 350000, stok: 25 },
  { id: '3', nama: 'Konektor Charging Type-C', harga: 75000, stok: 50 },
  { id: '4', nama: 'Speaker iPhone 12', harga: 150000, stok: 18 },
  { id: '5', nama: 'Kamera Belakang Xiaomi Redmi Note 12', harga: 280000, stok: 8 },
  { id: '6', nama: 'Touchscreen OPPO Reno 8', harga: 450000, stok: 5 },
  { id: '7', nama: 'Flexible Power Vivo V25', harga: 95000, stok: 30 },
];

export const dummyServiceOrders: ServiceOrder[] = [
  {
    id: 'SRV-001',
    customerId: '1',
    customerName: 'Budi Santoso',
    device: 'iPhone 13',
    keluhan: 'Layar retak',
    status: 'completed',
    estimasiBiaya: 900000,
    sparepartsUsed: ['LCD iPhone 13'],
    teknisi: 'Admin',
    tanggalMasuk: '2024-01-15',
    tanggalSelesai: '2024-01-18',
    catatan: 'Penggantian LCD berhasil, unit sudah ditest.',
  },
  {
    id: 'SRV-002',
    customerId: '2',
    customerName: 'Siti Rahayu',
    device: 'Samsung S22',
    keluhan: 'Baterai cepat habis',
    status: 'in_progress',
    estimasiBiaya: 400000,
    sparepartsUsed: ['Baterai Samsung S22'],
    teknisi: 'Admin',
    tanggalMasuk: '2024-01-18',
    tanggalSelesai: null,
    catatan: 'Baterai sudah dipesan, menunggu pengerjaan.',
  },
  {
    id: 'SRV-003',
    customerId: '3',
    customerName: 'Ahmad Wijaya',
    device: 'Xiaomi Redmi Note 12',
    keluhan: 'Tidak bisa charging',
    status: 'in_progress',
    estimasiBiaya: 125000,
    sparepartsUsed: ['Konektor Charging Type-C'],
    teknisi: 'Admin',
    tanggalMasuk: '2024-02-01',
    tanggalSelesai: null,
    catatan: 'Sedang dalam proses penggantian konektor.',
  },
  {
    id: 'SRV-004',
    customerId: '4',
    customerName: 'Dewi Lestari',
    device: 'OPPO Reno 8',
    keluhan: 'Speaker tidak bunyi',
    status: 'completed',
    estimasiBiaya: 200000,
    sparepartsUsed: ['Speaker iPhone 12'],
    teknisi: 'Admin',
    tanggalMasuk: '2024-02-10',
    tanggalSelesai: '2024-02-13',
    catatan: 'Speaker diganti, suara kembali normal.',
  },
  {
    id: 'SRV-005',
    customerId: '5',
    customerName: 'Eko Prasetyo',
    device: 'Vivo V25',
    keluhan: 'Kamera blur',
    status: 'pending',
    estimasiBiaya: 330000,
    sparepartsUsed: [],
    teknisi: 'Admin',
    tanggalMasuk: '2024-02-15',
    tanggalSelesai: null,
    catatan: 'Menunggu diagnosa lebih lanjut.',
  },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
