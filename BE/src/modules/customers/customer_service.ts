import cluster from "node:cluster";
import sql from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import {
  CreateCustomerInput,
  CustomerQuery,
  UpdateCustomerInput,
} from "./customer_schema.js";

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
type CustomerByTechnician = {
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
};
// Helper function untuk format tanggal (ambil hanya YYYY-MM-DD)
function formatDateOnly(date: Date | string | null): string | null {
  if (!date) return null;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return (dateObj.toISOString().split("T")[0] as string) || null; // Ambil hanya YYYY-MM-DD
}

// Ambil semua customer dengan filter bulan dan tahun (opsional)
export async function getAllCustomers(query: CustomerQuery) {
  const { bulan, tahun } = query;
  let result: Customer[] = [];
  // Filter keduanya
  if (bulan && tahun) {
    result = await sql<Customer[]>`
      SELECT * FROM customers
      WHERE EXTRACT(MONTH FROM tgl_masuk) = ${bulan}
      AND EXTRACT(YEAR FROM tgl_masuk) = ${tahun}
      ORDER BY tgl_masuk DESC
    `;
  } else if (bulan) {
    console.log("Filter by bulan:", bulan);
    result = await sql<Customer[]>`
      SELECT * FROM customers
      WHERE EXTRACT(MONTH FROM tgl_masuk) = ${bulan}
      ORDER BY tgl_masuk DESC
    `;
  } else if (tahun) {
    result = await sql<Customer[]>`
      SELECT * FROM customers
      WHERE EXTRACT(YEAR FROM tgl_masuk) = ${tahun}
      ORDER BY tgl_masuk DESC
    `;
  } else {
    result = await sql<Customer[]>`
      SELECT * FROM customers ORDER BY tgl_masuk DESC
    `;
  }
  return result.map((c) => ({
    ...c,
    tgl_masuk: formatDateOnly(c.tgl_masuk),
    tgl_keluar: formatDateOnly(c.tgl_keluar),
  }));
}
export async function getCustomersByAllTechnician(
  query: CustomerQuery,
): Promise<CustomerByTechnician[]> {
  const { bulan, tahun } = query;

  const result = await sql<CustomerByTechnician[]>`
    WITH teknisi_list AS (
      -- Ambil semua teknisi yang pernah terdaftar di tabel users
      -- termasuk yang sudah keluar sekalipun
      SELECT DISTINCT nama FROM users WHERE role = 'teknisi'

      UNION

      -- Ambil juga teknisi yang ada di data customers
      -- jaga-jaga kalau teknisi sudah dihapus dari users tapi datanya masih ada
      SELECT DISTINCT teknisi AS nama
      FROM customers
      WHERE teknisi IS NOT NULL
    )
    SELECT
      t.nama AS teknisi,
      COUNT(c.id)::int AS total_customers,
      COUNT(c.id) FILTER (WHERE c.status IN ('ok', 'diambil'))::int AS hp_selesai,
      COUNT(c.id) FILTER (WHERE c.status IN ('proses transaksi', 'deal', 'menunggu part', 'diproses'))::int AS hp_diproses,
      COUNT(c.id) FILTER (WHERE c.status IN ('not good', 'cancel'))::int AS hp_tidak_jadi,
      COALESCE(SUM(
        CASE
          WHEN c.biaya IS NULL   THEN 0
          WHEN c.biaya <= 85000  THEN 15000
          WHEN c.biaya <= 150000 THEN 20000
          WHEN c.biaya <= 250000 THEN 30000
          WHEN c.biaya <= 350000 THEN 40000
          ELSE 50000
        END
      )::int, 0) AS total_fee,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', c.id,
            'nama_customer', c.nama_customer,
            'merk_hp', c.merk_hp,
            'kerusakan', c.kerusakan,
            'biaya', c.biaya,
            'fee', CASE
              WHEN c.biaya IS NULL   THEN 0
              WHEN c.biaya <= 85000  THEN 15000
              WHEN c.biaya <= 150000 THEN 20000
              WHEN c.biaya <= 250000 THEN 30000
              WHEN c.biaya <= 350000 THEN 40000
              ELSE 50000
            END,
            'status', c.status,
            'tgl_masuk', c.tgl_masuk,
            'tgl_keluar', c.tgl_keluar,
            'catatan', c.catatan
          )
          ORDER BY c.tgl_masuk DESC
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'
      ) AS customers
    FROM teknisi_list t
    LEFT JOIN customers c ON LOWER(c.teknisi) = LOWER(t.nama)
      ${bulan ? sql`AND EXTRACT(MONTH FROM c.tgl_masuk) = ${bulan}` : sql``}
      ${tahun ? sql`AND EXTRACT(YEAR FROM c.tgl_masuk) = ${tahun}` : sql``}
    GROUP BY t.nama
    ORDER BY t.nama ASC
  `;
  return result;
}
export async function getCustomersByTechnician(
  teknisi: string,
  query: CustomerQuery,
): Promise<CustomerByTechnician[]> {
  let { bulan, tahun } = query;

  const result = await sql<CustomerByTechnician[]>`
    SELECT
      teknisi,
      COUNT(*)::int AS total_customers,
      COUNT(*) FILTER (WHERE status IN ('ok', 'diambil'))::int AS hp_selesai,
      COUNT(*) FILTER (WHERE status IN ('proses transaksi', 'deal', 'menunggu part', 'diproses'))::int AS hp_diproses,
      COUNT(*) FILTER (WHERE status IN ('not good', 'cancel'))::int AS hp_tidak_jadi,
      SUM(
        CASE
          WHEN biaya IS NULL   THEN 0
          WHEN biaya <= 85000  THEN 15000
          WHEN biaya <= 150000 THEN 20000
          WHEN biaya <= 250000 THEN 30000
          WHEN biaya <= 350000 THEN 40000
          ELSE 50000
        END
      )::int AS total_fee,
      JSON_AGG(
        JSON_BUILD_OBJECT(
        'id',id,
          'kode_data', kode_data,
          'nama_customer', nama_customer,
          'merk_hp', merk_hp,
          'kerusakan', kerusakan,
          'biaya', biaya,
          'fee', CASE
            WHEN biaya IS NULL   THEN 0
            WHEN biaya <= 85000  THEN 15000
            WHEN biaya <= 150000 THEN 20000
            WHEN biaya <= 250000 THEN 30000
            WHEN biaya <= 350000 THEN 40000
            ELSE 50000
          END,
          'status', status,
          'tgl_masuk', tgl_masuk,
          'tgl_keluar', tgl_keluar,
          'catatan', catatan
        )
        ORDER BY tgl_masuk DESC
      ) AS customers
    FROM customers
    WHERE LOWER(teknisi) = LOWER(${teknisi})
    ${bulan ? sql`AND EXTRACT(MONTH FROM tgl_masuk) = ${bulan}` : sql``}
    ${tahun ? sql`AND EXTRACT(YEAR FROM tgl_masuk) = ${tahun}` : sql``}
    GROUP BY teknisi
  `;
  return result;
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
