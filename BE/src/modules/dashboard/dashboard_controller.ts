import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import * as dashboardService from "./dashboard_service.js";

export const getDashboardStatsController = catchAsync(
  async (req: Request, res: Response) => {
    const { bulan, tahun } = req.query;
    const bulanParam = typeof bulan === "string" ? bulan : undefined;
    const tahunParam = typeof tahun === "string" ? tahun : undefined;
    const stats = await dashboardService.getDashboardStats(
      bulanParam,
      tahunParam,
    );
    res.json({ success: true, data: stats });
  },
);
export const getMonthlyStatsController = catchAsync(
  async (req: Request, res: Response) => {
    const stats = await dashboardService.getMonthlyStats();
    res.json({ success: true, data: stats });
  },
);
export const getKerusakanStatsController = catchAsync(
  async (req: Request, res: Response) => {
    const stats = await dashboardService.getKerusakanStats();
    res.json({ success: true, data: stats });
  },
);
