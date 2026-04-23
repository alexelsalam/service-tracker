import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { dashboardApi } from "@/services/api";
import { ServiceOrder, ServiceStatus } from "@/types";
import { formatCurrency } from "@/utils/dummy-data";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Smartphone,
  MessageSquare,
} from "lucide-react";

const statusConfig: Record<
  ServiceStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  pending: {
    label: "Menunggu",
    className: "bg-warning/15 text-warning border-warning/30",
    icon: AlertCircle,
  },
  in_progress: {
    label: "Dikerjakan",
    className: "bg-primary/15 text-primary border-primary/30",
    icon: Clock,
  },
  completed: {
    label: "Selesai",
    className: "bg-success/15 text-success border-success/30",
    icon: CheckCircle2,
  },
};

function ServiceCard({ order }: { order: ServiceOrder }) {
  const config = statusConfig[order.status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow animate-slide-up">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Smartphone className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              {order.device}
            </p>
            <p className="text-xs text-muted-foreground">{order.id}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`${config.className} text-xs font-medium gap-1`}
        >
          <StatusIcon className="h-3 w-3" />
          {config.label}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2 text-muted-foreground">
          <Wrench className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{order.keluhan}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span>{order.customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span>Masuk: {order.tanggalMasuk}</span>
          {order.tanggalSelesai && (
            <span className="text-success">
              • Selesai: {order.tanggalSelesai}
            </span>
          )}
        </div>
        {order.sparepartsUsed.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {order.sparepartsUsed.map((sp) => (
              <span
                key={sp}
                className="text-xs bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground"
              >
                {sp}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t flex items-center justify-between">
        <div className="flex items-start gap-2 text-xs text-muted-foreground max-w-[60%]">
          <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span className="line-clamp-1">{order.catatan}</span>
        </div>
        <p className="font-semibold text-sm text-foreground">
          {formatCurrency(order.estimasiBiaya)}
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("all");

  const [orders, setOrders] = useState<ServiceOrder[]>([]);

  const loadOrders = useCallback(async () => {
    const data = await dashboardApi.getServiceOrders();
    setOrders(data);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filtered =
    tab === "all" ? orders : orders.filter((o) => o.status === tab);

  const totalCompleted = orders.filter((o) => o.status === "completed").length;
  const totalInProgress = orders.filter(
    (o) => o.status === "in_progress",
  ).length;
  const totalPending = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.estimasiBiaya, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="h-24 bg-linear-to-r from-primary/80 to-primary/40" />
        <div className="px-5 pb-5 -mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-4 border-card shadow-md">
              {user?.name?.charAt(0) ?? "U"}
            </div>
            <div className="flex-1 pt-2">
              <h1 className="text-xl font-bold text-foreground">
                {user?.name ?? "username"}
              </h1>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <Mail className="h-3.5 w-3.5" />
                {user?.email ?? "email@example.com"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Teknisi • Bergabung sejak Januari 2024
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Selesai",
            value: totalCompleted,
            color: "text-success",
            bg: "bg-success/10",
            icon: CheckCircle2,
          },
          {
            label: "Dikerjakan",
            value: totalInProgress,
            color: "text-primary",
            bg: "bg-primary/10",
            icon: Clock,
          },
          {
            label: "Menunggu",
            value: totalPending,
            color: "text-warning",
            bg: "bg-warning/10",
            icon: AlertCircle,
          },
          {
            label: "Pendapatan",
            value: formatCurrency(totalRevenue),
            color: "text-foreground",
            bg: "bg-accent",
            icon: Wrench,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border rounded-xl p-4 animate-slide-up"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Orders */}
      <div>
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Riwayat Service
            </h2>
            <TabsList className="bg-muted">
              <TabsTrigger value="all" className="text-xs">
                Semua
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="text-xs">
                Dikerjakan
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs">
                Selesai
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">
                Menunggu
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={tab} className="mt-0">
            {filtered.length === 0 ? (
              <div className="bg-card border rounded-xl p-10 text-center">
                <Wrench className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Tidak ada data service untuk kategori ini.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filtered.map((order) => (
                  <ServiceCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
