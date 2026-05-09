import sql from "../../config/db.js";

type DashboardStats = {
  total_customers_this_month: number;
  hp_proses_transaksi: number;
  hp_deal: number;
  hp_diproses: number;
  hp_selesai_bulan_ini: number;
};
type MonthlyStats = {
  bulan: string; // format: "2024-01"
  label: string; // format: "Januari 2024"
  total_customers: number;
  total_hp_selesai: number;
};
type KerusakanStats = {
  kerusakan: string;
  total: number;
  persen: number;
};
export async function getDashboardStats(
  bulan?: number | string,
  tahun?: number | string,
) {
  // Tentukan date filter berdasarkan parameter
  let dateFilter =
    "DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())";

  if (
    bulan !== undefined &&
    bulan !== "" &&
    tahun !== undefined &&
    tahun !== ""
  ) {
    // Filter berdasarkan bulan dan tahun tertentu
    const monthNum = String(bulan).padStart(2, "0");
    const yearNum = String(tahun);
    dateFilter = `DATE_TRUNC('month', created_at) = '${yearNum}-${monthNum}-01'::date`;
  } else if (bulan !== undefined && bulan !== "" && tahun === undefined) {
    // Filter berdasarkan bulan untuk semua tahun (jarang terjadi, tapi untuk lengkap)
    const monthNum = String(bulan).padStart(2, "0");
    dateFilter = `TO_CHAR(created_at, 'MM') = '${monthNum}'`;
  } else if (tahun !== undefined && tahun !== "" && bulan === undefined) {
    // Filter berdasarkan tahun untuk semua bulan
    const yearNum = String(tahun);
    dateFilter = `TO_CHAR(created_at, 'YYYY') = '${yearNum}'`;
  }
  // Jika keduanya kosong, ambil semua data (tidak ada filter)

  const [stats] = await sql<DashboardStats[]>`
    SELECT
      -- Total customer
      (
        SELECT COUNT(*)::int
        FROM customers
        WHERE ${sql.unsafe(dateFilter)}
      ) AS total_customers_this_month,

      -- HP proses transaksi
      (
        SELECT COUNT(*)::int
        FROM customers
        WHERE status = 'proses transaksi'
        AND ${sql.unsafe(dateFilter)}
      ) AS hp_proses_transaksi,

      -- HP deal
      (
        SELECT COUNT(*)::int
        FROM customers
        WHERE status = 'deal'
        AND ${sql.unsafe(dateFilter)}
      ) AS hp_deal,

      -- HP diproses
      (
        SELECT COUNT(*)::int
        FROM customers
        WHERE status = 'diproses'
        AND ${sql.unsafe(dateFilter)}
      ) AS hp_diproses,

      -- HP selesai
      (
        SELECT COUNT(*)::int
        FROM customers
        WHERE status = 'ok'
        AND ${sql.unsafe(dateFilter)}
      ) AS hp_selesai_bulan_ini
  `;

  return stats;
}
export async function getMonthlyStats() {
  return await sql<MonthlyStats[]>`
  WITH month_series AS (
  SELECT DATE_TRUNC('month', generate_series(
    DATE_TRUNC('year', NOW()),                        -- mulai Januari tahun ini
    DATE_TRUNC('year', NOW()) + INTERVAL '11 months', -- sampai Desember tahun ini
    INTERVAL '1 month'
  )) AS bulan
),
    customer_stats AS (
      SELECT
        DATE_TRUNC('month', created_at) AS bulan,
        COUNT(*)::int AS total_customers
      FROM customers
      GROUP BY DATE_TRUNC('month', created_at)
    ),
    selesai_stats AS (
      SELECT
        DATE_TRUNC('month', tgl_keluar) AS bulan,
        COUNT(*)::int AS total_hp_selesai
      FROM customers
      WHERE status IN ('ok', 'diambil')
      AND tgl_keluar IS NOT NULL
      GROUP BY DATE_TRUNC('month', tgl_keluar)
    )
    SELECT
      TO_CHAR(m.bulan, 'YYYY-MM') AS bulan,
      TO_CHAR(m.bulan, 'TMMonth') AS label,
      COALESCE(c.total_customers, 0) AS total_customers,
      COALESCE(s.total_hp_selesai, 0) AS total_hp_selesai
    FROM month_series m
    LEFT JOIN customer_stats c ON c.bulan = m.bulan
    LEFT JOIN selesai_stats s ON s.bulan = m.bulan
    ORDER BY m.bulan ASC
  `;
}
export async function getKerusakanStats() {
  return await sql<KerusakanStats[]>`
    WITH kerusakan_list AS (
      -- Daftar kerusakan yang valid
      SELECT UNNEST(ARRAY[
        'lcd', 'baterai', 'kamera', 'speaker', 'charger',
        'software', 'ic', 'stuck logo', 'restart', 'sinyal',
        'mati', 'tombol', 'lupa sandi/pola', 'kena air',
        'pasang komponen', 'masalah lainnya'
      ]) AS kerusakan
    ),
    kerusakan_count AS (
      SELECT
        TRIM(LOWER(kerusakan)) AS kerusakan,
        COUNT(*)::int AS total
      FROM customers
      WHERE kerusakan IS NOT NULL
      GROUP BY TRIM(LOWER(kerusakan))
    ),
    total_all AS (
      SELECT COUNT(*)::numeric AS grand_total
      FROM customers
      WHERE kerusakan IS NOT NULL
    )
    SELECT
      k.kerusakan,
      COALESCE(c.total, 0) AS total,
      CASE
        WHEN t.grand_total = 0 THEN 0
        ELSE ROUND((COALESCE(c.total, 0) / t.grand_total * 100), 2)
      END AS persen
    FROM kerusakan_list k
    LEFT JOIN kerusakan_count c ON c.kerusakan = k.kerusakan
    CROSS JOIN total_all t
    ORDER BY total DESC
  `;
}
