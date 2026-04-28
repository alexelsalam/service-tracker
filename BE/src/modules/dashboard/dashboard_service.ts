import sql from "../../config/db.js";

type DashboardStats = {
  total_customers_this_month: number;
  hp_proses_transaksi: number;
  hp_deal: number;
  hp_diproses: number;
  hp_selesai_bulan_ini: number;
};

export async function getDashboardStats() {
  const [stats] = await sql<DashboardStats[]>`
    SELECT
      -- Total customer bulan ini
      (
        SELECT COUNT(*)::int
        FROM customers
        WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
      ) AS total_customers_this_month,

      -- HP sedang dalam proses transaksi (status: proses transaksi)
      (
        SELECT COUNT(*)::int
        FROM customers
        WHERE status = 'proses transaksi'
      ) AS hp_proses_transaksi,

      -- HP deal / selesai transaksi (status: deal)
      (
        SELECT COUNT(*)::int
        FROM customers
        WHERE status = 'deal'
      ) AS hp_deal,
      -- HP dalam proses (status: diproses)
      (
        SELECT COUNT(*)::int
        FROM customers
        WHERE status = 'diproses'
      ) AS hp_diproses,
      -- HP selesai bulan ini (status: selesai)
      (
        SELECT COUNT(*)::int
        FROM customers
        WHERE status IN ('ok')
        
      ) AS hp_selesai_bulan_ini
  `;

  return stats;
}
