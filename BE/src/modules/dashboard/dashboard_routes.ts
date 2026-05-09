import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import {
  getDashboardStatsController,
  getKerusakanStatsController,
  getMonthlyStatsController,
} from "./dashboard_controller.js";

const router = Router();

router.get("/stats", authenticate, getDashboardStatsController);
router.get("/monthly", authenticate, getMonthlyStatsController);
router.get("/kerusakan", authenticate, getKerusakanStatsController);
export default router;
