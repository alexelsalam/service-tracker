-- =====================
-- USERS (Admin & Teknisi)
-- =====================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','manajer','teknisi')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CUSTOMERS
-- =====================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_data VARCHAR(50) NOT NULL,
  nama_konter VARCHAR(50) NOT NULL,
  nama_customer VARCHAR(50) NOT NULL,
  alamat TEXT,
  no_hp VARCHAR(20),
  merk_hp VARCHAR(50),
  kerusakan TEXT,
  biaya NUMERIC(10, 2),
  teknisi TEXT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('proses transaksi','deal','menunggu part', 'diproses', 'ok','not good','diambil','cancel')),
  tgl_masuk DATE,
  tgl_keluar DATE,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- SPARE PARTS
-- =====================
CREATE TABLE spare_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);