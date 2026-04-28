import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import * as dashboardService from "./dashboard_service.js";

export const getDashboardStatsController = catchAsync(
  async (req: Request, res: Response) => {
    const stats = await dashboardService.getDashboardStats();
    res.json({ success: true, data: stats });
  },
);
