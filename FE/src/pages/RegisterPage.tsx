import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const registerSchema = z
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
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = async (data: RegisterForm) => {
    try {
      const result = await authRegister(
        data.nama,
        data.role,
        data.email,
        data.password,
      );
      if (!result.success) {
        toast.error(
          result.message ||
            "Pendaftaran gagal. Pastikan semua data sudah benar.",
        );
        return;
      }

      toast.success("Pendaftaran berhasil!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary text-primary-foreground mb-4">
            <Smartphone className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Buat Akun</h1>
          <p className="text-muted-foreground mt-1">
            Daftar untuk mulai mengelola service
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm border p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                placeholder="Nama Anda"
                {...register("nama")}
                className={errors.nama ? "border-destructive" : ""}
              />
              {errors.nama && (
                <p className="text-sm text-destructive mt-1">
                  {errors.nama.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                {...register("role")}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.role ? "border-destructive" : "border-input"
                }`}
              >
                <option value="">Pilih Role</option>
                <option value="admin">Admin</option>
                <option value="teknisi">Teknisi</option>
              </select>
              {errors.role && (
                <p className="text-sm text-destructive mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...
                </>
              ) : (
                "Daftar"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
