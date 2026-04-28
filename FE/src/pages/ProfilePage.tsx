import { useState, useEffect, useCallback, Key } from "react";
import { customerApi } from "@/services/api";
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
  Users,
} from "lucide-react";

const statusConfig: Record<
  ServiceStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  "proses transaksi": {
    label: "Proses Transaksi",
    className: "bg-info/15 text-info border-info/30",
    icon: Clock,
  },
  deal: {
    label: "Deal",
    className: "bg-success/15 text-success border-success/30",
    icon: CheckCircle2,
  },
  "menunggu part": {
    label: "Menunggu Part",
    className: "bg-warning/15 text-warning border-warning/30",
    icon: AlertCircle,
  },
  diproses: {
    label: "Diproses",
    className: "bg-primary/15 text-primary border-primary/30",
    icon: Clock,
  },
  ok: {
    label: "Selesai",
    className: "bg-success/15 text-success border-success/30",
    icon: CheckCircle2,
  },
  "not good": {
    label: "Tidak Jadi",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    icon: AlertCircle,
  },

  diambil: {
    label: "Diambil",
    className: "bg-success/15 text-success border-success/30",
    icon: CheckCircle2,
  },
  cancel: {
    label: "Batal",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    icon: AlertCircle,
  },
};

function ServiceCard({ order }: { order: ServiceOrder["customers"] }) {
  const config =
    statusConfig[order.status as ServiceStatus] || statusConfig["diproses"];
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
              {order.merk_hp}
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
          <span>{order.kerusakan}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span>{order.nama_customer}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span>Masuk: 11-02-26</span>
          {order.tgl_keluar && (
            <span className="text-success">• Selesai: {"11-02-26"}</span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t flex items-center justify-between">
        <div className="flex items-start gap-2 text-xs text-muted-foreground max-w-[60%]">
          <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span className="line-clamp-1">{order.catatan}</span>
        </div>
        <p className="font-semibold text-sm text-foreground">
          {formatCurrency(order.biaya)}
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = JSON.parse(localStorage.getItem("user"));
  const [tab, setTab] = useState("all");

  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  // Define status grouping for tabs
  const statusGroups: Record<string, ServiceStatus[]> = {
    all: [],
    diproses: ["proses transaksi", "deal", "menunggu part", "diproses"],
    ok: ["ok", "diambil"],
    "not good": ["not good", "cancel"],
  };
  const loadOrders = useCallback(async () => {
    try {
      const data = await customerApi.getByTechnician(user.name);
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    }
  }, [user.name]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);
  // Flatten all customers from all orders
  const allCustomers = orders.flatMap((order) => order.customers);

  // Filter berdasarkan tab
  const filtered =
    tab === "all"
      ? allCustomers
      : allCustomers.filter((customer) =>
          statusGroups[tab]?.includes(customer.status as ServiceStatus),
        );
  console.log("Filtered Customers:", filtered);
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
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total Customer",
            value: orders[0]?.total_customers || 0,
            color: "bg-primary/10 text-primary",
            bg: "bg-primary/10",
            icon: Users,
          },
          {
            label: "diproses",
            value: orders[0]?.hp_diproses || 0,
            color: "text-primary",
            bg: "bg-primary/10",
            icon: Clock,
          },
          {
            label: "Selesai",
            value: orders[0]?.hp_selesai || 0,
            color: "text-success",
            bg: "bg-success/10",
            icon: CheckCircle2,
          },
          {
            label: "tidak jadi",
            value: orders[0]?.hp_tidak_jadi || 0,
            color: "text-warning",
            bg: "bg-warning/10",
            icon: AlertCircle,
          },
          {
            label: "Pendapatan",
            value: formatCurrency(orders[0]?.total_fee || 0),
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
              <TabsTrigger value="diproses" className="text-xs">
                Diproses
              </TabsTrigger>
              <TabsTrigger value="ok" className="text-xs">
                Selesai
              </TabsTrigger>
              <TabsTrigger value="not good" className="text-xs">
                Tidak jadi
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
                {filtered.map((customer, index) => (
                  <ServiceCard key={customer.id || index} order={customer} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
