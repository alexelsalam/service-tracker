import { useState, useEffect, useCallback } from "react";
import { Users, Package, Smartphone, Wrench, Handshake } from "lucide-react";
import {
  dashboardApi,
  DashboardStatsResponse,
} from "@/services/api/dashboardApi";

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);

  const loadStats = useCallback(async () => {
    const data = await dashboardApi.getStats();
    setStats(data);
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const items = [
    {
      label: "Total Customer",
      value: stats?.data?.total_customers_this_month ?? "--",
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Proses transaksi",
      value: stats?.data?.hp_proses_transaksi ?? "--",
      icon: Package,
      color: "bg-destructive/10 text-destructive",
    },
    {
      label: "Deal",
      value: stats?.data?.hp_deal ?? "--",
      icon: Handshake,
      color: "bg-success/10 text-success",
    },

    {
      label: "Device Dalam Proses",
      value: stats?.data?.hp_diproses ?? "--",
      icon: Smartphone,
      color: "bg-warning/10 text-warning",
    },
    {
      label: "Selesai Bulan Ini",
      value: stats?.data?.hp_selesai_bulan_ini ?? "--",
      icon: Wrench,
      color: "bg-accent text-accent-foreground",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang di panel admin Service HP
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map((s) => (
          <div
            key={s.label}
            className="bg-card rounded-xl border p-5 animate-slide-up"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border p-6">
        <h2 className="font-semibold text-foreground mb-2">
          Aktivitas Terkini
        </h2>
        <p className="text-sm text-muted-foreground">
          Belum ada aktivitas terbaru. Data akan muncul setelah ada transaksi
          service.
        </p>
      </div>
    </div>
  );
}
