import {
  dashboardApi,
  MonthlyStatsResponse,
} from "@/services/api/dashboardApi";
import { useCallback, useEffect, useState } from "react";
import Chart from "react-apexcharts";
// #region Sample data
const data = [
  {
    name: "Januari",
    Total: 4000,
    Selesai: 2400,
  },
  {
    name: "Februari",
    Total: 3000,
    Selesai: 1398,
  },
  {
    name: "Maret",
    Total: 2000,
    Selesai: 9800,
  },
  {
    name: "April",
    Total: 2780,
    Selesai: 3908,
  },
  {
    name: "Mei",
    Total: 1890,
    Selesai: 4800,
  },
  {
    name: "Juni",
    Total: 2390,
    Selesai: 3800,
  },
  {
    name: "Juli",
    Total: 3490,
    Selesai: 4300,
  },
  {
    name: "Agustus",
    Total: 3000,
    Selesai: 2400,
  },
  {
    name: "September",
    Total: 2000,
    Selesai: 1398,
  },
];
// #endregion

export default function ChartsTotalService() {
  const [lineChartData, setLineChartData] = useState<MonthlyStatsResponse>();
  const lineData = useCallback(async () => {
    const data = await dashboardApi.getLineChartData();
    setLineChartData(data);
  }, []);
  useEffect(() => {
    lineData();
  }, [lineData]);
  const chartData = Array.isArray(lineChartData?.data)
    ? lineChartData.data.map((item) => ({
        label: item.label,
        TotalCustomers: item.total_customers,
        TotalHPSelesai: item.total_hp_selesai,
      }))
    : [];
  const series = [
    {
      name: "Total Customers",
      data: chartData.map((item) => item.TotalCustomers),
    },
    {
      name: "Total HP Selesai",
      data: chartData.map((item) => item.TotalHPSelesai),
    },
  ];
  const options = {
    chart: {
      height: 350,
      type: "area" as const,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    } as const,

    xaxis: {
      type: "category" as const,
      categories: chartData.map((item) => item.label),
    },
  };
  return (
    <div className="p-5 rounded-lg w-full h-96">
      <Chart options={options} series={series} type="area" height={350} />
    </div>
  );
}
