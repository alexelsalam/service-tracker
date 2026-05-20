import { formatCurrency } from "@/utils/formatCurrency";
import { User } from "lucide-react";

interface stats {
  label: string;
  value: number;
  color?: string;
}
export default function ServiceCardAdmin({
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
