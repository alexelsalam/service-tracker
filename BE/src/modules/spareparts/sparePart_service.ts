import sql from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import {
  CreateSparePartInput,
  UpdateSparePartInput,
  UpdateStockInput,
} from "./sparePart_schema.js";

type SparePart = {
  id: string;
  nama: string;
  stock: number;
  created_at: string;
};

// Ambil semua spare part
export async function getAllSpareParts() {
  return await sql<SparePart[]>`
    SELECT * FROM spare_parts ORDER BY nama ASC
  `;
}

// Ambil spare part by ID
export async function getSparePartById(id: string) {
  const [sparePart] = await sql<SparePart[]>`
    SELECT * FROM spare_parts WHERE id = ${id}
  `;

  if (!sparePart) throw AppError.notFound("Spare part tidak ditemukan");
  return sparePart;
}

// Buat spare part baru
export async function createSparePart(input: CreateSparePartInput) {
  // Cek nama sudah ada
  const existing = await sql<SparePart[]>`
    SELECT id FROM spare_parts WHERE LOWER(nama) = LOWER(${input.nama})
  `;

  if (existing.length > 0)
    throw AppError.conflict("Spare part dengan nama ini sudah ada");

  const [sparePart] = await sql<SparePart[]>`
    INSERT INTO spare_parts (nama, stock)
    VALUES (${input.nama}, ${input.stock})
    RETURNING *
  `;

  return sparePart;
}

// Update spare part
export async function updateSparePart(id: string, input: UpdateSparePartInput) {
  const [sparePart] = await sql<SparePart[]>`
    UPDATE spare_parts
    SET
      nama = COALESCE(${input.nama ?? null}, nama),
      stock = COALESCE(${input.stock ?? null}, stock)
    WHERE id = ${id}
    RETURNING *
  `;

  if (!sparePart) throw AppError.notFound("Spare part tidak ditemukan");
  return sparePart;
}

// Tambah stok
export async function addStock(id: string, input: UpdateStockInput) {
  const [sparePart] = await sql<SparePart[]>`
    UPDATE spare_parts
    SET stock = stock + ${input.stock}
    WHERE id = ${id}
    RETURNING *
  `;

  if (!sparePart) throw AppError.notFound("Spare part tidak ditemukan");
  return sparePart;
}

// Kurangi stok
export async function reduceStock(id: string, input: UpdateStockInput) {
  // Cek stok cukup
  const sparePart = await getSparePartById(id);
  if (sparePart.stock < input.stock) {
    throw AppError.badRequest(
      `Stok tidak cukup, stok tersedia: ${sparePart.stock}`,
    );
  }

  const [updated] = await sql<SparePart[]>`
    UPDATE spare_parts
    SET stock = stock - ${input.stock}
    WHERE id = ${id}
    RETURNING *
  `;

  return updated;
}

// Hapus spare part
export async function deleteSparePart(id: string) {
  const [sparePart] = await sql<SparePart[]>`
    DELETE FROM spare_parts WHERE id = ${id} RETURNING id
  `;

  if (!sparePart) throw AppError.notFound("Spare part tidak ditemukan");
  return sparePart;
}
