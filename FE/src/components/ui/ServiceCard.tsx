import { ServiceOrder, ServiceStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

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
import { formatCurrency } from "@/utils/formatCurrency";

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

export function ServiceCard({ order }: { order: ServiceOrder["customers"] }) {
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
            <p className="text-xs text-muted-foreground">{order.kode_data}</p>
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
