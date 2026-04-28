import { Customer, Sparepart, ServiceOrder } from "@/types";

// export const dummyCustomers: Customer[] = [
//   { id: '1', nama: 'Budi Santoso', noHp: '081234567890', alamat: 'Jl. Merdeka No. 10, Jakarta', device: 'iPhone 13', keluhan: 'Layar retak', createdAt: '2024-01-15' },
//   { id: '2', nama: 'Siti Rahayu', noHp: '085678901234', alamat: 'Jl. Sudirman No. 25, Bandung', device: 'Samsung S22', keluhan: 'Baterai cepat habis', createdAt: '2024-01-18' },
//   { id: '3', nama: 'Ahmad Wijaya', noHp: '082345678901', alamat: 'Jl. Diponegoro No. 5, Surabaya', device: 'Xiaomi Redmi Note 12', keluhan: 'Tidak bisa charging', createdAt: '2024-02-01' },
//   { id: '4', nama: 'Dewi Lestari', noHp: '087890123456', alamat: 'Jl. Gatot Subroto No. 15, Medan', device: 'OPPO Reno 8', keluhan: 'Speaker tidak bunyi', createdAt: '2024-02-10' },
//   { id: '5', nama: 'Eko Prasetyo', noHp: '089012345678', alamat: 'Jl. Ahmad Yani No. 30, Semarang', device: 'Vivo V25', keluhan: 'Kamera blur', createdAt: '2024-02-15' },
// ];

export const dummyServiceOrders: ServiceOrder[] = [
  {
    id: "SRV-001",
    customerId: "1",
    customerName: "Budi Santoso",
    device: "iPhone 13",
    keluhan: "Layar retak",
    status: "completed",
    estimasiBiaya: 900000,
    sparepartsUsed: ["LCD iPhone 13"],
    teknisi: "Admin",
    tanggalMasuk: "2024-01-15",
    tanggalSelesai: "2024-01-18",
    catatan: "Penggantian LCD berhasil, unit sudah ditest.",
  },
  {
    id: "SRV-002",
    customerId: "2",
    customerName: "Siti Rahayu",
    device: "Samsung S22",
    keluhan: "Baterai cepat habis",
    status: "in_progress",
    estimasiBiaya: 400000,
    sparepartsUsed: ["Baterai Samsung S22"],
    teknisi: "Admin",
    tanggalMasuk: "2024-01-18",
    tanggalSelesai: null,
    catatan: "Baterai sudah dipesan, menunggu pengerjaan.",
  },
  {
    id: "SRV-003",
    customerId: "3",
    customerName: "Ahmad Wijaya",
    device: "Xiaomi Redmi Note 12",
    keluhan: "Tidak bisa charging",
    status: "in_progress",
    estimasiBiaya: 125000,
    sparepartsUsed: ["Konektor Charging Type-C"],
    teknisi: "Admin",
    tanggalMasuk: "2024-02-01",
    tanggalSelesai: null,
    catatan: "Sedang dalam proses penggantian konektor.",
  },
  {
    id: "SRV-004",
    customerId: "4",
    customerName: "Dewi Lestari",
    device: "OPPO Reno 8",
    keluhan: "Speaker tidak bunyi",
    status: "completed",
    estimasiBiaya: 200000,
    sparepartsUsed: ["Speaker iPhone 12"],
    teknisi: "Admin",
    tanggalMasuk: "2024-02-10",
    tanggalSelesai: "2024-02-13",
    catatan: "Speaker diganti, suara kembali normal.",
  },
  {
    id: "SRV-005",
    customerId: "5",
    customerName: "Eko Prasetyo",
    device: "Vivo V25",
    keluhan: "Kamera blur",
    status: "pending",
    estimasiBiaya: 330000,
    sparepartsUsed: [],
    teknisi: "Admin",
    tanggalMasuk: "2024-02-15",
    tanggalSelesai: null,
    catatan: "Menunggu diagnosa lebih lanjut.",
  },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
