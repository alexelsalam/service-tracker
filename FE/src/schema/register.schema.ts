import z from "zod";

export const registerSchema = z
  .object({
    nama: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
    role: z.enum(["admin", "teknisi"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"], // error muncul di field confirmPassword
  });
export type RegisterForm = z.infer<typeof registerSchema>;
