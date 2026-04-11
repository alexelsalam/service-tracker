import { Request, Response, NextFunction } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export function catchAsync(fn: AsyncController) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next); // kalau error, lempar ke errorHandler
  };
}
