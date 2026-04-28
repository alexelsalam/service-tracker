import { Router } from "express";
import { authenticate } from "../../middlewares/auth.js";
import { getDashboardStatsController } from "./dashboard_controller.js";

const router = Router();

router.get("/stats", authenticate, getDashboardStatsController);

export default router;
