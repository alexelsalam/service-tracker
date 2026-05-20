import { customerApi } from "@/services/api/customerApi";
import { ServiceOrder } from "@/types";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ServiceCardAdmin from "./ui/ServiceCardAdmin";

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

  return (
    <div className="px-5 overflow-hidden flex flex-wrap gap-3">
      {/* Custom example */}
      <div className="flex flex-row gap-3">
        {technician.map((o, index) => (
          <ServiceCardAdmin
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
