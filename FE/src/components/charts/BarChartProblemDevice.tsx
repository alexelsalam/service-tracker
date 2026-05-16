import {
  dashboardApi,
  KerusakanStatsResponse,
} from "@/services/api/dashboardApi";
import { useCallback, useEffect, useState } from "react";
import Chart from "react-apexcharts";

const BarChartProblemDevice = () => {
  const [barChartData, setBarChartData] =
    useState<KerusakanStatsResponse | null>(null);
  const barData = useCallback(async () => {
    const data = await dashboardApi.getBarChartData();
    setBarChartData(data);
  }, []);
  useEffect(() => {
    barData();
  }, [barData]);
  const chartData = Array.isArray(barChartData?.data)
    ? barChartData.data.map((item) => ({
        kerusakan: item.kerusakan,
        total: item.total,
      }))
    : [];
  // State untuk data (series) dan kategori (xaxis)
  const series =
    chartData.length > 0
      ? [
          {
            name: "Total Kerusakan",
            data: chartData.map((item) => item.total),
          },
        ]
      : [];
  const options = {
    chart: {
      type: "bar",
      height: 350,
    } as const,
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: true,
      },
    } as const,
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories:
        chartData.length > 0 ? chartData.map((item) => item.kerusakan) : [],
    },
  };

  return (
    <div className="sm:p-5 rounded-lg h-96 sm:w-full lg:w-96">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default BarChartProblemDevice;
