import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = {
  id: string;
  role: string;
};

// Extend Request supaya bisa simpan data user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// =====================
// Cek token valid
// =====================
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Token tidak ada" });
    return;
  }

  const token = authHeader.split(" ")[1] as string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token tidak valid" });
  }
}

// =====================
// Cek role (admin only)
// =====================
export function authorizeAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user?.role !== "admin") {
    res
      .status(403)
      .json({ success: false, message: "Akses ditolak, admin only" });
    return;
  }
  next();
}
