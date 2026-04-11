import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sql from "../../config/db.js";
import { RegisterInput, LoginInput } from "./auth_schema.js";
import { AppError } from "../../utils/AppError.js";

type User = {
  id: string;
  nama: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
};

export async function register(input: RegisterInput) {
  // Cek email sudah terdaftar
  const existing = await sql<User[]>`
    SELECT id FROM users WHERE email = ${input.email}
  `;

  if (existing.length > 0) {
    throw AppError.conflict("Email sudah terdaftar");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(input.password, 10);

  // Simpan ke DB
  const [user] = await sql<User[]>`
    INSERT INTO users (nama, email, password, role)
    VALUES (${input.nama}, ${input.email}, ${hashedPassword}, ${input.role})
    RETURNING id, nama, email, role, created_at
  `;

  return user;
}

export async function login(input: LoginInput) {
  // Cari user by email
  const [user] = await sql<User[]>`
    SELECT * FROM users WHERE email = ${input.email}
  `;

  if (!user) {
    throw AppError.unauthorized("Email atau password salah");
  }

  // Cek password
  const isValid = await bcrypt.compare(input.password, user.password);
  if (!isValid) {
    throw AppError.unauthorized("Email atau password salah");
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.nama,
      email: user.email,
      role: user.role,
    },
  };
}
