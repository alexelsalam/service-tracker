import { Request, Response } from "express";
import { registerSchema, loginSchema } from "./auth_schema.js";
import * as authService from "./auth_service.js";
import { catchAsync } from "../../utils/catchAsync.js";
// import { AppError } from "../../utils/AppError.js";

export const registerController = catchAsync(
  async (req: Request, res: Response) => {
    const input = registerSchema.parse(req.body);
    const user = await authService.register(input);
    res.status(201).json({ success: true, data: user });
  },
);

export const loginController = catchAsync(
  async (req: Request, res: Response) => {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    res.status(200).json({ success: true, data: result });
  },
);
