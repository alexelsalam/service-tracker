import { Router } from "express";
import { authenticate, authorizeAdmin } from "../../middlewares/auth.js";
import {
  getAllSparePartsController,
  getSparePartByIdController,
  createSparePartController,
  updateSparePartController,
  addStockController,
  reduceStockController,
  deleteSparePartController,
} from "./sparePart_controller.js";

const router = Router();

router.get("/", authenticate, getAllSparePartsController);
router.get("/:id", authenticate, getSparePartByIdController);
router.post("/", authenticate, authorizeAdmin, createSparePartController);
router.put("/:id", authenticate, authorizeAdmin, updateSparePartController);
router.patch(
  "/:id/add-stock",
  authenticate,
  authorizeAdmin,
  addStockController,
);
router.patch("/:id/reduce-stock", authenticate, reduceStockController);
router.delete("/:id", authenticate, authorizeAdmin, deleteSparePartController);

export default router;
