import { Request, Response } from "express";
import {
  createCustomerSchema,
  customerQuerySchema,
  updateCustomerSchema,
} from "./customer_schema.js";
import * as customerService from "./customer_service.js";
// customer.controller.ts
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/AppError.js";

export const getAllCustomersController = catchAsync(
  async (req: Request, res: Response) => {
    const query = customerQuerySchema.parse(req.query);

    const customers = await customerService.getAllCustomers(query);
    res.json({ success: true, data: customers });
  },
);
export const getCustomersByAllTechnicianController = catchAsync(
  async (req: Request, res: Response) => {
    const query = customerQuerySchema.parse(req.query);
    const data = await customerService.getCustomersByAllTechnician(query);
    res.json({ success: true, data });
  },
);
export const getCustomersByTechnicianController = catchAsync(
  async (req: Request, res: Response) => {
    // Ambil nama teknisi dari token JWT yang login
    const teknisi = req.user?.name;
    if (!teknisi) throw AppError.unauthorized("Teknisi tidak ditemukan");

    const query = customerQuerySchema.parse(req.query);
    const data = await customerService.getCustomersByTechnician(teknisi, query);

    res.json({ success: true, data: data[0] ?? [] });
  },
);
export const getCustomerByIdController = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerById(
    req.params.id as string,
  );
  res.json({ success: true, data: customer });
});

export const createCustomerController = catchAsync(async (req, res) => {
  const input = createCustomerSchema.parse(req.body);
  const customer = await customerService.createCustomer(input);
  res.status(201).json({ success: true, data: customer });
});

export const updateCustomerController = catchAsync(async (req, res) => {
  const input = updateCustomerSchema.parse(req.body);
  const customer = await customerService.updateCustomer(
    req.params.id as string,
    input,
  );
  res.json({ success: true, data: customer });
});

export const deleteCustomerController = catchAsync(async (req, res) => {
  await customerService.deleteCustomer(req.params.id as string);
  res.json({ success: true, message: "Customer berhasil dihapus" });
});
