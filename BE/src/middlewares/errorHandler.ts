import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Error validasi Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validasi gagal",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // Error custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Error tidak terduga
  console.error("Unexpected error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
