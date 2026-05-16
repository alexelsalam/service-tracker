import { useState, useEffect, useCallback } from "react";
import { customerApi } from "@/services/api";
import { ServiceOrder, ServiceStatus } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, Clock, CheckCircle2, AlertCircle, Users } from "lucide-react";
import { ServiceCard } from "@/components/ui/ServiceCard";
export default function TeknisiProfile() {
  const [tab, setTab] = useState("all");

  // Initialize with current month and year
  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1);
  const currentYear = String(currentDate.getFullYear());

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Define status grouping for tabs
  const statusGroups: Record<string, ServiceStatus[]> = {
    all: [],
    diproses: ["proses transaksi", "deal", "menunggu part", "diproses"],
    ok: ["ok", "diambil"],
    "not good": ["not good", "cancel"],
  };

  const loadOrders = useCallback(async (bulan?: string, tahun?: string) => {
    setIsLoading(true);
    try {
      const data = await customerApi.getByTechnician(
        bulan || undefined,
        tahun || undefined,
      );
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data and reload when month/year changes
  useEffect(() => {
    // Jika bulan/tahun kosong string, set ke undefined
    const month = selectedMonth === "" ? undefined : selectedMonth;
    const year = selectedYear === "" ? undefined : selectedYear;

    loadOrders(month, year);
  }, [loadOrders, selectedMonth, selectedYear]);
  // Flatten all customers from all orders
  const allCustomers = orders.flatMap((order) => order.customers);
  // Filter berdasarkan tab

  const filtered =
    tab === "all"
      ? allCustomers
      : allCustomers.filter((customer) =>
          statusGroups[tab]?.includes(customer.status as ServiceStatus),
        );
  console.log(filtered);
  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-90 sm:w-full px-1">
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
          <div className="flex gap-2 md:items-center md:justify-between md:mb-4 px-2">
            <h2 className="text-lg font-semibold text-foreground text-wrap  md:text-nowrap">
              <span>Riwayat</span> <span>Service</span>
            </h2>

            {/* date data */}
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="month-filter-profile" className="text-xs">
                  Bulan
                </label>
                <select
                  id="month-filter-profile"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="flex h-7 p-1 sm:h-10 rounded-md border border-input bg-background  sm:px-3 sm:py-2 text-xs sm:text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="">Semua Bulan</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {new Date(2024, month - 1).toLocaleString("id-ID", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="year-filter-profile" className="text-xs">
                  Tahun
                </label>
                <select
                  id="year-filter-profile"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="flex h-7 p-1 sm:h-10 rounded-md border border-input bg-background sm:px-3 sm:py-2 text-xs sm:text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="">Semua Tahun</option>
                  {Array.from(
                    { length: 10 },
                    (_, i) => new Date().getFullYear() - i,
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* data content */}
          {/* tabs data */}
          <div className="flex justify-center items-center w-full">
            <TabsList className="bg-muted mt-1 ">
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
            {isLoading ? (
              <div className="bg-card border rounded-xl p-10 text-center">
                <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2 animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Memuat data service...
                </p>
              </div>
            ) : filtered?.length === 0 ? (
              <div className="bg-card border rounded-xl p-10 text-center">
                <Wrench className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Tidak ada data service untuk kategori ini.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filtered?.map((customer) => {
                  console.log(customer);
                  return <ServiceCard key={customer.id} order={customer} />;
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
