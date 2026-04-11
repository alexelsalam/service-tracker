import sql from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import { CreateCustomerInput, UpdateCustomerInput } from "./customer_schema.js";

type Customer = {
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
  tgl_masuk: Date;
  tgl_keluar: Date;
  catatan: string;
};

// Ambil semua customer
export async function getAllCustomers() {
  return await sql<Customer[]>`
    SELECT * FROM customers ORDER BY created_at DESC
  `;
}

// Ambil customer by ID
export async function getCustomerById(id: string) {
  const [customer] = await sql<Customer[]>`
    SELECT * FROM customers WHERE id = ${id}
  `;

  if (!customer) throw AppError.notFound("Customer tidak ditemukan");
  return customer;
}

// Buat customer baru
export async function createCustomer(input: CreateCustomerInput) {
  const [customer] = await sql<Customer[]>`
    INSERT INTO customers (kode_data,nama_konter,nama_customer,alamat,no_hp,merk_hp,kerusakan,biaya,teknisi,status,tgl_masuk,tgl_keluar,catatan)
    VALUES (${input.kode_data}, ${input.nama_konter}, ${input.nama_customer}, ${input.alamat ?? null}, ${input.no_hp}, ${input.merk_hp ?? null}, ${input.kerusakan ?? null}, ${input.biaya ?? null}, ${input.teknisi}, ${input.status}, ${input.tgl_masuk ?? null}, ${input.tgl_keluar ?? null}, ${input.catatan ?? null})
    RETURNING *
  `;
  return customer;
}

// Update customer
export async function updateCustomer(id: string, input: UpdateCustomerInput) {
  const [customer] = await sql<Customer[]>`
    UPDATE customers
    SET
      kode_data = COALESCE(${input.kode_data ?? null}, kode_data),
      nama_konter = COALESCE(${input.nama_konter ?? null}, nama_konter),
      nama_customer = COALESCE(${input.nama_customer ?? null}, nama_customer),
      alamat = COALESCE(${input.alamat ?? null}, alamat),
      no_hp = COALESCE(${input.no_hp ?? null}, no_hp),
      merk_hp = COALESCE(${input.merk_hp ?? null}, merk_hp),
      kerusakan = COALESCE(${input.kerusakan ?? null}, kerusakan),
      biaya = COALESCE(${input.biaya ?? null}, biaya),
      teknisi = COALESCE(${input.teknisi ?? null}, teknisi),
      status = COALESCE(${input.status ?? null}, status),
      tgl_masuk = COALESCE(${input.tgl_masuk ?? null}, tgl_masuk),
      tgl_keluar = COALESCE(${input.tgl_keluar ?? null}, tgl_keluar),
      catatan = COALESCE(${input.catatan ?? null}, catatan)
    WHERE id = ${id}
    RETURNING *
  `;

  if (!customer) throw AppError.notFound("Customer tidak ditemukan");
  return customer;
}

// Hapus customer
export async function deleteCustomer(id: string) {
  const [customer] = await sql<Customer[]>`
    DELETE FROM customers WHERE id = ${id} RETURNING id
  `;

  if (!customer) throw AppError.notFound("Customer tidak ditemukan");
  return customer;
}
