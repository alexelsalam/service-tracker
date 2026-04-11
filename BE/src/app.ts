import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRouter from "./modules/auth/auth_routes.js";
import customerRouter from "./modules/customers/customer_routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authLimiter, generalLimiter } from "./middlewares/rateLimiter.js";
dotenv.config();

const app = express();

// =====================
// Middleware Global
// =====================
app.use(helmet()); // security headers
app.use(cors()); // allow cross-origin
app.use(express.json()); // parse JSON body
app.use(generalLimiter);
// =====================
// Health Check
// =====================
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// =====================
// Routes (tambah nanti)
// =====================

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/customers", customerRouter);
// app.use('/api/service-orders', serviceOrdersRouter);
// app.use('/api/spare-parts', sparePartsRouter);
// app.use('/api/payments', paymentsRouter);

// =====================
// 404 Handler
// =====================
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route tidak ditemukan" });
});

// =====================
// Error Handler
// =====================

app.use(errorHandler);
// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
