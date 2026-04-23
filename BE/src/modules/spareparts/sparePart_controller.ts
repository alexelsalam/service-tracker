import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  createSparePartSchema,
  updateSparePartSchema,
  updateStockSchema,
} from "./sparePart_schema.js";
import * as sparePartService from "./sparePart_service.js";

export const getAllSparePartsController = catchAsync(
  async (req: Request, res: Response) => {
    const spareParts = await sparePartService.getAllSpareParts();
    res.json({ success: true, data: spareParts });
  },
);

export const getSparePartByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const sparePart = await sparePartService.getSparePartById(
      req.params.id as string,
    );
    res.json({ success: true, data: sparePart });
  },
);

export const createSparePartController = catchAsync(
  async (req: Request, res: Response) => {
    const input = createSparePartSchema.parse(req.body);
    const sparePart = await sparePartService.createSparePart(input);
    res.status(201).json({ success: true, data: sparePart });
  },
);

export const updateSparePartController = catchAsync(
  async (req: Request, res: Response) => {
    const input = updateSparePartSchema.parse(req.body);
    const sparePart = await sparePartService.updateSparePart(
      req.params.id as string,
      input,
    );
    res.json({ success: true, data: sparePart });
  },
);

export const addStockController = catchAsync(
  async (req: Request, res: Response) => {
    const input = updateStockSchema.parse(req.body);
    const sparePart = await sparePartService.addStock(
      req.params.id as string,
      input,
    );
    res.json({ success: true, data: sparePart });
  },
);

export const reduceStockController = catchAsync(
  async (req: Request, res: Response) => {
    const input = updateStockSchema.parse(req.body);
    const sparePart = await sparePartService.reduceStock(
      req.params.id as string,
      input,
    );
    res.json({ success: true, data: sparePart });
  },
);

export const deleteSparePartController = catchAsync(
  async (req: Request, res: Response) => {
    await sparePartService.deleteSparePart(req.params.id as string);
    res.json({ success: true, message: "Spare part berhasil dihapus" });
  },
);
