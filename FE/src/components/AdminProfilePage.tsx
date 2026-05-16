import { customerApi } from "@/services/api/customerApi";
import { ServiceOrder } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { Plus, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { NavLink } from "react-router-dom";
interface stats {
  label: string;
  value: number;
  color?: string;
}
function ServiceCard({
  title,
  fee,
  stats,
}: {
  title: string;
  fee: number;
  stats: stats[];
}) {
  return (
    <div className="">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 bg-linear-to-r from-primary/80 to-primary/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Icon Circle */}
              <div className="w-16 h-16 rounded-full bg-linear-to-br bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <User className="h-8 w-8" />
              </div>

              {/* Title & Description */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
            </div>

            {/* fee */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-500">Fee</span>
              <span className="text-sm font-bold text-green-700">
                {formatCurrency(fee)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 divide-x divide-gray-100">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-4 text-center hover:bg-gray-50 transition-colors"
            >
              <div className={`text-lg font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-700 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Example Usage
export default function AdminProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [technician, setTechnician] = useState<ServiceOrder[]>([]);
  const loadTechnician = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await customerApi.getByTechnicianAll();
      setTechnician(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      setTechnician([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data and reload when month/year changes
  useEffect(() => {
    loadTechnician();
  }, [loadTechnician]);
  const allTechnicians = technician.flatMap((o) => o.teknisi);

  return (
    <div className="px-5 overflow-hidden flex flex-wrap gap-3">
      {/* Custom example */}
      <div className="flex flex-row gap-3">
        {technician.map((o, index) => (
          <ServiceCard
            key={index}
            title={o.teknisi}
            fee={Number(o.total_fee)}
            stats={[
              {
                label: "Total ",
                value: Number(o.total_customers),
                color: "text-blue-600",
              },
              {
                label: "Selesai",
                value: Number(o.hp_selesai),
                color: "text-green-600",
              },
              {
                label: "Diproses",
                value: Number(o.hp_diproses),
                color: "text-yellow-600",
              },
              {
                label: "Tidak Jadi",
                value: Number(o.hp_tidak_jadi),
                color: "text-red-600",
              },
            ]}
          />
        ))}
      </div>
      <NavLink
        to="/register"
        className="w-full md:w-1/2 lg:w-90.5 h-45 bg-gray-300  border border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow my-3 md:my-0 rounded-2xl flex justify-center items-center"
      >
        <Plus className="h-25 w-20 stroke-[0.7px]" />
      </NavLink>
    </div>
  );
}
