import { Router } from "express";
import { authenticate, authorizeAdmin } from "../../middlewares/auth.js";
import {
  getAllCustomersController,
  getCustomerByIdController,
  createCustomerController,
  updateCustomerController,
  deleteCustomerController,
  getCustomersByTechnicianController,
} from "./customer_controller.js";

const router = Router();

router.get("/", authenticate, getAllCustomersController);
router.get("/:teknisi", authenticate, getCustomersByTechnicianController);
router.get("/:id", authenticate, getCustomerByIdController);
router.post("/", authenticate, createCustomerController);
router.put("/:id", authenticate, updateCustomerController);
router.delete("/:id", authenticate, authorizeAdmin, deleteCustomerController);

export default router;
