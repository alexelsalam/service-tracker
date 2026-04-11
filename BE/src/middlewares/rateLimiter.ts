import rateLimit from "express-rate-limit";

// =====================
// General — semua endpoint
// =====================
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // max 100 request per 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak request, coba lagi dalam 15 menit",
  },
});

// =====================
// Auth — ketat untuk login & register
// =====================
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // max 10 request per 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak percobaan login, coba lagi dalam 15 menit",
  },
});
